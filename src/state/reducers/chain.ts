import { ethers } from 'ethers';
import { ActionType } from '../actionTypes/chain';

const INITIAL_STATE = {
  provider: null as ethers.providers.JsonRpcProvider | null,
  chainId: Number(process.env.REACT_APP_DEFAULT_CHAINID) || 1,

  /* flags */
  chainLoading: true,
  seriesLoading: false,
  strategiesLoading: false,
  assetsLoading: false,
  tvlLoading: false,
  assetPairDataLoading: false,

  /* Data */
  series: null,
  strategies: null,
  assets: null,
  assetsTvl: [],
  assetPairData: null,
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.PROVIDER:
      return { ...state, provider: action.provider };
    case ActionType.CHAIN_ID:
      return { ...state, chainId: action.chainId };
    case ActionType.CHAIN_LOADING:
      return { ...state, chainLoading: action.chainLoading };
    case ActionType.SERIES_LOADING:
      return { ...state, seriesLoading: action.seriesLoading };
    case ActionType.STRATEGIES_LOADING:
      return { ...state, strategiesLoading: action.strategiesLoading };
    case ActionType.ASSETS_LOADING:
      return { ...state, assetsLoading: action.assetsLoading };
    case ActionType.ASSET_PAIR_DATA_LOADING:
      return { ...state, assetPairDataLoading: action.assetPairDataLoading };
    case ActionType.UPDATE_SERIES:
      return {
        ...state,
        series: action.series,
      };
    case ActionType.UPDATE_STRATEGIES:
      return {
        ...state,
        strategies: action.strategies,
      };
    case ActionType.UPDATE_ASSETS:
      return {
        ...state,
        assets: action.assets,
      };
    case ActionType.UPDATE_ASSET_PAIR_DATA:
      return {
        ...state,
        assetPairData: { ...state.assetPairData, [action.payload.assetId]: action.payload.assetPairData },
      };
    case ActionType.UPDATE_ASSETS_TVL:
      return {
        ...state,
        assetsTvl: action.assetsTvl,
      };
    case ActionType.TVL_LOADING:
      return {
        ...state,
        tvlLoading: action.tvlLoading,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
