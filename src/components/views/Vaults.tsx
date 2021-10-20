import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { useAppSelector } from '../../state/hooks/general';
import { cleanValue } from '../../utils/appUtils';
import { markMap } from '../../config/marks';
import MainViewWrap from '../wraps/MainViewWrap';
import Button from '../Button';
import SearchInput from '../SearchInput';

const Vaults = () => {
  const history = useHistory();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.vaults.vaultsLoading);
  const assets = useAppSelector((st) => st.chain.assets);

  const [allVaults, setAllVaults] = useState<any[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<any[]>([]);
  const [unhealthyFilter, setUnhealthyFilter] = useState<boolean>(false);
  const [numUnhealthy, setNumUnhealthy] = useState<string | null>(null);
  const [vaultSearch, setVaultSearch] = useState<string>('');

  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  const handleFilter = useCallback(
    (_vaults: any) => {
      const _filteredVaults: any[] = _vaults
        .filter((v: any) => (vaultSearch !== '' ? v.id === vaultSearch || v.owner === vaultSearch : true))
        .filter((v: any) => (unhealthyFilter ? Number(v.collatRatioPct) <= 180 : true));
      setFilteredVaults(_filteredVaults);
      setNumUnhealthy(_filteredVaults.length.toString());
    },
    [unhealthyFilter, vaultSearch]
  );

  useEffect(() => {
    const _allVaults: any = [...Object.values(vaults)]
      // filter out vaults that have same base and ilk (borrow and pool liquidity positions)
      .filter((v: any) => v.baseId !== v.ilkId)
      // filter empty
      .filter((v: any) => Number(v.art) !== 0 && Number(v.ink) !== 0)
      // sorting by debt balance
      .sort((vA: any, vB: any) => (Number(vA.art) < Number(vB.art) ? 1 : -1))
      // sorting to prioritize active vaults
      // eslint-disable-next-line no-nested-ternary
      .sort((vA: any, vB: any) => (vA.isActive === vB.isActive ? 0 : vA.isActive ? -1 : 1));

    setAllVaults(_allVaults);
  }, [vaults, handleFilter]);

  useEffect(() => {
    if (unhealthyFilter || vaultSearch) {
      handleFilter(allVaults);
    }
  }, [unhealthyFilter, allVaults, handleFilter, vaultSearch]);

  if (!vaultsLoading && !Object.values(vaults).length) return <MainViewWrap>No Vaults</MainViewWrap>;

  return (
    <MainViewWrap>
      {vaultsLoading ? (
        <ClipLoader loading={vaultsLoading} />
      ) : (
        <div>
          <div className="mb-4 w-1/3">
            <SearchInput
              name="search"
              value={vaultSearch}
              action={(e: any) => setVaultSearch(e.target.value)}
              placeHolder="Vault Id or Owner"
            />
          </div>
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
                {(unhealthyFilter || vaultSearch ? filteredVaults : allVaults).map((v: any) => {
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
                            {v.id}
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
                          <span>{v.art}</span>
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {collatAssetLogo && <div className="h-6 w-6 mx-auto">{collatAssetLogo}</div>}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center items-center">
                        <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          <span>{v.ink}</span>
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
