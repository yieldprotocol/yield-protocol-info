import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceStrict } from 'date-fns';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import { secondsToFrom } from '../../utils/yieldMath';

const Series = () => {
  const { id } = useParams<{ id: string }>();
  const seriesMap = useAppSelector((st) => st.chain.series);
  const series = seriesMap[id];

  const [secondsTillMaturity, setSecondsTillMaturity] = useState<number>(0);

  useEffect(() => {
    const _secondsTillMaturity = series?.maturity ? Number(secondsToFrom(series?.maturity)) : 0;
    _secondsTillMaturity > 0 ? setSecondsTillMaturity(_secondsTillMaturity) : setSecondsTillMaturity(0);
  }, [series?.maturity]);

  useEffect(() => {
    let timer: any;
    if (secondsTillMaturity > 0) {
      timer = setTimeout(() => {
        setSecondsTillMaturity((time) => time - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [series?.maturity, secondsTillMaturity]);

  const timeTillMaturity = formatDistanceStrict(
    new Date(1, 1, 0, 0, 0, 0),
    new Date(1, 1, 0, 0, 0, secondsTillMaturity)
  );

  return series ? (
    <div className="rounded-md p-5 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-md pb-4">
        <strong>{series.symbol}</strong>
        <div className="text-md pt-2">
          <i>{secondsTillMaturity > 0 ? `${timeTillMaturity} left until maturity` : 'Mature'}</i>
        </div>
      </div>
      <SingleItemViewGrid item={series} />
    </div>
  ) : null;
};

export default Series;
