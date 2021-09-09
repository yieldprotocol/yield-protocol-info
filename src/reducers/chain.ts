import { ethers } from 'ethers';
import { IAssetRoot, ISeriesRoot, ActionType } from '../types/chain';

const INITIAL_STATE = {
  appVersion: '0.0.0' as string,
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

  /* Connected Contract Maps */
  contractMap: {},
  assetRootMap: {},
  seriesRootMap: {},
  strategyRootMap: {},
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.APP_VERSION:
      return { ...state, appVersion: action.appVersion };
    case ActionType.FALLBACK_PROVIDER:
      return { ...state, fallbackProvider: action.fallbackProvider };
    case ActionType.PROVIDER:
      return { ...state, provider: action.provider };
    case ActionType.SIGNER:
      return { ...state, signer: action.signer };
    case ActionType.CHAIN_LOADING:
      return { ...state, chainLoading: action.chainLoading };
    case ActionType.CHAIN_ID:
      return { ...state, chainId: action.chainId };
    case ActionType.WEB3_ACTIVE:
      return { ...state, web3Active: action.web3Active };
    case ActionType.CONNECTORS:
      return { ...state, connectors: action.connectors };
    case ActionType.CONNECTOR:
      return { ...state, connector: action.connector };
    case ActionType.ACCOUNT:
      return { ...state, account: action.account };
    case ActionType.CONTRACT_MAP:
      return { ...state, contractMap: action.contractMap };
    case ActionType.ADD_ASSET:
      return {
        ...state,
        assetRootMap: { ...state.assetRootMap, [action.asset?.id]: { ...action.asset } },
      };
    case ActionType.ADD_SERIES:
      return {
        ...state,
        seriesRootMap: { ...state.seriesRootMap, [action.series?.id]: { ...action.series } },
      };

    default:
      return state;
  }
}
