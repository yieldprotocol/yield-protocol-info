import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../state/hooks/general';
import DarkModeToggle from './DarkModeToggle';
import YieldMark from './logos/YieldMark';
import NetworkModal from './NetworkModal';

const Navigation = () => {
  const views = ['contracts', 'series', 'strategies', 'assets', 'vaults', 'governance', 'liquidations'];
  const darkMode = useAppSelector((st) => st.application.darkMode);

  return (
    <div className="sticky top-0 z-10 flex-none">
      <nav className="dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 bg-white">
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center px-2">
              <NavLink to="/" className="rounded-lg" style={{ textDecoration: 'none' }}>
                <YieldMark colors={darkMode ? ['white'] : ['black']} height="1.75em" />
              </NavLink>
              <div className="flex">
                <div className="ml-10 flex space-x-4">
                  {views.map((view) => (
                    <NavLink
                      key={view}
                      to={`/${view}`}
                      activeClassName="text-gray-900 hover:bg-gray-300 bg-gray-300 dark:hover:bg-gray-700 flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-gray-800 focus-visible:ring-offset-gray-900 transition dark:text-gray-900 dark:hover:bg-gray-700 text-md leading-5 rounded-lg px-3 py-2"
                      className="text-gray-900 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-md font-medium"
                    >
                      {`${view[0].toUpperCase()}${view.slice(1)}`}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex">
              <NetworkModal />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};
export default Navigation;
