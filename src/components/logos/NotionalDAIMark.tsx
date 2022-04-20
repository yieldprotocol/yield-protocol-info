import { useEffect, useState } from 'react';
import useSeries from '../../hooks/useSeries';
import DaiMark from './DaiMark';
import NotionalMark from './NotionalMark';

const NotionalDAIMark = ({ seriesId }: { seriesId: string }) => {
  const seriesMap = useSeries();
  const [seriesColor, setSeriesColor] = useState<string>();

  useEffect(() => {
    if (seriesMap) {
      setSeriesColor(seriesMap[seriesId].color);
    }
  }, [seriesId, seriesMap]);

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
