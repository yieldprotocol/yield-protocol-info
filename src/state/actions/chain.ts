import { BigNumber, Contract, ethers } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { decimalNToDecimal18 } from '../../utils/yieldMath';
import { ActionType } from '../actionTypes/chain';
import { getPrice } from './vaults';
import * as contracts from '../../contracts';
import { IAsset, IAssetMap, ISeries, ISeriesMap } from '../../types/chain';
import { IContract, IContractMap } from '../../types/contracts';

export const updateProvider = (provider: any) => ({ type: ActionType.PROVIDER, provider });
export const updateChainId = (chainId: number) => ({ type: ActionType.CHAIN_ID, chainId });
export const setChainLoading = (chainLoading: boolean) => ({ type: ActionType.CHAIN_LOADING, chainLoading });
export const setSeriesLoading = (seriesLoading: boolean) => ({ type: ActionType.SERIES_LOADING, seriesLoading });
export const setStrategiesLoading = (strategiesLoading: boolean) => ({
  type: ActionType.STRATEGIES_LOADING,
  strategiesLoading,
});
export const setAssetsLoading = (assetsLoading: boolean) => ({ type: ActionType.ASSETS_LOADING, assetsLoading });
export const updateSeries = (series: any) => ({ type: ActionType.UPDATE_SERIES, series });
export const updateStrategies = (strategies: any) => ({ type: ActionType.UPDATE_STRATEGIES, strategies });
export const updateAssets = (assets: any) => ({ type: ActionType.UPDATE_ASSETS, assets });
export const updateAssetPairData = (assetId: string, assetPairData: any) => ({
  type: ActionType.UPDATE_ASSET_PAIR_DATA,
  payload: { assetId, assetPairData },
});

