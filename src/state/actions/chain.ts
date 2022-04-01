import { BigNumber, Contract, ethers } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { decimalNToDecimal18 } from '../../utils/yieldMath';
import { ActionType } from '../actionTypes/chain';
import { getPrice, updatePrices, reset as resetVaults } from './vaults';
import { reset as resetContracts } from './contracts';
import * as contracts from '../../contracts';
import {
  IAsset,
  IAssetMap,
  IAssetPairData,
  IChainAssetPairDataLoadingAction,
  IChainAssetsLoadingAction,
  IChainChainIdAction,
  IChainChainLoadingAction,
  IChainProviderAction,
  IChainResetAction,
  IChainSeriesLoadingAction,
  IChainStrategiesLoadingAction,
  IChainTvlLoadingAction,
  IChainUpdateAssetPairMapAction,
  IChainUpdateAssetsAction,
  IChainUpdateAssetsTVLAction,
  IChainUpdateSeriesAction,
  IChainUpdateStrategiesAction,
  ISeriesMap,
  IStrategyMap,
} from '../../types/chain';
import { IContractMap } from '../../types/contracts';
import { CAULDRON } from '../../utils/constants';
import { IPriceMap } from '../../types/vaults';
import { FDAI2203, FDAI2206, FDAI2209 } from '../../config/assets';

