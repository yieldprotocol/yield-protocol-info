import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getRoles } from '../../state/actions/roles';
import RolesTable from '../RolesTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';

const Role = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);

  const roles = useAppSelector((st) => st.contracts.roles);
  const roleNames = useAppSelector((st) => st.contracts.roleNames);
  const rolesLoading = useAppSelector((st) => st.contracts.rolesLoading);
  const contractRoles = roles[addr];

  useEffect(() => {
    if (Object.keys(contractMap).length && addr) dispatch(getRoles(contractMap, addr));
  }, [contractMap, dispatch, addr]);

  return (
    <>
      <SubNav
        paths={[
          { path: `contracts/${addr}/events`, name: 'events' },
          { path: `contracts/${addr}/roles`, name: 'roles' },
        ]}
      />
      <div className="ml-56">
        <Header> </Header>
        <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20">
          <Spinner loading={rolesLoading} />
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
