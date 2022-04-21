import { FiMoon, FiSun } from 'react-icons/fi';
import { useColorTheme } from '../hooks/useColorTheme';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useColorTheme();
  const darkMode = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-2 h-auto ml-3 rounded-lg flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-gray-800 focus-visible:ring-offset-gray-900 transition hover:bg-gray-300  text-base leading-5  bg-gray-200 dark:active:bg-gray-700"
    >
      {darkMode ? <FiMoon className="text-purple-500" /> : <FiSun className="text-amber-500" />}
    </button>
  );
};

export default DarkModeToggle;
