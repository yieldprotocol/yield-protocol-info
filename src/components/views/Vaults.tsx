import React, { useCallback, useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useHistory } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppSelector } from '../../state/hooks/general';
import { abbreviateHash, cleanValue } from '../../utils/appUtils';
import { markMap } from '../../config/marks';
import MainViewWrap from '../wraps/MainViewWrap';
import { useVaults } from '../../state/hooks/useVaults';
import Button from '../Button';

const Vaults = () => {
  useVaults();
  const history = useHistory();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.vaults.vaultsLoading);
  const assets = useAppSelector((st) => st.chain.assets);

  const [allVaults, setAllVaults] = useState<any[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<any[]>([]);
  const [unhealthyFilter, setUnhealthyFilter] = useState<boolean>(false);
  const [numUnhealthy, setNumUnhealthy] = useState<string | null>(null);

  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  const handleFilter = useCallback(
    (_vaults: any) => {
      const _filteredVaults: any[] = _vaults.filter((v: any) => unhealthyFilter && Number(v.collatRatioPct) <= 180);
      setFilteredVaults(_filteredVaults);
      setNumUnhealthy(_filteredVaults.length.toString());
    },
    [unhealthyFilter]
  );

  useEffect(() => {
    const _allVaults: any = [...Object.values(vaults)]
      // filter out vaults that have same base and ilk (borrow and pool liquidity positions)
      .filter((v: any) => v.baseId !== v.ilkId)
      // filter empty
      .filter((v: any) => Number(v.art_) !== 0 && Number(v.ink_) !== 0)
      // sorting by debt balance
      .sort((vA: any, vB: any) => (Number(vA.art_) < Number(vB.art_) ? 1 : -1))
      // sorting to prioritize active vaults
      // eslint-disable-next-line no-nested-ternary
      .sort((vA: any, vB: any) => (vA.isActive === vB.isActive ? 0 : vA.isActive ? -1 : 1));

    setAllVaults(_allVaults);
  }, [vaults, handleFilter, unhealthyFilter]);

  useEffect(() => {
    if (unhealthyFilter) {
      handleFilter(allVaults);
    }
  }, [unhealthyFilter, allVaults, handleFilter]);

  if (!vaultsLoading && !Object.values(vaults).length) return <MainViewWrap>No Vaults</MainViewWrap>;

  return (
    <MainViewWrap>
      {vaultsLoading ? (
        <ClipLoader loading={vaultsLoading} />
      ) : (
        <div>
          {numUnhealthy && unhealthyFilter && (
            <div className="text-md text-center align-middle">{numUnhealthy} Unhealthy Vaults</div>
          )}
          <div className="mb-4 mr-4 w-44">
            <Button
              label={unhealthyFilter ? 'Show All' : 'Show Unhealthy'}
              action={() => setUnhealthyFilter(!unhealthyFilter)}
            />
          </div>
          <div className="rounded-md shadow-sm bg-green-50">
            <table className="table min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {[
                    'Id',
                    'Collateralization Ratio',
                    'Debt Asset',
                    'Debt Amount',
                    'Collateral Asset',
                    'Collateral Amount',
                    'Price',
                    'Collateral Balance',
                  ].map((x) => (
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
                {(unhealthyFilter ? filteredVaults : allVaults).map((v: any) => {
                  const debtAsset = assets[v.baseId];
                  const collatAsset = assets[v.ilkId];
                  const debtAssetLogo = markMap?.get(debtAsset?.symbol!);
                  const collatAssetLogo = markMap?.get(collatAsset?.symbol!);
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
