import { ChainId } from './networks';

const RPC_URLS = {
  [ChainId.MAINNET]: process.env.REACT_APP_RPC_URL_1 as string,
  [ChainId.KOVAN]: process.env.REACT_APP_RPC_URL_42 as string,
};

export default RPC_URLS;
