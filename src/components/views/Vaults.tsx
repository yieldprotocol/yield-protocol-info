import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppSelector } from '../../state/hooks/general';
import { cleanValue } from '../../utils/appUtils';

const Assets = () => {
  const history = useHistory();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.chain.vaultsLoading);
  const prices = useAppSelector((st) => st.vaults.prices);

  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  // console.log(prices);

  return vaultsLoading ? (
    <ClipLoader loading={vaultsLoading} />
  ) : (
    <div className="rounded-md shadow-sm bg-green-50">
      <table className="table min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Id
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Collateralization Ratio
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Debt (USD)
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Collateral (USD)
            </th>
          </tr>
        </thead>
        <tbody className="bg-green divide-y divide-gray-200">
          {[...Object.values(vaults)].map((v: any) => (
            <tr
              key={v.id}
              onClick={() => handleClick(v.id)}
              className="hover:bg-green-100 items-center  dark:border-green-700 cursor-pointer group dark:hover:bg-green-900 dark:hover:shadow-lg"
            >
              <td className="px-6 py-5 text-left">
                <div className="flex items-center">
                  <span className="text-sm uppercase font-small text-gray-900 dark:text-white truncate justify-items-start">
                    {v.id}
                  </span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <span className="text-sm leading-5 font-medium text-gray-900 dark:text-white truncate justify-items-start">
                  <span>{cleanValue(v.collatRatioPct, 1)}%</span>
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <span className="text-sm leading-5 font-medium text-gray-900 dark:text-white truncate justify-items-start">
                  <span>{v.art_}</span>
                </span>
              </td>
              <td className="px-6 py-5 text-right">
                <span className="text-sm leading-5 font-medium text-gray-900 dark:text-white truncate justify-items-start">
                  <span>{v.ink_}</span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Assets;
