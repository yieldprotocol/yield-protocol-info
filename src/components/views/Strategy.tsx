import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategy = strategies[id];

  return strategy ? (
    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md dark:bg-green-400 bg-green-100">
        <div className="text-md pb-4">
          <strong>{strategy.symbol}</strong>
        </div>
        <SingleItemViewGrid item={strategy} />
      </div>
    </MainViewWrap>
  ) : null;
};

export default Strategy;
