import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import { usePoolReturns } from '../../state/hooks/usePoolReturns';
import { cleanValue } from '../../utils/appUtils';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import SkeletonWrap from '../wraps/SkeletonWrap';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const provider = useAppSelector((st) => st.chain.provider);
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategy = strategies[id];
  const { poolReturns, timeframe } = usePoolReturns(strategy.poolAddress, provider);

  return strategy ? (
    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
        <div className="text-md pb-4">
          <strong>{strategy.symbol}</strong>
          <div>
            <i>
              {poolReturns ? (
                <>
                  APY: {cleanValue(poolReturns?.toString(), 2)}% using last {timeframe}
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
