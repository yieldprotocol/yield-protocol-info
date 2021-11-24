import React, { useEffect, useState } from 'react';
import StrategyItem from '../StrategyItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';
import Spinner from '../Spinner';

const Strategies = () => {
  const strategies = useAppSelector((st) => st.chain.strategies);
  const strategiesLoading = useAppSelector((st) => st.chain.strategiesLoading);
  const [strategiesList, setStrategiesList] = useState<any[]>([]);

  useEffect(() => {
    Object.values(strategies).length > 0 &&
      setStrategiesList([...Object.values(strategies)].sort((s1: any, s2: any) => (s1?.name! < s2?.name! ? -1 : 1)));
  }, [strategies]);

  if (!Object.values(strategies).length) return <MainViewWrap>No Strategies</MainViewWrap>;

  return (
    <MainViewWrap>
      <Spinner loading={strategiesLoading} />
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {strategiesList.map((s: any) => (
          <StrategyItem item={s} key={s.id} />
        ))}
      </div>
    </MainViewWrap>
  );
};

export default Strategies;
