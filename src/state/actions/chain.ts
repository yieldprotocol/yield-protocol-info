import { IAsset, ISeries, IStrategy } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

export const updateChainId = (chainId: any) => ({ type: ActionType.CHAIN_ID, chainId });
export const setChainLoading = (chainLoading: boolean) => ({ type: ActionType.CHAIN_LOADING, chainLoading });
export const setSeriesLoading = (seriesLoading: boolean) => ({ type: ActionType.SERIES_LOADING, seriesLoading });
export const setStrategiesLoading = (strategiesLoading: boolean) => ({
  type: ActionType.STRATEGIES_LOADING,
  strategiesLoading,
});
export const setEventsLoading = (eventsLoading: boolean) => ({ type: ActionType.EVENTS_LOADING, eventsLoading });
export const setAssetsLoading = (assetsLoading: boolean) => ({ type: ActionType.ASSETS_LOADING, assetsLoading });
export const updateSeries = (series: any) => ({ type: ActionType.UPDATE_SERIES, series });
export const updateStrategies = (strategies: any) => ({ type: ActionType.UPDATE_STRATEGIES, strategies });
export const updateAssets = (assets: any) => ({ type: ActionType.UPDATE_ASSETS, assets });
export const updateEvents = (events: any) => ({ type: ActionType.UPDATE_EVENTS, events });
export const updateContractMap = (contractMap: any) => ({ type: ActionType.UPDATE_CONTRACT_MAP, contractMap });

export const reset = () => ({ type: ActionType.RESET });
