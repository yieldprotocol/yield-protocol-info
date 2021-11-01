import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { formatDistanceStrict } from 'date-fns';
import { useAppSelector } from '../../state/hooks/general';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import { secondsToFrom } from '../../utils/yieldMath';
import MainViewWrap from '../wraps/MainViewWrap';

const Series = () => {
  const { id: seriesId } = useParams<{ id: string }>();
  const seriesMap = useAppSelector((st) => st.chain.series);
  const series = seriesMap[seriesId];
  const { id, baseId, maturity, symbol, address, fyTokenAddress, poolAddress, poolName, poolSymbol, fullDate } = series;
  const series_ = {
    id,
    baseId,
    maturity,
    symbol,
    address,
    fyTokenAddress,
    poolAddress,
    poolName,
    poolSymbol,
    fullDate,
  }; // for table

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
    <MainViewWrap>
      <div className="rounded-lg p-8 align-middle justify-items-start shadow-md bg-green-100 dark:bg-green-400">
        <div className="text-md pb-4">
          <strong>{series.symbol}</strong>
          <div className="text-md pt-2">
            <i>{secondsTillMaturity > 0 ? `${timeTillMaturity} left until maturity` : 'Mature'}</i>
          </div>
        </div>
        <SingleItemViewGrid item={series_} />
      </div>
    </MainViewWrap>
  ) : null;
};

export default Series;
