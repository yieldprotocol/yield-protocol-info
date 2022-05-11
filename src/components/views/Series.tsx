import { useEffect, useState } from 'react';
import { formatDistanceStrict } from 'date-fns';
import SingleItemViewGrid from '../wraps/SingleItemViewGrid';
import { secondsToFrom } from '../../utils/yieldMath';
import MainViewWrap from '../wraps/MainViewWrap';
import { ISeries } from '../../types/chain';
import { useSeriesReturns } from '../../hooks/useSeriesReturns';
import SkeletonWrap from '../wraps/SkeletonWrap';
import InfoIcon from '../InfoIcon';

const Series = ({ series }: { series: ISeries }) => {
  const { seriesReturns, feesAPR, fyTokenPoolAPR } = useSeriesReturns(series);
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
    if (series) {
      const _secondsTillMaturity = Number(secondsToFrom(maturity.toString()));
      _secondsTillMaturity > 0 ? setSecondsTillMaturity(_secondsTillMaturity) : setSecondsTillMaturity(0);
    }
  }, [series, maturity]);

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
            <div className="mb-1">
              <i>{secondsTillMaturity > 0 ? `${timeTillMaturity} left until maturity` : 'Mature'}</i>
            </div>
            <div className="flex">
              {seriesReturns ? (
                <>
                  <i>APR: {seriesReturns}%</i>
                  <div className="h-3 w-3">
                    <InfoIcon
                      infoText={`fees annualized (${feesAPR}%) + fyToken interest annualized (${fyTokenPoolAPR}%)`}
                    />
                  </div>
                </>
              ) : (
                <SkeletonWrap height={5} width={10} />
              )}
            </div>
          </div>
        </div>
        <SingleItemViewGrid item={series_} />
      </div>
    </MainViewWrap>
  ) : null;
};

export default Series;
