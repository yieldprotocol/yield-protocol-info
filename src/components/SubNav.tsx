import React from 'react';
import { NavLink } from 'react-router-dom';

interface IPath {
  name: string;
  path: string;
}

const SubNav = ({ paths }: { paths: IPath[] }) => (
  <div className="sticky top-12 z-12 flex-none bg-white">
    <div className="bg-white w-full">
      <div className="py-4 sm:px-6 lg:px-8">
        <div className="flex relative ml-40">
          <div className="p-2 lg:px-0 lg:space-x-2">
            <div className="space-x-4 items-center">
              {paths.map((path: IPath) => (
                <NavLink
                  key={path.name}
                  to={`/${path.path}`}
                  activeClassName="underline text-gray-900 hover:underline dark:hover:underline flex-shrink-0 inline-flex items-center justify-center overflow-hidden font-medium truncate focus:outline-none dark:text-white dark:hover:bg-gray-700 text-lg leading-5 px-3 py-2"
                  className="text-gray-900 hover:underline dark:text-gray-300 dark:hover:underline dark:hover:text-white px-3 py-2 rounded-md text-lg font-medium"
                >
                  {`${path.name[0].toUpperCase()}${path.name.slice(1)}`}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default SubNav;
