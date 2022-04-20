import { initializeConnector } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { SUPPORTED_RPC_URLS as URLS } from '../config/chainData';

export const [network, hooks] = initializeConnector<Network>(
  (actions) => new Network(actions, URLS),
  Object.keys(URLS).map((chainId) => Number(chainId))
);
