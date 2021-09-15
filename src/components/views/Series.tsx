import React from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';

const Series = () => {
  const { id } = useParams<{ id: string }>();
  const seriesMap = useAppSelector((st) => st.chain.series);
  const series = seriesMap[id];

  return series ? (
    <div className="rounded-md p-5 align-middle justify-items-start shadow-sm bg-green-50">
      <div className="text-sm">
        <strong>{series.symbol}</strong>
      </div>
      {Object.keys(series).map((key: any) => (
        <div className="text-sm" key={key}>
          {key}: <strong>{series[key]}</strong>
        </div>
      ))}
    </div>
  ) : null;
};

export default Series;
