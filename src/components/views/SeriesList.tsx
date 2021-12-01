import React, { FC, useEffect, useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import SeriesItem from '../SeriesItem';
import { useAppSelector } from '../../state/hooks/general';
import MainViewWrap from '../wraps/MainViewWrap';
import { ISeries } from '../../types/chain';

const SeriesList: FC = () => {
  const { series, seriesLoading } = useAppSelector((st) => st.chain);
  const [seriesList, setSeriesList] = useState<ISeries[]>([]);

  useEffect(() => {
    if (series) {
      setSeriesList(
        [...Object.values(series)]
          .sort((s1, s2) => (s1.name < s2.name ? -1 : 1))
          .sort((s1, s2) => s1.maturity - s2.maturity)
      );
    }
  }, [series]);

  if (!Object.values(series!).length) return <MainViewWrap>No Series</MainViewWrap>;

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
