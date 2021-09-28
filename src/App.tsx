import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/chain';
import { useVaults } from './state/hooks/useVaults';

function App() {
  useChain();
  useVaults();

  return (
    <div className="">
      <Navigation />
      <div className="h-full dark:bg-gray-900">
        <Routes />
      </div>
    </div>
  );
}

export default App;
