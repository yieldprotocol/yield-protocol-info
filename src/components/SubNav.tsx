import Link from 'next/link';
import { useRouter } from 'next/router';

interface IPath {
  name: string;
  path: string;
}

const SubNav = ({ paths }: { paths: IPath[] }) => {
  const router = useRouter();
  const { pathname } = router;

  return (
    <div className="z-12 bg-gray-100 dark:bg-gray-800 h-full fixed lg:w-60 md:w-32 sm:w-16 dark:border-gray-700 ">
      <div className="py-4 sm:px-6 lg:px-8">
        <div className="p-2 lg:px-0 mt-10">
          {paths.map((path: IPath) => (
            <div key={path.name} className="py-4 ml-0">
              <Link href={`${path.path}`} passHref>
                <div
                  className={
                    pathname.includes(path.name)
                      ? `cursor-pointer underline text-gray-900 hover:underline dark:hover:underline flex-shrink-0 inline-flex items-start overflow-hidden font-medium focus:outline-none dark:text-white text-lg`
                      : `cursor-pointer text-gray-900 hover:underline dark:text-gray-200 dark:hover:underline dark:hover:text-white rounded-lg text-lg font-medium`
                  }
                >
                  {`${path.name[0].toUpperCase()}${path.name.slice(1)}`}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SubNav;
