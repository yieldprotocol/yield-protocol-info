import React, { FC } from 'react';
import { v4 as uuid } from 'uuid';
import { markMap } from '../config/marks';
import { useAppSelector } from '../state/hooks/general';
import { IAssetPairData } from '../types/chain';
import { formatValue } from '../utils/appUtils';
import SkeletonWrap from './wraps/SkeletonWrap';

const AssetPairTable: FC<{ data: IAssetPairData[]; loading: boolean }> = ({ data, loading }) => {
  const { assets } = useAppSelector((st) => st.chain);
  return (
    <div className="rounded-lg shadow-sm px-8 py-4 bg-green-100 dark:bg-green-300">
      {loading ? (
        <div className="inline-block">
          <SkeletonWrap height={30} width={500} count={5} />
        </div>
      ) : (
        <table className="table min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {['Debt/Collateral', 'Min Collat Ratio', 'Max Debt', 'Total Debt', 'Diff (Max - Total)'].map((x) => (
                <th key={x} scope="col" className="px-3 py-2 text-xs font-medium text-gray-500 uppercase text-center">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-green divide-y divide-gray-200">
            {data.map((x) => {
              const baseAsset = assets![x.baseAssetId];
              const ilkAsset = assets![x.ilkAssetId];
              const baseAssetLogo = markMap?.get(baseAsset?.symbol!);
              const ilkAssetLogo = markMap?.get(ilkAsset?.symbol!);
              return (
                <tr key={uuid()} className="items-center group">
                  <td className="px-2 py-2 text-center items-center">
                    <div className="flex justify-center">
                      <div className="h-7 w-7">
                        <div className="z-0">{baseAssetLogo}</div>
                      </div>
                      <div className="z-1 -ml-2">
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
                      <span>{formatValue(x.maxDebt_, baseAsset.digitFormat)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center items-center">
                    <span className="text-sm font-medium text-gray-900  truncate">
                      <span>{formatValue(x.totalDebt_, baseAsset.digitFormat)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center items-center">
                    <span className="text-sm font-medium text-gray-900  truncate">
                      <span>{formatValue(Number(x.maxDebt_) - Number(x.totalDebt_), baseAsset.digitFormat)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};
export default AssetPairTable;
