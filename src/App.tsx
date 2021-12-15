import React, { useEffect } from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';
import useTvl from './state/hooks/useTvl';
import Footer from './components/Footer';
import { useAppSelector } from './state/hooks/general';
import Spinner from './components/Spinner';
import { useCachedState } from './hooks/useCachedState';

function App() {
  const { chainId, chainLoading } = useAppSelector(({ chain }) => chain);
  const [, setCachedChainId] = useCachedState('chainId', chainId.toString());
  useChain(chainId);
  useTvl();

  useEffect(() => {
    setCachedChainId(chainId);
  }, [chainId, setCachedChainId]);

  return (
    <>
      <Navigation />
      <div className="h-full">
        {chainLoading ? (
          <div className="mt-20">
            <Spinner loading={chainLoading} />
          </div>
        ) : (
          <Routes />
        )}
        <Footer />
      </div>
    </>
  );
}

export default App;
