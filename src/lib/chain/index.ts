import { format } from 'date-fns';
import { BigNumber, ethers, EventFilter } from 'ethers';
import {
  ASSET_INFO,
  CVX3CRV,
  FDAI2203,
  FDAI2206,
  FDAI2209,
  FDAI2212,
  FDAI2303,
  FETH2212,
  FETH2303,
  TokenType,
  USDC,
  USDT,
  WETH,
} from '../../config/assets';
import { SUPPORTED_RPC_URLS } from '../../config/chainData';
import yieldEnv from '../../config/yieldEnv';
import {
  ConvexJoin,
  ConvexJoin__factory,
  ERC20__factory,
  FYToken__factory,
  Join,
  Join__factory,
  Pool,
  Pool__factory,
  Strategy__factory,
} from '../../contracts';
import { Cauldron } from '../../contracts/Cauldron';
import { Ladle, PoolAddedEvent } from '../../contracts/Ladle';
import { IAsset, IAssetMap, IAssetPairData, ISeriesMap, IStrategyMap } from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { cleanValue, getSeason, SeasonType } from '../../utils/appUtils';
import { CAULDRON, LADLE } from '../../utils/constants';
import { decimalNToDecimal18 } from '../../utils/yieldMath';
import { getPrice } from '../vaults';
import { ITotalDebtItem } from './types';

export const getProvider = (chainId: number) => new ethers.providers.JsonRpcProvider(SUPPORTED_RPC_URLS[chainId]);

