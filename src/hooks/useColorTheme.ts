import { useEffect, useState } from 'react';
import { THEME_KEY } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

const LIGHT = 'light';
const DARK = 'dark';

export const useColorTheme = () => {
  const [cachedTheme, setCachedTheme] = useLocalStorage(THEME_KEY, LIGHT);
  const [theme, setTheme] = useState(cachedTheme);

  const _setTheme = (_theme: string) => {
    setTheme(_theme);
    setCachedTheme(_theme);
  };

  const toggleTheme = () => {
    // Whenever the user explicitly chooses light mode
    if (theme === LIGHT) {
      // Whenever the user explicitly chooses light mode
      document.documentElement.classList.add(DARK);
      _setTheme(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
      _setTheme(LIGHT);
    }
  };

  useEffect(() => {
    if (cachedTheme === LIGHT) {
      document.documentElement.classList.remove(DARK);
      _setTheme(LIGHT);
    } else {
      document.documentElement.classList.add(DARK);
      _setTheme(DARK);
    }
  }, []); // only on mount

  return { theme, toggleTheme };
};
