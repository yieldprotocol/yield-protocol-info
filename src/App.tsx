import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';
import useTvl from './state/hooks/useTvl';
import Footer from './components/Footer';
import useResetApp from './state/hooks/useResetApp';
import { useVaults } from './state/hooks/useVaults';

function App() {
  useResetApp();
  useChain();
  useTvl();
  // useVaults();

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
