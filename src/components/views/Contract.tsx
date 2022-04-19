import React, { FC, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEventArgs, getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';
import { useRouter } from 'next/router';

const Contract: FC = () => {
  const router = useRouter();
  const name = router.query.name as string;
  console.log('🦄 ~ file: Contract.tsx ~ line 14 ~ name ', name);
  const dispatch = useAppDispatch();
  const { contractMap, events, eventsLoading, eventArgsPropsMap } = useAppSelector(({ contracts }) => contracts);
  const eventArgsProps = eventArgsPropsMap[name];
  const contractEvents = events[name];

  useEffect(() => {
    if (contractMap && name && !events[name]) {
      dispatch(getEvents(contractMap, name, undefined));
      dispatch(getEventArgs(contractMap, name));
    }
  }, [contractMap, dispatch, name, events]);

  if (!contractMap) return null;

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
                {contractEvents?.length ? (
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