export function getAssetPairData(asset: IAsset, assets: IAssetMap, contractMap: IContractMap, chainId: number): any {
  return async (dispatch: any, getState: any) => {
    const {
      vaults: { prices },
    } = getState();
    dispatch(assetPairDataLoading(true));
    try {
      const Cauldron = contractMap[CAULDRON];

      const assetPairData: IAssetPairData[] = await Promise.all(
        Object.values(assets as IAssetMap).map(async (x: IAsset) => {
          const [{ min, max, dec: decimals }, { ratio: minCollatRatio }, totalDebt] = await Promise.all([
            await Cauldron.debt(asset.id, x.id),
            await Cauldron.spotOracles(asset.id, x.id),
            (await Cauldron.debt(asset.id, x.id)).sum,
          ]);

          const _price: BigNumber = await getPrice(asset.id, x.id, contractMap, asset.decimals, chainId, prices);
          const price_ = decimalNToDecimal18(_price, x.decimals);
          dispatch(updatePrices(asset.id, x.id, ethers.utils.formatUnits(price_, 18)));

          const minDebt = (min * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
          const maxDebt = (max * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
          const totalDebt_ = cleanValue(ethers.utils.formatUnits(totalDebt, decimals), 2);
          const USDC = Object.values(assets).filter((a) => a.symbol === 'USDC')[0];

          return {
            baseAssetId: asset.id,
            ilkAssetId: x.id,
            minCollatRatioPct: `${ethers.utils.formatUnits(minCollatRatio * 100, 6)}%`, // collat ratios always have 6 decimals
            minDebt,
            maxDebt,
            minDebt_: ethers.utils.formatUnits(minDebt, decimals),
            maxDebt_: ethers.utils.formatUnits(maxDebt, decimals),
            totalDebt_,
            totalDebtInUSDC: cleanValue(await convertValue(totalDebt_, asset, USDC, contractMap, chainId, prices), 2),
          };
        })
      );

      dispatch(updateAssetPairData(asset.id, assetPairData));
      dispatch(assetPairDataLoading(false));
    } catch (e) {
      console.log('Error getting asset pair data', e);
      dispatch(assetPairDataLoading(false));
    }
  };
}

export const reset = (): IChainResetAction => ({ type: ActionType.RESET });

const updateAssetsTvl = (assetsTvl: any): IChainUpdateAssetsTVLAction => ({
  type: ActionType.UPDATE_ASSETS_TVL,
  payload: assetsTvl,
});
const tvlLoading = (loading: boolean): IChainTvlLoadingAction => ({ type: ActionType.TVL_LOADING, payload: loading });
const assetPairDataLoading = (loading: boolean): IChainAssetPairDataLoadingAction => ({
  type: ActionType.ASSET_PAIR_DATA_LOADING,
  payload: loading,
});

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
export function getAssetsTvl(
  assets: IAssetMap,
  contractMap: IContractMap,
  seriesMap: ISeriesMap,
  provider: ethers.providers.JsonRpcProvider,
  chainId: number
): any {
  return async function _getAssetsTvl(dispatch: any, getState: any) {
    const {
      vaults: { prices },
    } = getState();
    dispatch(tvlLoading(true));
    if (provider && contractMap) {
      // get the balance of the asset in the respective join
      const _joinBalances = await getAssetJoinBalances(assets, contractMap, provider);

      // map through series to get the relevant pool to asset
      const poolAddrToAssetMap = mapPoolAddrToAsset(seriesMap, assets);
      const _poolBalances = await getPoolBalances(poolAddrToAssetMap, provider);

      // denominate balance in usdc (or dai when usdc not applicable)
      const USDC = Object.values(assets).filter((a) => a.symbol === 'USDC')[0];
      const DAI = Object.values(assets).filter((a) => a.symbol === 'DAI')[0];

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

          if ([FDAI2203, FDAI2206, FDAI2209].includes(bal.id)) {
            price_ = '1';
            dispatch(updatePrices(bal.id, USDC.id, price_));
          } else {
            _price = await getPrice(bal.id, USDC.id, contractMap, bal.asset.decimals, chainId, prices);
            const priceInUSDC = decimalNToDecimal18(_price, USDC.decimals);
            price_ = ethers.utils.formatUnits(priceInUSDC, 18);
            dispatch(updatePrices(bal.id, USDC.id, price_));
          }

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

async function getAssetJoinBalances(
  assets: IAssetMap,
  contractMap: IContractMap,
  provider: ethers.providers.JsonRpcProvider
) {
  try {
    const balances = await Promise.all(
      Object.values(assets).map(async (a: IAsset) => ({
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

async function getAssetJoinBalance(asset: IAsset, provider: ethers.providers.JsonRpcProvider) {
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

async function getPoolBalances(
  poolAddrToAssetMap: { [poolAddress: string]: IAssetPoolAddr },
  provider: ethers.providers.JsonRpcProvider
) {
  try {
    const balances: any[] = [];
    await Promise.all(
      Object.values(poolAddrToAssetMap).map(async (pool) => {
        const Pool = contracts.Pool__factory.connect(pool.poolAddress, provider);
        balances.push({
          id: pool.id,
          balance: await getPoolBalance(Pool),
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
async function getPoolBalance(pool: Contract) {
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
  chainId: number,
  priceMap: IPriceMap
) => {
  if (fromAsset === toAsset) return fromValue;
  const _price = await getPrice(fromAsset.id, toAsset.id, contractMap, fromAsset.decimals, chainId, priceMap);
  const price = decimalNToDecimal18(_price, toAsset.decimals);
  const price_ = ethers.utils.formatUnits(price, 18);
  return (+price_ * +fromValue).toString();
};

interface IAssetPoolAddr extends IAsset {
  poolAddress: string;
}
const mapPoolAddrToAsset = (seriesMap: ISeriesMap, assets: IAssetMap) => {
  if (seriesMap && assets) {
    const newMap = {} as { [poolAddress: string]: IAssetPoolAddr };
    Object.values(seriesMap).map((s) => {
      const asset = assets[s.baseId];
      const { poolAddress } = s;
      newMap[poolAddress] = { ...asset, poolAddress };
      return asset;
    });
    return newMap;
  }
  return {};
};

export const updateProvider = (provider: ethers.providers.JsonRpcProvider): IChainProviderAction => ({
  type: ActionType.PROVIDER,
  payload: provider,
});

export const updateChain =
  (chainId: number): any =>
  async (dispatch: any) => {
    dispatch(reset());
    dispatch(resetVaults());
    dispatch(resetContracts());
    dispatch(updateChainId(chainId));
  };

export const updateChainId = (chainId: number): IChainChainIdAction => ({
  type: ActionType.CHAIN_ID,
  payload: chainId,
});
export const setChainLoading = (chainLoading: boolean): IChainChainLoadingAction => ({
  type: ActionType.CHAIN_LOADING,
  payload: chainLoading,
});
export const setSeriesLoading = (seriesLoading: boolean): IChainSeriesLoadingAction => ({
  type: ActionType.SERIES_LOADING,
  payload: seriesLoading,
});
export const setStrategiesLoading = (strategiesLoading: boolean): IChainStrategiesLoadingAction => ({
  type: ActionType.STRATEGIES_LOADING,
  payload: strategiesLoading,
});
export const setAssetsLoading = (assetsLoading: boolean): IChainAssetsLoadingAction => ({
  type: ActionType.ASSETS_LOADING,
  payload: assetsLoading,
});
export const updateSeries = (series: ISeriesMap): IChainUpdateSeriesAction => ({
  type: ActionType.UPDATE_SERIES,
  payload: series,
});
export const updateStrategies = (strategies: IStrategyMap): IChainUpdateStrategiesAction => ({
  type: ActionType.UPDATE_STRATEGIES,
  payload: strategies,
});
export const updateAssets = (assets: IAssetMap): IChainUpdateAssetsAction => ({
  type: ActionType.UPDATE_ASSETS,
  payload: assets,
});
export const updateAssetPairData = (
  assetId: string,
  assetPairData: IAssetPairData[]
): IChainUpdateAssetPairMapAction => ({
  type: ActionType.UPDATE_ASSET_PAIR_DATA,
  payload: { assetId, assetPairData },
});
