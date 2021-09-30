import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';
import { useChain } from './state/hooks/useChain';

function App() {
  useChain();

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
