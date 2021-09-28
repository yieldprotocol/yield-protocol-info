import React, { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getRoles } from '../../state/actions/roles';
import RolesTable from '../RolesTable';
import MainViewWrap from '../wraps/MainViewWrap';
import SubNav from '../SubNav';

const chainNames: any = {
  1: 'Mainnet',
  3: 'Ropsten',
  4: 'Rinkeby',
  5: 'Goerli',
  10: 'Optimism',
  42: 'Kovan',
};

const Role = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const chainId = useAppSelector((st) => st.chain?.chainId);
  const chainName = chainNames[chainId];

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
      <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20">
        {rolesLoading ? (
          <ClipLoader />
        ) : (
          <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
            <h1 className="">
              {contractMap[addr]?.name} - {chainName}
            </h1>
            <code className="text-sm">{addr}</code>
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
