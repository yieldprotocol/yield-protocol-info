import React, { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getRoles } from '../../state/actions/roles';
import RolesTable from '../RolesTable';
import SubNav from '../SubNav';
import Header from '../Header';

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
      <Header>
      <SubNav
        paths={[
          { path: `contracts/${addr}/events`, name: 'events' },
          { path: `contracts/${addr}/roles`, name: 'roles' },
        ]}
      />
      </Header>
      <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20">
        {rolesLoading ? (
          <ClipLoader />
        ) : (
          <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
            <div className="text-lg pb-4 flex gap-x-2">
              <RolesTable roles={contractRoles} roleNames={roleNames} />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Role;
