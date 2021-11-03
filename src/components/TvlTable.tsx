import React from 'react';
import { v4 as uuid } from 'uuid';
import { markMap } from '../config/marks';
import { formatValue } from '../utils/appUtils';

const TvlTable = ({ data, assets }: { data: any[]; assets: any[] }) =>
  data ? (
    <div className="rounded-lg shadow-sm p-5 dark:bg-green-200 bg-green-200">
      <table className="table min-w-full divide-y">
        <tbody className="divide-y">
          {data.map((x: any) => {
            const asset = assets[x.id];
            const assetLogo = markMap?.get(asset?.symbol!);
            return (
              <tr key={uuid()} className="items-center group">
                <td className="px-8 py-3 text-start items-center flex gap-5">
                  <div className="flex relative">
                    <div className="h-6 w-6">
                      <div className="z-0">{assetLogo}</div>
                    </div>
                  </div>
                  <span className="text-md font-medium text-gray-900  truncate">
                    <span>${formatValue(x.value, 0)}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;

export default TvlTable;
