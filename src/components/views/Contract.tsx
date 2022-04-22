import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { getEventArgs, getEvents } from '../../state/actions/contracts';
import EventTable from '../EventTable';
import SubNav from '../SubNav';
import Header from '../Header';
import Spinner from '../Spinner';
import useContracts from '../../hooks/useContracts';

const Contract = () => {
  const contractMap = useContracts();
  const router = useRouter();
  const { name } = router.query;
  const dispatch = useAppDispatch();
  const { events, eventsLoading, eventArgsPropsMap } = useAppSelector(({ contracts }) => contracts);
  const eventArgsProps = eventArgsPropsMap[name as string];
  const contractEvents = events[name as string];

  useEffect(() => {
    if (contractMap && name && !events[name as string]) {
      dispatch(getEvents(contractMap, name as string, undefined));
      dispatch(getEventArgs(contractMap, name as string));
    }
  }, [contractMap, dispatch, name, events]);

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
          {eventsLoading && <Spinner />}
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
