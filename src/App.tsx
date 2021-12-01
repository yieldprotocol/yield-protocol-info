import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';
import useTvl from './state/hooks/useTvl';
import Footer from './components/Footer';
import { useAppSelector } from './state/hooks/general';

function App() {
  const { chainId } = useAppSelector(({ chain }) => chain);
  useChain(chainId);
  useTvl();

  return (
    <>
      <Navigation />
      <div className="h-full">
        <Routes />
      </div>
      <Footer />
    </>
  );
}

export default App;
