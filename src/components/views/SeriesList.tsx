import React from 'react';
import SeriesItem from '../AssetItem';
import { useAppSelector } from '../../state/hooks/general';

const SeriesList = () => {
  const series = useAppSelector((st) => st.chain.series);
  const seriesLoading = useAppSelector((st) => st.chain.seriesLoading);
  return seriesLoading ? (
    <div>loading....</div>
  ) : (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {series && [...Object.values(series)].map((s: any) => <SeriesItem item={s} key={s.id} />)}
    </div>
  );
};

export default SeriesList;
