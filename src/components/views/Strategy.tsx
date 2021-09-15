import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';

const Strategy = () => {
  const { id } = useParams<{ id: string }>();
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategy = strategies[id];

  return strategy ? (
    <div className="rounded-md p-5 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-sm">
        <strong>{strategy.symbol}</strong>
      </div>
      {Object.entries(strategy).map((key: any, val: any) => (
        <div className="text-sm" key={key}>
          {key}: {val}
        </div>
      ))}
    </div>
  ) : null;
};

export default Strategy;
