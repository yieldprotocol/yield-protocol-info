import React, { useEffect, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import { usePoolReturns } from '../../state/hooks/usePoolReturns';
import { ISeries } from '../../types/chain';
import { cleanValue } from '../../utils/appUtils';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import SkeletonWrap from '../wraps/SkeletonWrap';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const strategies = useAppSelector((st) => st.chain.strategies);
  const seriesMap = useAppSelector((st) => st.chain.series);
  const strategy = strategies[id];
  const strategySeries: ISeries = seriesMap[strategy.seriesId];
  const { poolReturns, secondsCompare } = usePoolReturns(strategySeries, 50000);
  const [secondsToDays, setSecondsToDays] = useState<string | null>(null);

  useEffect(() => {
    const _secondsToDays = formatDistanceStrict(
      new Date(1, 1, 0, 0, 0, 0),
      new Date(1, 1, 0, 0, 0, secondsCompare || 0),
      {
        unit: 'day',
      }
    );
    setSecondsToDays(_secondsToDays);
  }, [secondsCompare]);

  return strategy ? (
    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
        <div className="text-md pb-4">
          <strong>{strategy.symbol}</strong>
          <div className="pt-2">
            <i>
              {poolReturns ? (
                <>
                  APY: {cleanValue(poolReturns?.toString(), 2)}% using last {secondsToDays}
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
  ) : null;
};

export default Strategy;
