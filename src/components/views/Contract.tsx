import React, { useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
import SubNav from '../SubNav';
import Header from '../Header';

const Contract = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const events = useAppSelector((st) => st.contracts.events);
  const eventsLoading = useAppSelector((st) => st.contracts.eventsLoading);
  const contractEvents = events[addr];

  useEffect(() => {
    if (Object.keys(contractMap).length && addr) dispatch(getEvents(contractMap, addr));
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
        {eventsLoading ? (
          <ClipLoader />
        ) : (
          <div className="rounded-md p-8 align-middle justify-items-start shadow-sm bg-green-50">
            <div className="text-lg pb-4 flex gap-x-2">
              {contractEvents && contractEvents.length ? (
                <EventTable events={contractEvents} />
              ) : (
                <>No event data available</>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Contract;
