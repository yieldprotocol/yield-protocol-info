import React from 'react';
import Routes from './components/Routes';
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="h-screen overflow-y-hidden">
      <Navigation />
      <div className="h-full bg-white dark:bg-gray-900">
        <Routes />
      </div>
    </div>
  );
}

export default App;
