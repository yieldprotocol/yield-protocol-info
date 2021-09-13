import { IAsset, ISeries, IStrategy } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

export const updateChainId = (chainId: any) => ({ type: ActionType.CHAIN_ID, chainId });
export const setChainLoading = (chainLoading: boolean) => ({ type: ActionType.CHAIN_LOADING, chainLoading });
export const setSeriesLoading = (seriesLoading: boolean) => ({ type: ActionType.CHAIN_LOADING, seriesLoading });
export const setStrategiesLoading = (strategiesLoading: boolean) => ({
  type: ActionType.CHAIN_LOADING,
  strategiesLoading,
});
export const setAssetsLoading = (assetsLoading: boolean) => ({ type: ActionType.CHAIN_LOADING, assetsLoading });
export const updateSeries = (series: any) => ({ type: ActionType.UPDATE_SERIES, series });
export const updateStrategies = (strategies: any) => ({ type: ActionType.UPDATE_STRATEGIES, strategies });
export const updateAssets = (assets: any) => ({ type: ActionType.UPDATE_ASSETS, assets });

export const reset = () => ({ type: ActionType.RESET });
