import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppSelector } from '../../state/hooks/general';
import { formatValue } from '../../utils/appUtils';
import { markMap } from '../../config/marks';
import MainViewWrap from '../wraps/MainViewWrap';
import Button from '../Button';
import SearchInput from '../SearchInput';
import Spinner from '../Spinner';
import Select from '../../Select';

const Vaults = () => {
  const history = useHistory();
  const vaults = useAppSelector((st) => st.vaults.vaults);
  const vaultsLoading = useAppSelector((st) => st.vaults.vaultsLoading);
  const seriesMap = useAppSelector((st) => st.chain.series);
  const seriesChoices = Array.from(new Set(Object.keys(vaults).map((key: any) => vaults[key].seriesId))).filter(
    (x) => x !== '0x000000000000'
  );
  const seriesFilterChoices = seriesChoices.map((sc: any) => [sc, seriesMap[sc] ? seriesMap[sc].name : '']);
  const assets = useAppSelector((st) => st.chain.assets);
  const ilkChoices = Array.from(new Set(Object.keys(vaults).map((key: any) => vaults[key].ilkId)));
  const ilkFilterChoices = ilkChoices.map((ic: any) => [ic, assets[ic].name]);
  const [allVaults, setAllVaults] = useState<any[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<any[]>([]);
  const [unhealthyFilter, setUnhealthyFilter] = useState<boolean>(false);
  const [numUnhealthy, setNumUnhealthy] = useState<string | null>(null);
  const [vaultSearch, setVaultSearch] = useState<string>('');
  const [ilkFilter, setIlkFilter] = useState<string>('');
  const [seriesFilter, setSeriesFilter] = useState<string>('');
  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  const handleClearFilters = () => {
    setFilteredVaults(allVaults);
    setIlkFilter('');
    setSeriesFilter('');
  };

  const handleFilter = useCallback(
    (_vaults: any) => {
      const _filteredVaults: any[] = _vaults
        .filter((v: any) => (vaultSearch !== '' ? v.id === vaultSearch || v.owner === vaultSearch : true))
        .filter((v: any) => (unhealthyFilter ? Number(v.collatRatioPct) <= 180 : true))
        .filter((v: any) => (ilkFilter ? v.ilkId === ilkFilter : true))
        .filter((v: any) => (seriesFilter ? v.seriesId === seriesFilter : true));
      setFilteredVaults(_filteredVaults);
      setNumUnhealthy(_filteredVaults.length.toString());
    },
    [unhealthyFilter, vaultSearch, seriesFilter, ilkFilter]
  );

  useEffect(() => {
    const _allVaults: any = [...Object.values(vaults)]
      // filter out vaults that have same base and ilk (borrow and pool liquidity positions)
      // .filter((v: any) => v.baseId !== v.ilkId)
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
    if (unhealthyFilter || vaultSearch || seriesFilter || ilkFilter) {
      handleFilter(allVaults);
    }
  }, [unhealthyFilter, ilkFilter, allVaults, handleFilter, seriesFilter, vaultSearch]);

  if (!vaultsLoading && !Object.values(vaults).length) return <MainViewWrap>No Vaults</MainViewWrap>;

  return (
    <MainViewWrap>
      {vaultsLoading ? (
        <Spinner loading={vaultsLoading} />
      ) : (
        <div>
          <div className="mb-4 w-1/3">
            <Select
              onChange={(val: any) => setIlkFilter(val)}
              label="Collateral"
              options={ilkFilterChoices}
              value={null}
            />
            <Select
              onChange={(val: any) => setSeriesFilter(val)}
              label="Series"
              options={seriesFilterChoices}
              value={null}
            />
          </div>
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
              <div className="text-md text-center align-middle dark:text-white">{numUnhealthy} Unhealthy Vaults</div>
            )}
            <div className="mb-4 mr-4 w-44">
              <Button
                label={unhealthyFilter ? 'Show All' : 'Show Unhealthy'}
                action={() => setUnhealthyFilter(!unhealthyFilter)}
              />
            </div>
          </div>

          <div className="rounded-lg shadow-md bg-green-100 dark:bg-green-200">
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
                {(ilkFilter || unhealthyFilter || seriesFilter || vaultSearch ? filteredVaults : allVaults).map(
                  (v: any) => {
                    const debtAsset = assets[v.baseId];
                    const collatAsset = assets[v.ilkId];
                    const debtAssetLogo = markMap?.get(debtAsset?.symbol!);
                    const collatAssetLogo = markMap?.get(collatAsset?.symbol!);
                    return (
                      <tr
                        key={v.id}
                        onClick={() => handleClick(v.id)}
                        className="hover:bg-green-200 items-center  dark:border-green-700 cursor-pointer group dark:hover:bg-green-100 dark:hover:shadow-lg"
                      >
                        <td className="px-6 py-2 text-center">
                          <div className="flex items-center">
                            <span className="text-sm uppercase font-small text-gray-900 truncate">{v.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            <span>{formatValue(v.collatRatioPct, 1)}%</span>
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {debtAssetLogo && <div className="h-6 w-6 mx-auto">{debtAssetLogo}</div>}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            <span>{formatValue(v.art, debtAsset.digitFormat)}</span>
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {collatAssetLogo && <div className="h-6 w-6 mx-auto">{collatAssetLogo}</div>}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-center items-center">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            <span>{formatValue(v.ink, 2)}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </MainViewWrap>
  );
};

export default Vaults;
