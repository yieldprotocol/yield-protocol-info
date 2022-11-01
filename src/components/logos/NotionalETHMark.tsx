import React, { useEffect, useState } from 'react';
import useSeries from '../../hooks/useSeries';
import NotionalMark from './NotionalMark';
import EthMark from './EthMark';

const NotionalETHMark = ({ seriesId }: { seriesId: string }) => {
  const { data: seriesMap } = useSeries();
  const [seriesColor, setSeriesColor] = useState<string>();

  useEffect(() => {
    if (seriesMap && seriesId) {
      setSeriesColor(seriesMap[seriesId]?.color!);
    }
  }, [seriesId, seriesMap]);

  return (
    <div className="relative">
      <NotionalMark />
      <div className="absolute -left-2 -top-2">
        <div className="p-0.5 rounded-full" style={{ background: seriesColor }}>
          <EthMark />
        </div>
      </div>
    </div>
  );
};

export default NotionalETHMark;
