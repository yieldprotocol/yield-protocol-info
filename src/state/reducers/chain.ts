import { ethers } from 'ethers';
import { IChainAction, IChainState } from '../../types/chain';
import { ActionType } from '../actionTypes/chain';

const INITIAL_STATE = {
  provider: null as ethers.providers.JsonRpcProvider | null,
  chainId: (JSON.parse(localStorage.getItem('chainId')!) as number) || 1,

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

export default function rootReducer(state: IChainState = INITIAL_STATE, action: IChainAction): IChainState {
  switch (action.type) {
    case ActionType.PROVIDER:
      return { ...state, provider: action.payload };
    case ActionType.CHAIN_ID:
      return { ...state, chainId: action.payload };
    case ActionType.CHAIN_LOADING:
      return { ...state, chainLoading: action.payload };
    case ActionType.SERIES_LOADING:
      return { ...state, seriesLoading: action.payload };
    case ActionType.STRATEGIES_LOADING:
      return { ...state, strategiesLoading: action.payload };
    case ActionType.ASSETS_LOADING:
      return { ...state, assetsLoading: action.payload };
    case ActionType.ASSET_PAIR_DATA_LOADING:
      return { ...state, assetPairDataLoading: action.payload };
    case ActionType.UPDATE_SERIES:
      return {
        ...state,
        series: action.payload,
      };
    case ActionType.UPDATE_STRATEGIES:
      return {
        ...state,
        strategies: action.payload,
      };
    case ActionType.UPDATE_ASSETS:
      return {
        ...state,
        assets: action.payload,
      };
    case ActionType.UPDATE_ASSET_PAIR_DATA:
      return {
        ...state,
        assetPairData: { ...state.assetPairData, [action.payload.assetId]: action.payload.assetPairData },
      };
    case ActionType.UPDATE_ASSETS_TVL:
      return {
        ...state,
        assetsTvl: action.payload,
      };
    case ActionType.TVL_LOADING:
      return {
        ...state,
        tvlLoading: action.payload,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
