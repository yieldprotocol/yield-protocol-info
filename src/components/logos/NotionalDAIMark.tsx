import React from 'react';
import { useAppSelector } from '../../state/hooks/general';
import DaiMark from './DaiMark';
import NotionalMark from './NotionalMark';

const NotionalDAIMark = ({ series }: { series: string }) => {
  const { series: seriesMap } = useAppSelector(({ chain }) => chain);
  const seriesColor = seriesMap![series].color;
  return (
    <div className="relative">
      <NotionalMark />
      <div className="absolute -left-2 -top-2">
        <div className="p-0.5 rounded-full" style={{ background: seriesColor }}>
          <DaiMark />
        </div>
      </div>
    </div>
  );
};

export default NotionalDAIMark;
