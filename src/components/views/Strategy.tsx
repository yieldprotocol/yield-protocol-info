import React, { useEffect, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import { usePoolReturns } from '../../state/hooks/usePoolReturns';
import { ISeries, IStrategy } from '../../types/chain';
import { cleanValue } from '../../utils/appUtils';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import SkeletonWrap from '../wraps/SkeletonWrap';
import { useStrategyReturns } from '../../state/hooks/useStrategyReturns';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategy: IStrategy = strategies[id];
  const { strategyReturns, secondsToDays } = useStrategyReturns(strategy, 50000);

  return strategy ? (
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
  ) : null;
};

export default Strategy;
