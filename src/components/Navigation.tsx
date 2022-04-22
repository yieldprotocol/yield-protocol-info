import Link from 'next/link';
import { useRouter } from 'next/router';
import { useColorTheme } from '../hooks/useColorTheme';
import DarkModeToggle from './DarkModeToggle';
import YieldMark from './logos/YieldMark';
import NetworkModal from './NetworkModal';

const Navigation = () => {
  const router = useRouter();
  const views = ['contracts', 'series', 'strategies', 'assets', 'vaults', 'decode', 'liquidations'];

  const { theme } = useColorTheme();
  const darkMode = theme === 'dark';

  return (
    <div className="sticky top-0 z-10 flex-none">
      <nav className="dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 bg-white">
        <div className="mx-auto px-2 sm:px-4 lg:px-8">
          <div className="relative flex items-center justify-between h-16">
            <div className="flex items-center px-2">
              <Link href="/" passHref>
                <div className="rounded-lg cursor-pointer" style={{ textDecoration: 'none' }}>
                  <YieldMark colors={darkMode ? ['white'] : ['black']} height="1.75em" />
                </div>
              </Link>
              <div className="flex">
                <div className="ml-10 flex space-x-4">
                  {views.map((view) => (
                    <Link key={view} href={`/${view}`} passHref>
                      <div
                        className={
                          router.pathname.includes(view)
                            ? `cursor-pointer text-gray-900 hover:bg-gray-300 bg-gray-300 flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none focus-visible:ring focus-visible:ring-offset-2 focus-visible:ring-gray-800 focus-visible:ring-offset-gray-900 transition dark:text-gray-900 dark:hover:bg-gray-700 text-md leading-5 rounded-lg px-3 py-2`
                            : `cursor-pointer text-gray-900 hover:bg-gray-300 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white px-3 py-2 rounded-lg text-md font-medium`
                        }
                      >
                        {`${view[0].toUpperCase()}${view.slice(1)}`}
                      </div>
                    </Link>
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
