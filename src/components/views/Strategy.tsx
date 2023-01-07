import { cleanValue } from '../../utils/appUtils';
import MainViewWrap from '../wraps/MainViewWrap';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useContracts from '../../hooks/useContracts';
import { getEventArgs, getEvents } from '../../state/actions/contracts';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import SkeletonWrap from '../wraps/SkeletonWrap';
import { useStrategyReturns } from '../../hooks/useStrategyReturns';
import { IStrategy } from '../../types/chain';
import Spinner from '../Spinner';
import EventTable from '../EventTable';



const Strategy = ({ strategy }: { strategy: IStrategy }) => {
  const { strategyReturns, secondsToDays } = useStrategyReturns(strategy, 50000);

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
  return (
    <>

    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
        <div className="text-md pb-4">
          <strong>{strategy.symbol}</strong>
          <div className="pt-2">
            <i>
              {strategyReturns ? (
                <>
                  APY: {cleanValue(strategyReturns?.toString(), 2)}% using last {secondsToDays}
                </>
              ) : (
                <SkeletonWrap />
              )}
            </i>
          </div>
        </div>
        <SingleItemViewGrid item={strategy} />
      </div>
      </MainViewWrap>
      <MainViewWrap>

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

    </MainViewWrap>
    </>
  );
};

export default Strategy;
