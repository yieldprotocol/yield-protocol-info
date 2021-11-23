import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';
import { IContractMap, IEventArgsProps, IEventArgsPropsMap } from '../../types/contracts';

const Contract = () => {
  const { name } = useParams<{ name: string }>();
  const dispatch = useAppDispatch();
  const contractMap: IContractMap = useAppSelector((st) => st.contracts.contractMap);
  const eventArgsPropsMap: IEventArgsPropsMap = useAppSelector((st) => st.contracts.eventArgsPropsMap);
  const eventArgsProps: IEventArgsProps = eventArgsPropsMap[name];
  const events = useAppSelector((st) => st.contracts.events);
  const eventsLoading: boolean = useAppSelector((st) => st.contracts.eventsLoading);
  const contractEvents = events[name];

  useEffect(() => {
    if (Object.keys(contractMap).length && name) dispatch(getEvents(contractMap, name, undefined));
  }, [contractMap, dispatch, name]);

  return (
    <>
      <SubNav
        paths={[
          { path: `contracts/${name}/events`, name: 'events' },
          { path: `contracts/${name}/roles`, name: 'roles' },
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
