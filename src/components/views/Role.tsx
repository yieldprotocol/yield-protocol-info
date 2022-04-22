import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getRoles } from '../../state/actions/roles';
import RolesTable from '../RolesTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';
import useContracts from '../../hooks/useContracts';

const Role = () => {
  const contractMap = useContracts();
  const router = useRouter();
  const { name } = router.query;
  const dispatch = useAppDispatch();
  const { roles, roleNames, rolesLoading } = useAppSelector(({ contracts }) => contracts);
  const contractRoles = roles[name as string];

  useEffect(() => {
    if (contractMap && name) dispatch(getRoles(contractMap, name as string));
  }, [contractMap, dispatch, name]);

  if (!contractMap) return null;

  return (
    <>
      <SubNav
        paths={[
          { path: `/contracts/events/${name}`, name: 'events' },
          { path: `/contracts/roles/${name}`, name: 'roles' },
        ]}
      />
      <div className="ml-56">
        <Header> </Header>
        <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20">
          {rolesLoading && <Spinner />}
          {!rolesLoading && (
            <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-200">
              <div className="text-lg pb-4 flex gap-x-2">
                {contractRoles && Object.keys(contractRoles).length ? (
                  <RolesTable roles={contractRoles} roleNames={roleNames} />
                ) : (
                  <>No roles found</>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Role;
