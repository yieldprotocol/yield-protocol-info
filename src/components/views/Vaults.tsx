import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppSelector } from '../../state/hooks/general';
import { abbreviateHash, cleanValue } from '../../utils/appUtils';
import { markMap } from '../../config/marks';
import MainViewWrap from '../wraps/MainViewWrap';
import ChartWrap from '../wraps/ChartWrap';

const Vaults = () => {
  const history = useHistory();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.chain.vaultsLoading);
  const assets = useAppSelector((st) => st.chain.assets);
  const [unhealthyVaults, setUnhealthyVaults] = useState([]);

  const unhealthVaultData = [
    {
      name: 'Page A',
      block: Date.now() - 6,
      total: 2400,
    },
    {
      name: 'Page B',
      block: Date.now() - 5,
      total: 2000,
    },
    {
      name: 'Page C',
      block: Date.now() - 4,
      total: 3000,
    },
    {
      name: 'Page D',
      block: Date.now() - 3,
      total: 3500,
    },
    {
      name: 'Page D',
      block: Date.now() - 2,
      total: 4300,
    },
    {
      name: 'Page D',
      block: Date.now() - 1,
      total: 4000,
    },
    {
      name: 'Page D',
      block: Date.now(),
      total: 5000,
    },
  ];

  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  return (
    <MainViewWrap>
      {vaultsLoading ? (
        <ClipLoader loading={vaultsLoading} />
      ) : (
        <div>
          <div>
            <ChartWrap data={unhealthVaultData} xLabel="block" yLabel="total" />
          </div>
          <div className="rounded-md shadow-sm bg-green-50">
            <table className="table min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Id
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Collateralization Ratio
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Debt Asset
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Debt Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Collateral Asset
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Collateral Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-center"
                  >
                    Collateral Balance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-green divide-y divide-gray-200">
                {[...Object.values(vaults)].map((v: any) => {
                  const debtAsset = assets[v.baseId];
                  const collatAsset = assets[v.ilkId];
                  const debtAssetLogo = markMap?.get(debtAsset.symbol);
                  const collatAssetLogo = markMap?.get(collatAsset.symbol);
                  return (
                    <tr
                      key={v.id}
                      onClick={() => handleClick(v.id)}
                      className="hover:bg-green-100 items-center  dark:border-green-700 cursor-pointer group dark:hover:bg-green-900 dark:hover:shadow-lg"
                    >
                      <td className="px-6 py-2 text-center">
                        <div className="flex items-center">
                          <span className="text-sm uppercase font-small text-gray-900 dark:text-white truncate">
                            {abbreviateHash(v.id)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{cleanValue(v.collatRatioPct, 1)}%</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {debtAssetLogo && <div className="h-6 w-6 mx-auto">{debtAssetLogo}</div>}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{v.art_}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {collatAssetLogo && <div className="h-6 w-6 mx-auto">{collatAssetLogo}</div>}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{v.ink_}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{cleanValue(v.price_, 2)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{cleanValue(v.inkToArtBal, 2)}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainViewWrap>
  );
};

export default Vaults;
