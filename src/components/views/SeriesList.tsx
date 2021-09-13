import React, { useEffect, useState, useCallback } from 'react';
import SeriesItem from '../SeriesItem';
import { useAppSelector } from '../../state/hooks/general';

const SeriesList = () => {
  const series = useAppSelector((st) => st.chain.series);
  const seriesLoading = useAppSelector((st) => st.chain.seriesLoading);
  const [seriesList, setSeriesList] = useState<any[] | null>(null);

  useEffect(() => {
    series && setSeriesList([...Object.values(series)].sort((s1: any, s2: any) => s1?.maturity! - s2?.maturity!));
  }, [series]);

  return seriesLoading ? (
    <div>loading....</div>
  ) : (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {seriesList && seriesList.map((s: any) => <SeriesItem item={s} key={s.id} />)}
    </div>
  );
};

export default SeriesList;
