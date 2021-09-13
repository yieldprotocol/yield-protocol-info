import React, { useEffect } from 'react';
import { ContractFactory, ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { NetworkConnector } from '@web3-react/network-connector';
import { format } from 'date-fns';
import { useAppDispatch } from './general';
import {
  setChainLoading,
  updateChainId,
  setSeriesLoading,
  setStrategiesLoading,
  setAssetsLoading,
  updateSeries,
  updateStrategies,
  updateAssets,
  reset,
} from '../actions/chain';

import * as yieldEnv from '../../yieldEnv.json';
import * as contracts from '../../contracts';
import { IAssetRoot, ISeriesRoot, IStrategyRoot } from '../../types/chain';

import { ETH_BASED_ASSETS } from '../../utils/constants';
import { nameFromMaturity, getSeason, SeasonType } from '../../utils/appUtils';

import DaiMark from '../../components/logos/DaiMark';
import EthMark from '../../components/logos/EthMark';
import TSTMark from '../../components/logos/TSTMark';
import USDCMark from '../../components/logos/USDCMark';
import WBTCMark from '../../components/logos/WBTCMark';
import USDTMark from '../../components/logos/USDTMark';
import YieldMark from '../../components/logos/YieldMark';

// const markMap = new Map([
//   ['DAI', <DaiMark key="dai" />],
//   ['USDC', <USDCMark key="usdc" />],
//   ['WBTC', <WBTCMark key="wbtc" />],
//   ['TST', <TSTMark key="tst" />],
//   ['ETH', <EthMark key="eth" />],
//   ['USDT', <USDTMark key="eth" />],
// ]);

const assetDigitFormatMap = new Map([
  ['ETH', 6],
  ['WBTC', 6],
  ['DAI', 2],
  ['USDC', 2],
  ['USDT', 2],
]);

/* Set up web3react config */
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.REACT_APP_RPC_URL_1 as string,
  42: process.env.REACT_APP_RPC_URL_42 as string,
  1337: process.env.REACT_APP_RPC_URL_1337 as string,
  31337: process.env.REACT_APP_RPC_URL_31337 as string,
};

interface IChainData {
  name: string;
  color: string;
  supported: boolean;
}

const chainData = new Map<number, IChainData>();
chainData.set(1, { name: 'Mainnet', color: '#29b6af', supported: false });
chainData.set(3, { name: 'Ropsten', color: '#ff4a8d', supported: false });
chainData.set(4, { name: 'Rinkeby', color: '#f6c343', supported: false });
chainData.set(5, { name: 'Goerli', color: '#3099f2', supported: false });
chainData.set(10, { name: 'Optimism', color: '#EB0822', supported: false });
chainData.set(42, { name: 'Kovan', color: '#7F7FFE', supported: true });

/* Build the context */

