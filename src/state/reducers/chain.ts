import { ActionType } from '../actionTypes/chain';

const INITIAL_STATE = {
  chainId: Number(process.env.REACT_APP_DEFAULT_CHAINID) as number | null,

  /* flags */
  chainLoading: true,
  seriesLoading: false,
  strategiesLoading: false,
  assetsLoading: false,

  /* Data */
  series: {},
  strategies: {},
  assets: {},
  events: {},
  contractMap: {},
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.CHAIN_ID:
      return { ...state, chainId: action.chainId };
    case ActionType.CHAIN_LOADING:
      return { ...state, chainLoading: action.chainLoading };
    case ActionType.SERIES_LOADING:
      return { ...state, seriesLoading: action.seriesLoading };
    case ActionType.STRATEGIES_LOADING:
      return { ...state, strategiesLoading: action.strategiesLoading };
    case ActionType.EVENTS_LOADING:
      return { ...state, eventsLoading: action.eventsLoading };
    case ActionType.ASSETS_LOADING:
      return { ...state, assetsLoading: action.assetsLoading };
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
    case ActionType.UPDATE_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case ActionType.UPDATE_CONTRACT_MAP:
      return {
        ...state,
        contractMap: action.contractMap,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
