import React, { FC, useEffect, useState } from 'react';
import StrategyItem from '../StrategyItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';
import Spinner from '../Spinner';
import { IStrategy } from '../../types/chain';

const Strategies: FC = () => {
  const { strategies, strategiesLoading } = useAppSelector((st) => st.chain);
  const [strategiesList, setStrategiesList] = useState<IStrategy[]>([]);

  useEffect(() => {
    if (strategies) {
      setStrategiesList([...Object.values(strategies)].sort((s1: any, s2: any) => (s1?.name! < s2?.name! ? -1 : 1)));
    }
  }, [strategies]);

  if (!Object.values(strategies!).length) return <MainViewWrap>No Strategies</MainViewWrap>;

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
