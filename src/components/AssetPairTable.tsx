import React from 'react';
import { v4 as uuid } from 'uuid';
import { markMap } from '../config/marks';

const AssetPairTable = ({ data, assets }: any) =>
  data ? (
    <div className="rounded-md shadow-sm px-8 py-4 bg-green-50">
      <table className="table min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            {['', 'Min Collat Ratio', 'Max Debt', 'Total Debt', 'Diff (Max - Total)'].map((x) => (
              <th
                key={x}
                scope="col"
                className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
              >
                {x}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-green divide-y divide-gray-200">
          {data.map((x: any) => {
            const baseAsset = assets[x.baseAssetId];
            const ilkAsset = assets[x.ilkAssetId];
            const baseAssetLogo = markMap?.get(baseAsset?.symbol!);
            const ilkAssetLogo = markMap?.get(ilkAsset?.symbol!);
            return (
              <tr key={uuid()} className="items-center group">
                <td className="px-2 py-2 text-center items-center">
                  <div className="flex relative">
                    <div className="h-7 w-7">
                      <div className="z-0">{baseAssetLogo}</div>
                    </div>
                    <div className="z-10 -ml-2">
                      <div className="h-7 w-7">{ilkAssetLogo}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-center items-center">
                  <span className="text-sm font-medium text-gray-900  truncate">
                    <span>{x.minCollatRatioPct}</span>
                  </span>
                </td>
                <td className="px-6 py-3 text-center items-center">
                  <span className="text-sm font-medium text-gray-900  truncate">
                    <span>{x.maxDebt_}</span>
                  </span>
                </td>
                <td className="px-6 py-3 text-center items-center">
                  <span className="text-sm font-medium text-gray-900  truncate">
                    <span>{x.totalDebt_}</span>
                  </span>
                </td>
                <td className="px-6 py-3 text-center items-center">
                  <span className="text-sm font-medium text-gray-900  truncate">
                    <span>{Number(x.maxDebt_) - Number(x.totalDebt_)}</span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ) : null;

export default AssetPairTable;
