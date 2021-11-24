import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';
import { useVaults } from './state/hooks/useVaults';
import useTvl from './state/hooks/useTvl';
import Footer from './components/Footer';
import useResetApp from './state/hooks/useResetApp';

function App() {
  useResetApp();
  useChain();
  useVaults();
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
