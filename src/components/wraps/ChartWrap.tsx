import React from 'react';
import ChartHeader from '../ChartHeader';
import Chart from '../Chart';

const ChartWrap = ({ data, xLabel, yLabel }: any) => (
  <div className="bg-white dark:bg-gray-900">
    <ChartHeader />
    <Chart data={data} xLabel={xLabel} yLabel={yLabel} />
  </div>
);

export default ChartWrap;
