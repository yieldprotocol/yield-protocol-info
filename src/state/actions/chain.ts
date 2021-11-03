import { BigNumber, ethers } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { decimalNToDecimal18 } from '../../utils/yieldMath';
import { ActionType } from '../actionTypes/chain';
import { getPrice } from './vaults';
import * as contracts from '../../contracts';

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

export function getAssetsTvl(assets: any, contractMap: any, provider: any) {
  return async function _getAssetsTvl(dispatch: any) {
    // get the balance of the asset in the respective join
    const _balances: any = await getAssetJoinBalances(assets, contractMap, provider);
    const usdc: any = Object.values(assets).filter((a: any) => a.symbol === 'USDC')[0];

    if (provider && contractMap) {
      // convert the balances to usdc denomination
      const joinBalsInUSDC = await Promise.all(
        [...Object.values(_balances)]?.map(async (bal: any) => {
          const _price = await getPrice(bal.id, usdc.id, contractMap, bal.asset.decimals);
          const price = decimalNToDecimal18(_price, usdc?.decimals);
          const price_ = ethers.utils.formatUnits(price, 18);
          const balance_ = bal.balance ? ethers.utils.formatUnits(bal.balance, bal.asset.decimals) : '0';
          const _value = Number(price_) * Number(balance_);
          const value = isNaN(_value) ? 0 : _value;
          return {
            symbol: bal.asset.symbol,
            id: bal.id,
            value,
          };
        })
      );
      return dispatch(updateAssetsTvl(joinBalsInUSDC));
    }
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
