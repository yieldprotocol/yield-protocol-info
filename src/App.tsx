import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';
import { useVaults } from './state/hooks/useVaults';
import useTvl from './state/hooks/useTvl';

function App() {
  useChain();
  useVaults();
  useTvl();

  return (
    <div className="">
      <Navigation />
      <div className="h-full">
        <Routes />
      </div>
    </div>
  );
}

export default App;
