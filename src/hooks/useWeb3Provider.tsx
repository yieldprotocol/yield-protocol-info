import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { useEffect } from 'react';
import { hooks as networkHooks, network } from '../connectors/network';
import { CHAIN_ID_LOCAL_STORAGE } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

const connectors: [Network, Web3ReactHooks][] = [[network, networkHooks]];

export default function Web3Provider({ children }) {
  const [cachedChainId] = useLocalStorage(CHAIN_ID_LOCAL_STORAGE, '1');

  useEffect(() => {
    connectors[0][0].activate(+cachedChainId);
  }, [cachedChainId]);

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>;
}
