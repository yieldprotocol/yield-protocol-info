import { BigNumber, ethers } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { decimalNToDecimal18, sellFYToken } from '../../utils/yieldMath';
import { ActionType } from '../actionTypes/chain';
import { getPrice } from './vaults';
import * as contracts from '../../contracts';
import { IAsset, IAssetMap, ISeries, ISeriesMap } from '../../types/chain';

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
      const Cauldron = (Object.values(contractMap).filter((x: any) => x.name === 'Cauldron')[0] as any).contract;

      const assetPairData = await Promise.all(
        [...Object.values(assets)].map(async (x: any) => {
          const [{ min, max, dec: decimals }, { ratio: minCollatRatio }, totalDebt] = await Promise.all([
            await Cauldron.debt(asset.id, x.id),
            await Cauldron.spotOracles(asset.id, x.id),
            (await Cauldron.debt(asset.id, x.id)).sum,
          ]);

          const minDebt = (min * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });
          const maxDebt = (max * 10 ** decimals).toLocaleString('fullwide', { useGrouping: false });

          return {
            baseAssetId: asset.id,
            ilkAssetId: x.id,
            minCollatRatioPct: `${ethers.utils.formatUnits(minCollatRatio * 100, 6)}%`, // collat ratios always have 6 decimals
            minDebt,
            maxDebt,
            minDebt_: ethers.utils.formatUnits(minDebt, decimals),
            maxDebt_: ethers.utils.formatUnits(maxDebt, decimals),
            totalDebt_: cleanValue(ethers.utils.formatUnits(totalDebt, decimals), 2),
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

      // map through series to get the relevant asset
      const assetWithPoolAddrMap = mapAssetToPoolAddr(seriesMap, assets);

      // get the balance of the asset in the respective pool
      const _poolBalances: any = await getAssetPoolBalances(assetWithPoolAddrMap, provider);

      // denominate balance in usdc
      const usdc: any = Object.values(assets).filter((a: any) => a.symbol === 'USDC')[0];

      // convert the balances to usdc denomination
      const totalTvl = await Promise.all(
        [...Object.values(_joinBalances)]?.map(async (bal: any) => {
          // get the usdc price of the asset
          const _price = await getPrice(bal.id, usdc.id, contractMap, bal.asset.decimals);
          const price = decimalNToDecimal18(_price, usdc?.decimals);
          const price_ = ethers.utils.formatUnits(price, 18);

          const joinBalance_ = bal.balance ? ethers.utils.formatUnits(bal.balance, bal.asset.decimals) : '0';
          const poolBalance_ = _poolBalances[bal.id]?.balance! || 0;
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
        balance: await getAssetJoinBalance(a, contractMap, provider),
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

async function getAssetJoinBalance(asset: any, contractMap: any, provider: any) {
  try {
    const joinAddr = asset.joinAddress;
    const Join = contracts.Join__factory.connect(joinAddr, provider);
    return await Join.storedBalance();
  } catch (e) {
    console.log('error getting join balance for', asset);
    console.log(e);
    return undefined;
  }
}

async function getAssetPoolBalances(assets: any, provider: any) {
  try {
    const balances: any = {};
    await Promise.all(
      Object.values(assets).map(async (a: any) => {
        balances[a.id] = {
          id: a.id,
          balance: await getAssetPoolBalance(a, provider),
          asset: a,
        };
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
 * @param asset
 * @param provider
 * @returns string
 */
async function getAssetPoolBalance(asset: any, provider: any) {
  try {
    const Pool = contracts.Pool__factory.connect(asset.poolAddr, provider);
    const base = await Pool.getBaseBalance();
    const fyToken = await Pool.getFYTokenBalance();

    // estimate how much base you would get from selling the fyToken in the pool
    let fyTokenToBaseEstimate;
    try {
      fyTokenToBaseEstimate = await Pool.sellFYTokenPreview(fyToken);
    } catch (e) {
      console.log(e);
    }
    const total = fyTokenToBaseEstimate ? fyTokenToBaseEstimate.add(base) : base;
    const total_ = ethers.utils.formatUnits(total, await Pool.decimals());
    return total_;
  } catch (e) {
    console.log('error getting pool balance for', asset);
    console.log(e);
    return '0';
  }
}

const mapAssetToPoolAddr = (seriesMap: ISeriesMap, assets: IAssetMap) => {
  if (seriesMap && assets) {
    const newMap: any = {};
    Object.values(seriesMap).map((s: ISeries) => {
      const asset = assets[s.baseId];
      const poolAddr = s.poolAddress;
      newMap[asset.id as string] = { ...asset, poolAddr };
      return asset;
    });
    return newMap;
  }
  return {};
};
