import React, { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
// import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const ROLE_GRANTED = 'RoleGranted';
const ROLE_REVOKED = 'RoleRevoked';

const Role = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const events = useAppSelector((st) => st.contracts.events);
  const eventsLoading = useAppSelector((st) => st.contracts.eventsLoading);

  // Couldn't tell if we were guaranteed this sort order so sorting
  const contractEvents = events[addr].sort((a:any, b:any) => a.logIndex - b.logIndex);


  // Iterate through events to determine current roles
  const roles = contractEvents.reduce((acc: any, event: any) => {
    if (![ROLE_GRANTED, ROLE_REVOKED].includes(event.event)) return acc

    const [roleBytes, guy]  = event.args.split(',')
    if (event.event === ROLE_GRANTED) {
      if (roleBytes in acc) {
        acc[roleBytes].add(guy);
      } else {
        acc[roleBytes] = new Set([guy])
      }
    }
    if (event.event === ROLE_REVOKED) {
      if (roleBytes in acc) {
        acc[roleBytes].delete(guy);
      } else {
        console.warn('RevokeRole encounted before Grant, logIndex:', event.logIndex)
      }
    }

    return acc
  }, {})
  console.log('roles', roles)

  useEffect(() => {
    if (Object.keys(contractMap).length && addr) dispatch(getEvents(contractMap, addr));
  }, [contractMap, dispatch, addr]);

  return eventsLoading ? (
    <ClipLoader />
  ) : (
    <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-lg pb-4 flex gap-x-2">
        <EventTable events={contractEvents} />
      </div>
    </div>
  );
};

export default Role;
