import { BigNumber, ethers } from 'ethers';
import { cleanValue } from '../../utils/appUtils';
import { ActionType } from '../actionTypes/chain';
import { getPrice } from './vaults';

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
