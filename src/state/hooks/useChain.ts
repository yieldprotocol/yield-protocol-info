import { useEffect } from 'react';
import { Contract, ethers, Event, EventFilter } from 'ethers';
import { format } from 'date-fns';
import { useAppDispatch } from './general';
import {
  setChainLoading,
  setSeriesLoading,
  setStrategiesLoading,
  setAssetsLoading,
  updateSeries,
  updateStrategies,
  updateAssets,
  updateProvider,
  getAssetPairData,
} from '../actions/chain';
import { updateContractMap } from '../actions/contracts';

import * as yieldEnv from '../../yieldEnv.json';
import * as contracts from '../../contracts';

import { getSeason, SeasonType } from '../../utils/appUtils';
import { IAsset, IAssetMap } from '../../types/chain';
import { updateVersion } from '../actions/application';
import { IContractMap } from '../../types/contracts';
import { CAULDRON, LADLE, POOLVIEW, SECONDS_PER_YEAR } from '../../utils/constants';
import { getABI } from '../../utils/etherscan';
import { USDC } from '../../config/assets';

const assetDigitFormatMap = new Map([
  ['ETH', 6],
  ['WBTC', 6],
  ['DAI', 2],
  ['USDC', 2],
  ['USDT', 2],
  ['STETH', 6],
]);

