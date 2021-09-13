import { ethers } from 'ethers';
import { ActionType } from '../actionTypes/chain';

const INITIAL_STATE = {
  chainId: Number(process.env.REACT_APP_DEFAULT_CHAINID) as number | null,
  provider: null as ethers.providers.Web3Provider | null,
  fallbackProvider: null as ethers.providers.Web3Provider | null,
  signer: null as ethers.providers.JsonRpcSigner | null,
  account: null as string | null,
  web3Active: false as boolean,
  fallbackActive: false as boolean,
  connectors: {},
  connector: null as ethers.providers.Web3Provider | null,

  /* settings */
  connectOnLoad: true as boolean,

  /* flags */
  chainLoading: true,
  seriesLoading: false,
  strategiesLoading: false,
  assetsLoading: false,

  /* Connected Contract Maps */
  contractMap: null,
  assets: null,
  series: null,
  strategies: null,
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
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
