import React, { useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import SeriesItem from '../SeriesItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';

const SeriesList = () => {
  const series = useAppSelector((st) => st.chain.series);
  const seriesLoading = useAppSelector((st) => st.chain.seriesLoading);
  const [seriesList, setSeriesList] = useState<any[]>([]);

  useEffect(() => {
    Object.values(series).length > 0 &&
      setSeriesList([...Object.values(series)].sort((s1: any, s2: any) => s1?.maturity! - s2?.maturity!));
  }, [series]);

  return (
    <MainViewWrap>
      {seriesLoading ? (
        <ClipLoader loading={seriesLoading} />
      ) : (
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {seriesList.map((s: any) => (
            <SeriesItem item={s} key={s.id} />
          ))}
        </div>
      )}
    </MainViewWrap>
  );
};

export default SeriesList;