const useChain = (chainId: number) => {
  const dispatch = useAppDispatch();

  dispatch(updateVersion(process.env.REACT_APP_VERSION!));

  const provider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(
    process.env[`REACT_APP_RPC_URL_${chainId.toString()}`]
  );

  useEffect(() => {
    if (provider) {
      dispatch(updateProvider(provider));
      /* Get the instances of the Base contracts */
      const addrs = (yieldEnv.addresses as any)[chainId];

      /* Update the baseContracts state */
      const newContractMap: IContractMap = {};

      [...Object.keys(addrs)].forEach(async (name: string) => {
        let contract: Contract | undefined;

        // try to connect directly to contract
        try {
          contract = (contracts as any)[`${name}__factory`].connect(addrs[name], provider);
        } catch (e) {
          console.log(`could not connect directly to contract ${name}`);
        }

        // try to connect to contract via etherscan
        if (!contract) {
          try {
            const abi = await getABI(chainId, addrs[name]);
            contract = new ethers.Contract(addrs[name], abi, provider);
          } catch (e) {
            console.log(`could not connect to contract ${name} via etherscan`);
          }
        }

        if (contract) newContractMap[name] = contract;
      });

      const Cauldron: Contract = newContractMap[CAULDRON];
      const Ladle: Contract = newContractMap[LADLE];

      dispatch(updateContractMap(newContractMap));

      /* Get the hardcoded strategy addresses */
      const strategyAddresses = (yieldEnv.strategies as any)[chainId];

      /* add on extra/calculated ASSET info  and contract instances */
      const _chargeAsset = (asset: any) => ({
        ...asset,
        digitFormat: assetDigitFormatMap.has(asset.symbol) ? assetDigitFormatMap.get(asset.symbol) : 6,
      });

      const _getAssets = async () => {
        try {
          dispatch(setAssetsLoading(true));
          /* get all the assetAdded, roacleAdded and joinAdded events and series events at the same time */
          const [assetAddedEvents, joinAddedEvents] = await Promise.all([
            Cauldron.queryFilter('AssetAdded' as EventFilter, 0),
            Ladle.queryFilter('JoinAdded' as EventFilter, 0),
          ]);
          /* Create a map from the joinAdded event data */
          const joinMap: Map<string, string> = new Map(
            joinAddedEvents.map((log: any) => Ladle.interface.parseLog(log).args) as [[string, string]]
          );

          const newAssets: any = {};

          await Promise.all(
            assetAddedEvents.map(async (x: Event) => {
              const { assetId: id, asset: address } = Cauldron.interface.parseLog(x).args;
              const ERC20 = contracts.ERC20Permit__factory.connect(address, provider);

              // get the token info
              let name: string;
              let symbol: string;
              let decimals: number;
              let version: string;

              try {
                [name, symbol, decimals, version] = await Promise.all([
                  ERC20.name(),
                  ERC20.symbol(),
                  ERC20.decimals(),
                  id === USDC ? '2' : '1', // TODO ERC20.version()
                ]);
              } catch (e) {
                /* TODO look at finding a better way to handle the pimple that is the Maker Token */
                const mkrABI = ['function name() view returns (bytes32)', 'function symbol() view returns (bytes32)'];
                const mkrERC20 = new ethers.Contract(address, mkrABI, provider);
                const mkrInfo = await Promise.all([mkrERC20.name(), mkrERC20.symbol()]);
                name = ethers.utils.parseBytes32String(mkrInfo[0]) as string;
                symbol = ethers.utils.parseBytes32String(mkrInfo[1]) as string;
                [decimals, version] = [18, '1'];
              }

              const joinAddress = joinMap.get(id);

              let symbol_;
              switch (symbol) {
                case 'WETH':
                  symbol_ = 'ETH';
                  break;
                case 'wstETH':
                  symbol_ = 'WSTETH';
                  break;
                default:
                  symbol_ = symbol;
              }

              const newAsset = {
                id,
                address,
                name,
                symbol: symbol_,
                decimals,
                version,
                joinAddress,
              };
              if (joinAddress) (newAssets as IAssetMap)[id] = _chargeAsset(newAsset);
            })
          );
          dispatch(updateAssets(newAssets));

          // get asset pair data
          Object.values(newAssets as IAssetMap).map((a: IAsset) =>
            dispatch(getAssetPairData(a, newAssets, newContractMap, chainId))
          );

          dispatch(setAssetsLoading(false));
        } catch (e) {
          dispatch(setAssetsLoading(false));
          console.log('Error getting assets', e);
        }
      };

      /* add on extra/calculated ASYNC series info and contract instances */
      const _chargeSeries = (_series: {
        maturity: number;
        baseId: string;
        poolAddress: string;
        fyTokenAddress: string;
      }) => {
        const season = getSeason(_series.maturity) as SeasonType;
        const oppSeason = (_season: SeasonType) => getSeason(_series.maturity + 23670000) as SeasonType;
        const [startColor, endColor, textColor]: string[] = yieldEnv.seasonColors[season];
        const [oppStartColor, oppEndColor, oppTextColor]: string[] = yieldEnv.seasonColors[oppSeason(season)];
        return {
          ..._series,

          fullDate: format(new Date(_series.maturity * 1000), 'dd MMMM yyyy'),
          displayName: format(new Date(_series.maturity * 1000), 'dd MMM yyyy'),

          season,
          startColor,
          endColor,
          color: `linear-gradient(${startColor}, ${endColor})`,
          textColor,

          oppStartColor,
          oppEndColor,
          oppTextColor,
        };
      };

      const _getSeries = async () => {
        try {
          dispatch(setSeriesLoading(true));
          /* get poolAdded events and series events at the same time */
          const [seriesAddedEvents, poolAddedEvents] = await Promise.all([
            Cauldron.queryFilter('SeriesAdded' as any, 0),
            Ladle.queryFilter('PoolAdded' as any, 0),
          ]);

          /* build a map from the poolAdded event data */
          const poolMap: Map<string, string> = new Map(
            poolAddedEvents.map((log: any) => Ladle.interface.parseLog(log).args) as [[string, string]]
          );

          const newSeriesObj: any = {};

          /* Add in any extra static series */
          await Promise.all([
            ...seriesAddedEvents.map(async (x: any): Promise<void> => {
              const { seriesId: id, baseId, fyToken } = Cauldron.interface.parseLog(x).args;
              const { maturity } = await Cauldron.series(id);

              if (poolMap.has(id)) {
                // only add series if it has a pool
                const poolAddress: string = poolMap.get(id) as string;
                const poolContract = contracts.Pool__factory.connect(poolAddress, provider);
                const fyTokenContract = contracts.FYToken__factory.connect(fyToken, provider);

                const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol, totalSupply] =
                  await Promise.all([
                    fyTokenContract.name(),
                    fyTokenContract.symbol(),
                    fyTokenContract.version(),
                    fyTokenContract.decimals(),
                    poolContract.name(),
                    poolContract.version(),
                    poolContract.symbol(),
                    poolContract.totalSupply(),
                  ]);
                const newSeries = {
                  id,
                  baseId,
                  maturity,
                  name,
                  symbol,
                  version,
                  address: fyToken,
                  fyTokenAddress: fyToken,
                  decimals,
                  poolAddress,
                  poolVersion,
                  poolName,
                  poolSymbol,
                  totalSupply,
                };
                newSeriesObj[id] = _chargeSeries(newSeries);
              }
            }),
          ]);
          dispatch(updateSeries(newSeriesObj));
          dispatch(setSeriesLoading(false));
        } catch (e) {
          dispatch(setSeriesLoading(false));
          console.log('Error fetching series data: ', e);
        }
      };

      /* Iterate through the strategies list and update accordingly */
      const _getStrategies = async () => {
        const newStrategies: any = {};

        try {
          dispatch(setStrategiesLoading(true));
          await Promise.all(
            strategyAddresses.map(async (strategyAddr: string) => {
              const Strategy = contracts.Strategy__factory.connect(strategyAddr, provider);

              const [name, symbol, seriesId, poolAddress, baseId, decimals, version] = await Promise.all([
                Strategy.name(),
                Strategy.symbol(),
                Strategy.seriesId(),
                Strategy.pool(),
                Strategy.baseId(),
                Strategy.decimals(),
                Strategy.version(),
                Strategy.totalSupply(),
              ]);

              const newStrategy = {
                id: strategyAddr,
                address: strategyAddr,
                symbol,
                name,
                version,
                seriesId,
                poolAddress,
                baseId,
                decimals,
              };
              // update state and cache
              newStrategies[strategyAddr] = newStrategy;
            })
          );
          dispatch(updateStrategies(newStrategies));
          dispatch(setStrategiesLoading(false));
        } catch (e) {
          dispatch(setStrategiesLoading(false));
          console.log('Error getting strategies', e);
        }
      };

      /* LOAD the Series, Assets, Strategies, and contract events */
      (async () => {
        await Promise.all([_getAssets(), _getSeries(), _getStrategies()]);
        dispatch(setChainLoading(false));
      })();
    }
  }, [chainId, dispatch]);
};

export { useChain };