export const getSeries = async (provider: ethers.providers.JsonRpcProvider, contractMap: IContractMap) => {
  const ladle = contractMap[LADLE] as Ladle;
  const cauldron = contractMap[CAULDRON] as Cauldron;

  try {
    /* get poolAdded events and series events at the same time */
    const [seriesAddedEvents, poolAddedEvents] = await Promise.all([
      cauldron.queryFilter(cauldron.filters.SeriesAdded()),
      ladle.queryFilter(ladle.filters.PoolAdded()),
    ]);

    /* build a map from the poolAdded event data */
    const poolMap: Map<string, string> = new Map(poolAddedEvents.map((e: PoolAddedEvent) => e.args));

    const newSeriesObj: any = {};

    /* Add in any extra static series */
    await Promise.all([
      ...seriesAddedEvents.map(async (x): Promise<void> => {
        const { seriesId: id, baseId, fyToken } = x.args;
        const { maturity } = await cauldron.series(id);

        if (poolMap.has(id)) {
          // only add series if it has a pool
          const poolAddress = poolMap.get(id);
          const poolContract = Pool__factory.connect(poolAddress, provider);
          const fyTokenContract = FYToken__factory.connect(fyToken, provider);

          const [name, symbol, version, decimals, poolName, poolVersion, poolSymbol, totalSupply] = await Promise.all([
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
            totalSupply: ethers.utils.formatUnits(totalSupply, decimals),
          };

          newSeriesObj[id] = _chargeSeries(newSeries);
        }
      }),
    ]);

    return newSeriesObj as ISeriesMap;
  } catch (e) {
    console.log('Error fetching series data: ', e);
    return undefined;
  }
};

/* add on extra/calculated ASYNC series info and contract instances */
const _chargeSeries = (_series: { maturity: number; baseId: string; poolAddress: string; fyTokenAddress: string }) => {
  const season = getSeason(_series.maturity) as SeasonType;
  const oppSeason = (_season: SeasonType) => getSeason(_series.maturity + 23670000) as SeasonType;
  const [startColor, endColor, textColor] = yieldEnv.seasonColors[season];
  const [oppStartColor, oppEndColor, oppTextColor] = yieldEnv.seasonColors[oppSeason(season)];
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

/* Iterate through the strategies list and update accordingly */
export const getStrategies = async (provider: ethers.providers.JsonRpcProvider) => {
  const newStrategies: IStrategyMap = {};
  const strategyAddresses = yieldEnv.strategies[(await provider.getNetwork()).chainId];

  try {
    await Promise.all(
      strategyAddresses.map(async (strategyAddr) => {
        const Strategy = Strategy__factory.connect(strategyAddr, provider);

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

        newStrategies[strategyAddr] = newStrategy;
      })
    );
    return newStrategies;
  } catch (e) {
    console.log('Error getting strategies', e);
    return undefined;
  }
};

export const getAssets = async (provider: ethers.providers.JsonRpcProvider, contractMap: IContractMap) => {
  console.log('getting assets');
  const ladle = contractMap[LADLE] as Ladle;
  const cauldron = contractMap[CAULDRON] as Cauldron;

  try {
    /* get all the assetAdded, roacleAdded and joinAdded events and series events at the same time */
    const [assetAddedEvents, joinAddedEvents] = await Promise.all([
      cauldron.queryFilter(cauldron.filters.AssetAdded()),
      ladle.queryFilter(ladle.filters.JoinAdded()),
    ]);

    /* Create a map from the joinAdded event data */
    const joinMap = new Map(joinAddedEvents.map((e) => e.args));

    const newAssets: IAssetMap = {};

    await Promise.all(
      assetAddedEvents.map(async (x) => {
        const { assetId: id, asset: address } = x.args;
        const assetInfo = ASSET_INFO.get(id);
        let name: string;
        let symbol: string;
        let decimals: number;
        let idToUse: string;
        let joinAddress: string;

        if (assetInfo) {
          idToUse = assetInfo.wrappedTokenId || id; // here we are using the unwrapped id
          joinAddress = joinMap.get(idToUse);
        }

        /* On first load Checks/Corrects the ERC20 name/symbol/decimals  (if possible ) */
        if (
          assetInfo?.tokenType === TokenType.ERC20_ ||
          assetInfo?.tokenType === TokenType.ERC20_Permit ||
          assetInfo?.tokenType === TokenType.ERC20_DaiPermit
        ) {
          const contract = ERC20__factory.connect(address, provider);
          try {
            [name, symbol, decimals] = await Promise.all([contract.name(), contract.symbol(), contract.decimals()]);
          } catch (e) {
            name = '';
            symbol = '';
            decimals = 18;
            idToUse = '';
            console.log(
              address,
              ': ERC20 contract auto-validation unsuccessfull. Please manually ensure symbol and decimals are correct.'
            );
          }
        } else if (assetInfo?.tokenType === TokenType.ERC1155_) {
          name = assetInfo.name;
          symbol = assetInfo.symbol;
          decimals = assetInfo.decimals;
        }

        const newAsset: IAsset = {
          id,
          address,
          name: name ?? '',
          symbol: symbol ?? '',
          decimals: decimals ?? 18,
          joinAddress: joinAddress ?? 'Could not get join address',
          digitFormat: 2,
        };

        if (joinAddress) newAssets[id] = newAsset;
      })
    );

    return newAssets;
  } catch (e) {
    console.log('Error getting assets', e);
    return undefined;
  }
};

/**
 * Gets the USDC denominated TVL by asset
 * 1. Looks through each asset's respective join contract to get the total balance
 * 2. Looks through each series, get's the appropriate base asset balance
 * 3. combines 1 and 2 to create an object mapping asset id to a balance
 * 4. dispatches the resulting object to state
 * @param provider
 * @param contractMap
 * @param assets
 * @param seriesMap
 */
export const getAssetsTvl = async (
  provider: ethers.providers.JsonRpcProvider,
  contractMap: IContractMap,
  assets: IAssetMap,
  seriesMap: ISeriesMap
) => {
  const { chainId } = await provider.getNetwork();

  // get the balance of the asset in the respective join
  const _joinBalances = await getAssetJoinBalances(provider, assets);

  // map through series to get the relevant pool to asset
  const poolAddrToAssetMap = mapPoolAddrToAsset(seriesMap, assets);
  const _poolBalances = await getPoolBalances(poolAddrToAssetMap, provider);

  // denominate balance in usdc (or dai when usdc not applicable)
  const _USDC = Object.values(assets).filter((a) => a.symbol === 'USDC')[0];

  // consolidate pool address asset balances
  const totalPoolBalances = _poolBalances?.reduce((balMap: any, bal: any) => {
    const newMap: any = balMap;
    const prevBalance: number = +balMap[bal.id]?.balance! || 0;
    const newBalance: number = prevBalance + Number(bal.balance);
    newMap[bal.id as string] = { id: bal.id, asset: bal.asset, balance: newBalance.toString() };
    return newMap;
  }, {});

  // convert the balances to usdc (or dai) denomination
  const totalTvl = await Promise.all(
    Object.values(_joinBalances!)?.map(async (bal: any) => {
      // get the usdc price of the asset
      let _price: BigNumber;
      let price_: string;

      if ([FDAI2203, FDAI2206, FDAI2209, FDAI2212, FDAI2303].includes(bal.id)) {
        price_ = '1';
      } else if ([FETH2212, FETH2303].includes(bal.id)) {
        // if FETH, use eth price as proxy for fETH price
        _price = await getPrice(WETH, _USDC.id, contractMap, 18, chainId);
      } else {
        _price = await getPrice(bal.id, _USDC.id, contractMap, bal.asset.decimals, chainId);

        const priceInUSDC = decimalNToDecimal18(_price, _USDC.decimals);
        price_ = ethers.utils.formatUnits(priceInUSDC, 18);
      }

      const joinBalance_ = bal.balance;
      const poolBalance_ = totalPoolBalances[bal.id]?.balance! || 0;
      const totalBalance = +joinBalance_ + +poolBalance_;
      const _value = +price_ * +totalBalance;
      const value = isNaN(_value) || _value < 0.01 ? 0 : _value;

      return {
        symbol: bal.asset.symbol as string,
        id: bal.id as string,
        value,
      };
    })
  );
  return totalTvl;
};

const getAssetJoinBalances = async (provider: ethers.providers.JsonRpcProvider, assets: IAssetMap) => {
  try {
    const balances = await Promise.all(
      Object.values(assets).map(async (a) => ({
        id: a.id,
        balance: await getAssetJoinBalance(provider, a),
        asset: a,
      }))
    );
    return balances;
  } catch (e) {
    console.log('error getting join balances');
    console.log(e);
    return undefined;
  }
};

const getAssetJoinBalance = async (provider: ethers.providers.JsonRpcProvider, asset: IAsset) => {
  let _Join: Join | ConvexJoin;
  const decimals = [FDAI2203, FDAI2206, FDAI2209].includes(asset.id) ? 18 : asset.decimals; // notional assets have 6 decimals, but the join uses the underlying asset's decimals

  try {
    if (asset.id === CVX3CRV) {
      _Join = ConvexJoin__factory.connect(asset.joinAddress, provider);
    } else {
      _Join = Join__factory.connect(asset.joinAddress, provider);
    }
    return ethers.utils.formatUnits(await _Join.storedBalance(), decimals);
  } catch (e) {
    console.log('error getting join balance for', asset);
    console.log(e);
    return '0';
  }
};

const mapPoolAddrToAsset = (seriesMap: ISeriesMap, assets: IAssetMap) => {
  const newMap = {} as { [poolAddress: string]: IAssetPoolAddr };
  Object.values(seriesMap).map((s) => {
    const asset = assets[s.baseId];
    const { poolAddress } = s;
    newMap[poolAddress] = { ...asset, poolAddress };
    return asset;
  });
  return newMap;
};

interface IAssetPoolAddr extends IAsset {
  poolAddress: string;
}

/**
 * Converts a string value from one asset to another using oracle prices
 * @param fromValue
 * @param fromAsset
 * @param toAsset
 * @param assetMap
 * @param contractMap
 * @returns string
 */
export const convertValue = async (
  fromValue: string,
  fromAsset: IAsset,
  toAsset: IAsset,
  contractMap: IContractMap,
  chainId: number
) => {
  if (fromAsset === toAsset) return fromValue;

  const _price = await getPrice(fromAsset.id, toAsset.id, contractMap, fromAsset.decimals, chainId);
  const price = decimalNToDecimal18(_price, toAsset.decimals);
  const price_ = ethers.utils.formatUnits(price, 18);
  return (+price_ * +fromValue).toString();
};

async function getPoolBalances(
  poolAddrToAssetMap: { [poolAddress: string]: IAssetPoolAddr },
  provider: ethers.providers.JsonRpcProvider
) {
  try {
    const balances: { id: string; balance: string; asset: IAssetPoolAddr }[] = [];
    await Promise.all(
      Object.values(poolAddrToAssetMap).map(async (pool) => {
        const _Pool = Pool__factory.connect(pool.poolAddress, provider);
        balances.push({
          id: pool.id,
          balance: await getPoolBalance(_Pool),
          asset: pool,
        });
      })
    );
    return balances;
  } catch (e) {
    console.log(e);
    return undefined;
  }
}

/**
 * Gets a pool's associated asset balance by combining pool base with the estimated amount of converting fyTokenRealBalance to base
 * @param pool
 * @returns string
 */
const getPoolBalance = async (pool: Pool) => {
  if (!pool || pool === undefined) return '0';
  try {
    const decimals = await pool.decimals();
    const base = await pool.getBaseBalance();
    const base_: string = ethers.utils.formatUnits(base, decimals);
    const fyTokenVirtualBalance = await pool.getFYTokenBalance();
    const poolTotalSupply = await pool.totalSupply();
    const fyTokenRealBalance_ = ethers.utils.formatUnits(fyTokenVirtualBalance.sub(poolTotalSupply), decimals);

    // estimate how much base you would get from selling the fyToken in the pool
    try {
      const fyTokenToBaseCostEstimate = await pool.sellFYTokenPreview(
        BigNumber.from(1).mul(BigNumber.from(10).pow(decimals))
      ); // estimate the base value of 1 fyToken unit
      const fyTokenToBaseCostEstimate_ = cleanValue(ethers.utils.formatUnits(fyTokenToBaseCostEstimate, decimals), 6);
      const fyTokenToBaseValueEstimate: number = fyTokenToBaseCostEstimate_
        ? +fyTokenRealBalance_ * +fyTokenToBaseCostEstimate_
        : +fyTokenRealBalance_; // estimated base cost of fyToken by the fyToken amount
      return fyTokenToBaseValueEstimate ? (fyTokenToBaseValueEstimate + +base_).toString() : base_;
    } catch (e) {
      console.log('Could not estimate the value of an fyToken for pool: ', pool.address);
    }
    return '0';
  } catch (e) {
    console.log('error getting pool balance for ', pool.address);
    console.log(e);
    return '0';
  }
};

export const getTotalDebtList = async (
  provider: ethers.providers.JsonRpcProvider,
  contractMap: IContractMap,
  series: ISeriesMap,
  assets: IAssetMap
) => {
  const totalDebtMap = await Object.values(series).reduce(async (map, x) => {
    const { chainId } = await provider.getNetwork();
    const fyToken = FYToken__factory.connect(x.fyTokenAddress, provider!);
    const fyTokenSupply = await fyToken.totalSupply();
    const fyTokenSupply_ = ethers.utils.formatUnits(fyTokenSupply, x.decimals);
    const base = assets![x.baseId];
    const usdc = assets![USDC];
    const fyTokenToUSDC = await convertValue(fyTokenSupply_, base, usdc, contractMap!, chainId);

    const newMap = await map;
    const currItemValue = newMap.has(base.id) ? newMap.get(base.id)?.value : 0;
    const newItem = {
      id: base.id,
      symbol: base.symbol,
      value: (currItemValue || 0) + +fyTokenToUSDC,
    };
    newMap.set(base.id, newItem);
    return newMap;
  }, Promise.resolve(new Map() as Map<string, ITotalDebtItem>));

  return Array.from(totalDebtMap.values()).sort((a, b) => b.value - a.value);
};

export const getTotalDebt = (totalDebtList: ITotalDebtItem[]) => totalDebtList.reduce((total, x) => total + x.value, 0);

export const getAssetPairData = async (
  asset: IAsset,
  assets: IAssetMap,
  contractMap: IContractMap,
  chainId: number
): Promise<IAssetPairData[] | undefined> => {
  try {
    const cauldron = contractMap[CAULDRON] as Cauldron;

    return await Promise.all(
      Object.values(assets).map(async (x) => {
        const [{ min, max, dec: decimals }, { ratio: minCollatRatio }, totalDebt] = await Promise.all([
          await cauldron.debt(asset.id, x.id),
          await cauldron.spotOracles(asset.id, x.id),
          (await cauldron.debt(asset.id, x.id)).sum,
        ]);

        const minDebt = (min * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
        const maxDebt = (+max * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
        const totalDebt_ = cleanValue(ethers.utils.formatUnits(totalDebt, decimals), 2);
        const _USDC = Object.values(assets).filter((a) => a.symbol === 'USDC')[0];

        return {
          baseAssetId: asset.id,
          ilkAssetId: x.id,
          minCollatRatioPct: `${ethers.utils.formatUnits(minCollatRatio * 100, 6)}%`, // collat ratios always have 6 decimals
          minDebt,
          maxDebt,
          minDebt_: ethers.utils.formatUnits(minDebt, decimals),
          maxDebt_: ethers.utils.formatUnits(maxDebt, decimals),
          totalDebt_,
          totalDebtInUSDC: cleanValue(await convertValue(totalDebt_, asset, _USDC, contractMap, chainId), 2),
        };
      })
    );
  } catch (e) {
    console.log('Error getting asset pair data', e);
    return undefined;
  }
};
