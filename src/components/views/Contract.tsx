import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';

const Contract = () => {
  const { addr } = useParams<{ addr: string }>();
  const dispatch = useAppDispatch();
  const contractMap = useAppSelector((st) => st.contracts.contractMap);
  const eventArgsPropsMap = useAppSelector((st) => st.contracts.eventArgsPropsMap);
  const eventArgsProps = eventArgsPropsMap[addr];
  const events = useAppSelector((st) => st.contracts.events);
  const eventsLoading = useAppSelector((st) => st.contracts.eventsLoading);
  const contractEvents = events[addr];

  useEffect(() => {
    if (Object.keys(contractMap).length && addr) dispatch(getEvents(contractMap, addr));
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
          <Spinner loading={eventsLoading} />
          {!eventsLoading && (
            <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-200">
              <div className="text-lg pb-4 flex gap-x-2">
                {contractEvents && contractEvents.length ? (
                  <EventTable events={contractEvents} eventArgsProps={eventArgsProps} />
                ) : (
                  <>No event data available</>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Contract;