const useChain = () => {
  const dispatch = useAppDispatch();
  dispatch(reset());
  const defaultChainId = 42;
  const fallbackConnection = useWeb3React<ethers.providers.JsonRpcProvider>('fallback');
  const { library, chainId, activate } = fallbackConnection;

  /**
   * Update on FALLBACK connection/state on network changes (id/library)
   */
  useEffect(() => {
    chainId && updateChainId(chainId);

    if (library && chainId) {
      /* Get the instances of the Base contracts */
      const addrs = (yieldEnv.addresses as any)[chainId];
      const Cauldron = contracts.Cauldron__factory.connect(addrs.Cauldron, library);
      const Ladle = contracts.Ladle__factory.connect(addrs.Ladle, library);
      const ChainlinkMultiOracle = contracts.ChainlinkMultiOracle__factory.connect(addrs.ChainlinkMultiOracle, library);
      const CompositeMultiOracle = contracts.CompositeMultiOracle__factory.connect(addrs.CompositeMultiOracle, library);

      /* Update the baseContracts state : ( hardcoded based on networkId ) */
      const newContractMap: any = {};
      newContractMap.Cauldron = Cauldron;
      newContractMap.Ladle = Ladle;
      newContractMap.ChainlinkMultiOracle = ChainlinkMultiOracle;
      newContractMap.CompositeMultiOracle = CompositeMultiOracle;

      /* Get the hardcoded strategy addresses */
      const strategyAddresses = (yieldEnv.strategies as any)[chainId];

      /* add on extra/calculated ASSET info  and contract instances */
      const _chargeAsset = (asset: any) => ({
        ...asset,
        digitFormat: assetDigitFormatMap.has(asset.symbol) ? assetDigitFormatMap.get(asset.symbol) : 6,
        image: asset.symbol,
        color: (yieldEnv.assetColors as any)[asset.symbol],
      });

      const _getAssets = async () => {
        /* get all the assetAdded, roacleAdded and joinAdded events and series events at the same time */
        const [assetAddedEvents, joinAddedEvents] = await Promise.all([
          Cauldron.queryFilter('AssetAdded' as any, 0),
          Ladle.queryFilter('JoinAdded' as any, 0),
        ]);
        /* Create a map from the joinAdded event data */
        const joinMap: Map<string, string> = new Map(
          joinAddedEvents.map((log: any) => Ladle.interface.parseLog(log).args) as [[string, string]]
        );

        const newAssets: any = {};

        try {
          await Promise.all(
            assetAddedEvents.map(async (x: any) => {
              const { assetId: id, asset: address } = Cauldron.interface.parseLog(x).args;
              const ERC20 = contracts.ERC20Permit__factory.connect(address, library);
              /* Add in any extra static asset Data */ // TODO is there any other fixed asset data needed?
              const [name, symbol, decimals] = await Promise.all([
                ERC20.name(),
                ERC20.symbol(),
                ERC20.decimals(),
                // ETH_BASED_ASSETS.includes(id) ? async () =>'1' : ERC20.version()
              ]);

              // console.log(symbol, ':', id);
              // TODO check if any other tokens have different versions. maybe abstract this logic somewhere?
              const version = id === '0x555344430000' ? '2' : '1';

              const newAsset = {
                id,
                address,
                name,
                symbol: symbol !== 'WETH' ? symbol : 'ETH',
                decimals,
                version,
                joinAddress: joinMap.get(id),
              };
              newAssets[id] = _chargeAsset(newAsset);
            })
          );
          dispatch(updateAssets(newAssets));
          dispatch(setAssetsLoading(false));
          console.log('Yield Protocol Asset data updated.');
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
          displayNameMobile: `${nameFromMaturity(_series.maturity, 'MMM yyyy')}`,

          season,
          startColor,
          endColor,
          color: `linear-gradient(${startColor}, ${endColor})`,
          textColor,

          oppStartColor,
          oppEndColor,
          oppTextColor,
          seriesMark: '',

          // built-in helper functions:
          getTimeTillMaturity: () => _series.maturity - Math.round(new Date().getTime() / 1000),
          isMature: async () => _series.maturity < (await library.getBlock('latest')).timestamp,
          // getBaseAddress: () => assets[_series.baseId].address, // TODO refactor to get this static - if possible?
        };
      };

      const _getSeries = async () => {
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
        try {
          await Promise.all([
            ...seriesAddedEvents.map(async (x: any): Promise<void> => {
              const { seriesId: id, baseId, fyToken } = Cauldron.interface.parseLog(x).args;
              const { maturity } = await Cauldron.series(id);

              if (poolMap.has(id)) {
                // only add series if it has a pool
                const poolAddress: string = poolMap.get(id) as string;
                const poolContract = contracts.Pool__factory.connect(poolAddress, library);
                const fyTokenContract = contracts.FYToken__factory.connect(fyToken, library);
                // const baseContract = contracts.ERC20__factory.connect(fyToken, fallbackLibrary);
                const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol] = await Promise.all([
                  fyTokenContract.name(),
                  fyTokenContract.symbol(),
                  fyTokenContract.version(),
                  fyTokenContract.decimals(),
                  poolContract.name(),
                  poolContract.version(),
                  poolContract.symbol(),
                  // poolContract.decimals(),
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
                };
                newSeriesObj[id] = _chargeSeries(newSeries);
              }
            }),
          ]);
          dispatch(updateSeries(newSeriesObj));
          dispatch(setSeriesLoading(false));
          console.log('Yield Protocol Series data updated.');
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
              const Strategy = contracts.Strategy__factory.connect(strategyAddr, library);
              const [name, symbol, baseId, decimals, version] = await Promise.all([
                Strategy.name(),
                Strategy.symbol(),
                Strategy.baseId(),
                Strategy.decimals(),
                Strategy.version(),
              ]);

              const newStrategy = {
                id: strategyAddr,
                address: strategyAddr,
                symbol,
                name,
                version,
                baseId,
                decimals,
              };
              // update state and cache
              newStrategies[strategyAddr] = newStrategy;
            })
          );
          dispatch(updateStrategies(newStrategies));
          dispatch(setStrategiesLoading(false));
          console.log('Yield Protocol Series data updated.');
        } catch (e) {
          dispatch(setStrategiesLoading(false));
          console.log('Error getting strategies', e);
        }
      };

      /* LOAD the Series and Assets */
      (async () => {
        await Promise.all([_getAssets(), _getSeries(), _getStrategies()]);
        dispatch(setChainLoading(false));
      })();
    }
  }, [chainId, library, dispatch]);

  /**
   * Update on PRIMARY connection any network changes (likely via metamask/walletConnect)
   */
  useEffect(() => {
    // updateState({ type: 'chainId', payload: chainId });
    // chainId && updateState({ type: 'chainData', payload: chainData.get(chainId) });
    // updateState({ type: 'web3Active', payload: active });
    // updateState({ type: 'provider', payload: library || null });
    // updateState({ type: 'account', payload: account || null });
    // updateState({ type: 'signer', payload: library?.getSigner(account!) || null });
    // updateState({ type: 'connector', payload: connector || null });
  }, [chainId, library]);

  /*
      Watch the chainId for changes (most likely instigated by metamask),
      and change the FALLBACK provider accordingly.
      NOTE: Currently, there is no way to change the fallback provider manually, but the last chainId is cached.
  */
  useEffect(() => {
    /* Connect the fallback */
    activate(
      new NetworkConnector({
        urls: { 1: RPC_URLS[1], 42: RPC_URLS[42], 31337: RPC_URLS[31337], 1337: RPC_URLS[1337] },
        defaultChainId,
      }),
      (e: any) => console.log(e),
      true
    );
  }, [chainId, activate, defaultChainId]);
};

export { useChain };
