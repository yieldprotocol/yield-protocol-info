import { useEffect } from 'react';
import Home from '../components/views/Home';
import { useCachedState } from '../hooks/useCachedState';
import { useAppSelector } from '../state/hooks/general';
import { useChain } from '../state/hooks/useChain';
import useTvl from '../state/hooks/useTvl';

const Index = () => {
  const { chainId, chainLoading } = useAppSelector(({ chain }) => chain);
  const [, setCachedChainId] = useCachedState('chainId', chainId.toString());
  useChain(chainId);
  useTvl();

  useEffect(() => {
    setCachedChainId(chainId);
  }, [chainId, setCachedChainId]);

  return <Home />;
};

export default Index;
