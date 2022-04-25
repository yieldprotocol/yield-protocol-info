import { useEffect } from 'react';
import { updateTheme } from '../state/actions/application';
import { useAppDispatch, useAppSelector } from '../state/hooks/general';
import { THEME_KEY } from '../utils/constants';
import { useLocalStorage } from './useLocalStorage';

const LIGHT = 'light';
const DARK = 'dark';

export const useColorTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(({ application }) => application.theme);
  const [, setCachedTheme] = useLocalStorage(THEME_KEY, LIGHT);

  const _setTheme = (_theme: string) => {
    dispatch(updateTheme(_theme));
    setCachedTheme(_theme);
  };

  const toggleTheme = () => {
    // Whenever the user explicitly chooses light mode
    if (theme === DARK) {
      // Whenever the user explicitly chooses light mode
      document.documentElement.classList.remove(DARK);
      _setTheme(LIGHT);
    } else {
      document.documentElement.classList.add(DARK);
      _setTheme(DARK);
    }
  };

  useEffect(() => {
    if (theme === DARK) {
      document.documentElement.classList.add(DARK);
      _setTheme(DARK);
    } else {
      document.documentElement.classList.remove(DARK);
      _setTheme(LIGHT);
    }
  }, []); // only on mount

  return { theme, toggleTheme };
};