export function getAssetPairData(asset: any, assets: any, contractMap: any) {
  return async function _getAssetPairData(dispatch: any) {
    try {
      const Cauldron = Object.values(contractMap as IContractMap).filter((x: IContract) => x.name === 'Cauldron')[0]
        .contract;

      const assetPairData = await Promise.all(
        Object.values(assets as IAssetMap).map(async (x: IAsset) => {
          const [{ min, max, dec: decimals }, { ratio: minCollatRatio }, totalDebt] = await Promise.all([
            await Cauldron.debt(asset.id, x.id),
            await Cauldron.spotOracles(asset.id, x.id),
            (await Cauldron.debt(asset.id, x.id)).sum,
          ]);

          const minDebt: string = (min * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
          const maxDebt: string = (max * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
          const totalDebt_: string = cleanValue(ethers.utils.formatUnits(totalDebt, decimals), 2);
          const USDC: IAsset = Object.values(assets as IAssetMap).filter((a: IAsset) => a.symbol === 'USDC')[0];

          return {
            baseAssetId: asset.id,
            ilkAssetId: x.id,
            minCollatRatioPct: `${ethers.utils.formatUnits(minCollatRatio * 100, 6)}%`, // collat ratios always have 6 decimals
            minDebt,
            maxDebt,
            minDebt_: ethers.utils.formatUnits(minDebt, decimals),
            maxDebt_: ethers.utils.formatUnits(maxDebt, decimals),
            totalDebt_,
            totalDebtInUSDC: cleanValue(await convertValue(totalDebt_, asset, USDC, contractMap), 2),
          };
        })
      );

      dispatch(updateAssetPairData(asset.id, assetPairData));
      console.log('Yield Protocol Asset Pair data updated.');
    } catch (e) {
      console.log('Error getting asset pair data', e);
    }
  };
}

export const reset = () => ({ type: ActionType.RESET });

const updateAssetsTvl = (assetsTvl: any) => ({ type: ActionType.UPDATE_ASSETS_TVL, assetsTvl });
const tvlLoading = (loading: boolean) => ({ type: ActionType.TVL_LOADING, tvlLoading: loading });

/**
 * Gets the USDC denominated TVL by asset
 * 1. Looks through each asset's respective join contract to get the total balance
 * 2. Looks through each series, get's the appropriate base asset balance
 * 3. combines 1 and 2 to create an object mapping asset id to a balance
 * 4. dispatches the resulting object to state
 * @param assets
 * @param contractMap
 * @param seriesMap
 * @param provider
 */
export function getAssetsTvl(assets: IAssetMap, contractMap: any, seriesMap: ISeriesMap, provider: any) {
  return async function _getAssetsTvl(dispatch: any) {
    dispatch(tvlLoading(true));
    if (provider && contractMap) {
      // get the balance of the asset in the respective join
      const _joinBalances: any = await getAssetJoinBalances(assets, contractMap, provider);

      // map through series to get the relevant pool to asset
      const poolAddrToAssetMap = mapPoolAddrToAsset(seriesMap, assets);
      const _poolBalances: any = await getPoolBalances(poolAddrToAssetMap, provider);

      // denominate balance in usdc
      const USDC: any = Object.values(assets).filter((a: any) => a.symbol === 'USDC')[0];
      console.log('_poolbalances', _poolBalances);
      // consolidate pool address asset balances
      const totalPoolBalances = _poolBalances.reduce((balMap: any, bal: any) => {
        const newMap: any = balMap;
        const prevBalance: number = +balMap[bal.id]?.balance! || 0;
        const newBalance: number = prevBalance + Number(bal.balance);
        newMap[bal.id as string] = { id: bal.id, asset: bal.asset, balance: newBalance.toString() };
        return newMap;
      }, {});

      console.log('total pool balances', totalPoolBalances);
      console.log('total join balances', _joinBalances);

      // convert the balances to usdc denomination
      const totalTvl = await Promise.all(
        Object.values(_joinBalances)?.map(async (bal: any) => {
          // get the usdc price of the asset
          const _price = await getPrice(bal.id, USDC.id, contractMap, bal.asset.decimals);
          const price = decimalNToDecimal18(_price, USDC?.decimals);
          const price_ = ethers.utils.formatUnits(price, 18);
          const joinBalance_ = bal.balance;
          const poolBalance_ = totalPoolBalances[bal.id]?.balance! || 0;
          const totalBalance = +joinBalance_ + +poolBalance_;
          const _value = +price_ * +totalBalance;
          const value = isNaN(_value) ? 0 : _value;
          return {
            symbol: bal.asset.symbol,
            id: bal.id,
            value,
          };
        })
      );
      dispatch(updateAssetsTvl(totalTvl));
      return dispatch(tvlLoading(false));
    }
    dispatch(tvlLoading(false));
    return undefined;
  };
}

async function getAssetJoinBalances(assets: any, contractMap: any, provider: any) {
  try {
    const balances = await Promise.all(
      Object.values(assets).map(async (a: any) => ({
        id: a.id,
        balance: await getAssetJoinBalance(a, provider),
        asset: a,
      }))
    );
    return balances;
  } catch (e) {
    console.log('error getting join balances');
    console.log(e);
    return undefined;
  }
}

async function getAssetJoinBalance(asset: any, provider: any) {
  try {
    const joinAddr = asset.joinAddress;
    const Join = contracts.Join__factory.connect(joinAddr, provider);
    return ethers.utils.formatUnits(await Join.storedBalance(), asset.decimals);
  } catch (e) {
    console.log('error getting join balance for', asset);
    console.log(e);
    return '0';
  }
}

async function getPoolBalances(poolAddrToAssetMap: any, provider: any) {
  try {
    const balances: any = [];
    await Promise.all(
      Object.values(poolAddrToAssetMap).map(async (pool: any) => {
        const Pool: Contract = contracts.Pool__factory.connect(pool.poolAddress, provider);
        balances.push({
          id: pool.id,
          balance: await getPoolBalance(Pool),
          asset: pool,
        });
      })
    );
    return balances;
  } catch (e) {
    console.log('error getting pool balances');
    console.log(e);
    return undefined;
  }
}

/**
 * Gets a pool's associated asset balance by combining pool base with fyToken
 * @param pool
 * @returns string
 */
async function getPoolBalance(pool: any) {
  try {
    const decimals = await pool.decimals();
    const base = await pool.getBaseBalance();
    const base_: string = ethers.utils.formatUnits(base, decimals);
    const fyToken = await pool.getFYTokenBalance();
    const fyToken_ = ethers.utils.formatUnits(fyToken, decimals);

    // estimate how much base you would get from selling the fyToken in the pool
    try {
      const fyTokenToBaseCostEstimate = await pool.sellFYTokenPreview(
        BigNumber.from(1).mul(BigNumber.from(10).pow(decimals))
      ); // estimate the base value of 1 fyToken unit
      const fyTokenToBaseCostEstimate_ = cleanValue(ethers.utils.formatUnits(fyTokenToBaseCostEstimate, decimals), 6);
      const fyTokenToBaseValueEstimate: number = fyTokenToBaseCostEstimate_
        ? +fyToken_ * +fyTokenToBaseCostEstimate_
        : +fyToken_; // estimated base cost of fyToken by the fyToken amount
      return fyTokenToBaseValueEstimate ? (fyTokenToBaseValueEstimate + +base_).toString() : base_;
    } catch (e) {
      console.log(e);
    }
    return '0';
  } catch (e) {
    console.log('error getting pool balance for', pool.id);
    console.log(e);
    return '0';
  }
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
const convertValue = async (fromValue: string, fromAsset: IAsset, toAsset: IAsset, contractMap: IContractMap) => {
  if (fromAsset === toAsset) return fromValue;
  const _price = await getPrice(fromAsset.id, toAsset.id, contractMap, fromAsset.decimals);
  const price = decimalNToDecimal18(_price, toAsset.decimals);
  const price_ = ethers.utils.formatUnits(price, 18);
  return (+price_ * +fromValue).toString();
};

const mapPoolAddrToAsset = (seriesMap: ISeriesMap, assets: IAssetMap) => {
  if (seriesMap && assets) {
    const newMap: any = {};
    Object.values(seriesMap).map((s: ISeries) => {
      const asset = assets[s.baseId];
      const { poolAddress } = s;
      newMap[poolAddress as string] = { ...asset, poolAddress };
      return asset;
    });
    return newMap;
  }
  return {};
};
