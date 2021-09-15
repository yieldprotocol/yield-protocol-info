import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategy = strategies[id];

  return strategy ? (
    <div className="rounded-md p-5 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-md pb-4">
        <strong>{strategy.symbol}</strong>
      </div>
      <SingleItemViewGrid item={strategy} />
    </div>
  ) : null;
};

export default Strategy;
