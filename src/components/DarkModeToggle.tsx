import React, { FC, useEffect } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { toggleDarkMode } from '../state/actions/application';

const DarkModeToggle: FC = () => {
  const { darkMode } = useAppSelector(({ application }) => application);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function updateDarkClass() {
      darkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark');
    }
    updateDarkClass();
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleDarkMode(!darkMode))}
      className="p-2 h-auto ml-3 rounded-lg flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-gray-800 focus-visible:ring-offset-gray-900 transition hover:bg-gray-300  text-base leading-5  bg-gray-200 dark:active:bg-gray-700"
    >
      {darkMode ? <FiMoon className="text-purple-500" /> : <FiSun className="text-amber-500" />}
    </button>
  );
};

export default DarkModeToggle;
