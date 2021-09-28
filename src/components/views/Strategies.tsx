import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import StrategyItem from '../StrategyItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';

const Strategies = () => {
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategiesLoading = useAppSelector((st) => st.chain.strategiesLoading);
  return (
    <MainViewWrap>
      {strategiesLoading ? (
        <ClipLoader loading={strategiesLoading} />
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {[...Object.values(strategies)].map((s: any) => (
            <StrategyItem item={s} key={s.id} />
          ))}
        </div>
      )}
    </MainViewWrap>
  );
};

export default Strategies;
