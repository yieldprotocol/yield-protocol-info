import React, { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEvents } from '../../state/actions/contracts';
import RolesTable from '../RolesTable'

const Role = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);

  const roles = useAppSelector((st) => st.contracts.roles);
  const roleNames = useAppSelector((st) => st.contracts.roleNames);
  const eventsLoading = useAppSelector((st) => st.contracts.eventsLoading);
  const contractRoles = roles[addr]



  useEffect(() => {
    if (Object.keys(contractMap).length && addr) dispatch(getEvents(contractMap, addr));
  }, [contractMap, dispatch, addr]);

  return eventsLoading ? (
    <ClipLoader />
  ) : (
    <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-lg pb-4 flex gap-x-2">
        <RolesTable roles={contractRoles} roleNames={roleNames} />
      </div>
    </div>
  );
};

export default Role;
