import React from 'react';
import { v4 as uuid } from 'uuid';
import { markMap } from '../config/marks';
import { useAppSelector } from '../state/hooks/general';
import { formatValue } from '../utils/appUtils';
import SkeletonWrap from './wraps/SkeletonWrap';

const TvlTable = ({ data, assets }: { data: any[]; assets: any[] }) => {
  const tvlLoading = useAppSelector((st) => st.chain.tvlLoading);
  return data ? (
    <div className="rounded-lg shadow-sm p-2 dark:bg-green-200 bg-green-200 w-full">
      <table className="table min-w-full divide-y">
        <tbody className="divide-y">
          {data.map((x: any) => {
            const asset = assets[x.id];
            const assetLogo = markMap?.get(asset?.symbol!);
            return (
              <tr key={uuid()} className="items-center group">
                <td className="p-3 text-start items-center flex gap-4">
                  <div className="flex relative">
                    <div className="h-6 w-6">
                      {tvlLoading ? <SkeletonWrap /> : <div className="z-0">{assetLogo}</div>}
                    </div>
                  </div>
                  {x.value >= 0 && !tvlLoading ? (
                    <div className="text-md font-medium text-gray-900  truncate">
                      <div>${formatValue(x.value, 0)}</div>
                    </div>
                  ) : (
                    <SkeletonWrap />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;
};

export default TvlTable;
