import { Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { Network } from '@web3-react/network';
import { useEffect } from 'react';
import { hooks as networkHooks, network } from '../connectors/network';
import { useCachedState } from './useCachedState';

const connectors: [Network, Web3ReactHooks][] = [[network, networkHooks]];

export default function Web3Provider({ children }) {
  const [cachedChainId] = useCachedState('chainId', 1);

  useEffect(() => {
    connectors[0][0].activate(cachedChainId);
  }, [cachedChainId]);

  return <Web3ReactProvider connectors={connectors}>{children}</Web3ReactProvider>;
}
