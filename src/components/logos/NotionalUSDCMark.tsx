import React from 'react';
import { useAppSelector } from '../../state/hooks/general';
import NotionalMark from './NotionalMark';
import USDCMark from './USDCMark';

const NotionalUSDCMark = ({ series }: { series: string }) => {
  const { series: seriesMap } = useAppSelector(({ chain }) => chain);
  const seriesColor = seriesMap![series].color;
  return (
    <div className="relative">
      <NotionalMark />
      <div className="absolute -left-2 -top-2">
        <div className="p-0.5 rounded-full" style={{ background: seriesColor }}>
          <USDCMark />
        </div>
      </div>
    </div>
  );
};

export default NotionalUSDCMark;
