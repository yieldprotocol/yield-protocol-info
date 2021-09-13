import React from 'react';
import StrategyItem from '../StrategyItem';
import { useAppSelector } from '../../state/hooks/general';

const Strategies = () => {
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategiesLoading = useAppSelector((st) => st.chain.strategiesLoading);
  return strategiesLoading ? (
    <div>loading...</div>
  ) : (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {strategies && [...Object.values(strategies)].map((s: any) => <StrategyItem item={s} key={s.id} />)}
    </div>
  );
};

export default Strategies;
