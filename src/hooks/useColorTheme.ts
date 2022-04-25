import { useEffect } from 'react';
import { THEME_KEY } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

const LIGHT = 'light';
const DARK = 'dark';

export const useColorTheme = () => {
  const [theme, setTheme] = useLocalStorage(THEME_KEY, DARK);

  const toggleTheme = () => {
    // Whenever the user explicitly chooses light mode
    if (theme === DARK) {
      // Whenever the user explicitly chooses light mode
      document.documentElement.classList.remove(DARK);
      setTheme(LIGHT);
    } else {
      document.documentElement.classList.add(DARK);
      setTheme(DARK);
    }
  };

  useEffect(() => {
    if (theme === DARK) {
      document.documentElement.classList.add(DARK);
      setTheme(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
      setTheme(LIGHT);
    }
  }, []); // only on mount

  return { theme, toggleTheme };
};
