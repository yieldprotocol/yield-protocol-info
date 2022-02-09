import React, { FC, useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../state/hooks/general';
import { formatValue } from '../../utils/appUtils';
import { markMap } from '../../config/marks';
import MainViewWrap from '../wraps/MainViewWrap';
import Button from '../Button';
import SearchInput from '../SearchInput';
import Spinner from '../Spinner';
import { IVault } from '../../types/vaults';
import { useVaults } from '../../state/hooks/useVaults';
import Select from '../Select';
import { getMainnetVaults } from '../../state/actions/vaults';

const Vaults: FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { vaults, vaultsLoading } = useAppSelector((st) => st.vaults);
  const { series, assets, chainId } = useAppSelector(({ chain }) => chain);

  useVaults();

  // filters
  const [seriesFilterChoices, setSeriesFilterChoices] = useState<string[][]>();
  const [ilkFilterChoices, setIlkFilterChoices] = useState<string[][]>();

  const [allVaults, setAllVaults] = useState<IVault[]>([]);
  const [filteredVaults, setFilteredVaults] = useState<IVault[]>([]);
  const [unhealthyFilter, setUnhealthyFilter] = useState<boolean>(false);
  const [numUnhealthy, setNumUnhealthy] = useState<string | null>(null);
  const [vaultSearch, setVaultSearch] = useState<string | undefined>(undefined);
  const [ilkFilter, setIlkFilter] = useState<string>('');
  const [seriesFilter, setSeriesFilter] = useState<string>('');

  const handleClick = (id: string) => {
    history.push(`/vaults/${id}`);
  };

  useEffect(() => {
    if (vaults && assets && series) {
      const seriesChoices = Array.from(new Set(Object.keys(vaults).map((key) => vaults[key].seriesId))).filter(
        (x) => x !== '0x000000000000'
      );
      setSeriesFilterChoices(seriesChoices.map((sc) => [sc, series[sc] ? series[sc].name : '']));

      const ilkChoices = Array.from(new Set(Object.keys(vaults).map((key) => vaults[key].ilkId)));
      setIlkFilterChoices(ilkChoices.map((ic) => [ic, assets[ic].name]));
    }
  }, [vaults, assets, series]);

  useEffect(() => {
    // only get vaults for mainnet
    if (chainId === 1) {
      dispatch(getMainnetVaults());
    }
  }, [dispatch, chainId]);

  // get a specific vault
  useEffect(() => {
    // only get vaults for mainnet
    if (chainId === 1 && vaultSearch) {
      dispatch(getMainnetVaults(vaultSearch));
    }
  }, [dispatch, chainId, vaultSearch]);

  const handleFilter = useCallback(
    (_vaults: IVault[]) => {
      const _filteredVaults = _vaults
        .filter((v) => (vaultSearch ? v.id === vaultSearch || v.owner === vaultSearch : true))
        .filter((v) =>
          unhealthyFilter ? Number(v.collatRatioPct) <= Number(v.minCollatRatioPct) - 10 && v.baseId !== v.ilkId : true
        )
        .filter((v) => (ilkFilter ? v.ilkId === ilkFilter : true))
        .filter((v) => (seriesFilter ? v.seriesId === seriesFilter : true));
      setFilteredVaults(_filteredVaults);
      setNumUnhealthy(_filteredVaults.length.toString());
    },
    [unhealthyFilter, vaultSearch, seriesFilter, ilkFilter]
  );

  useEffect(() => {
    if (vaults) {
      const _allVaults = Object.values(vaults)
        .filter((v) => Number(v.art) !== 0 && Number(v.ink) !== 0)
        // sorting by debt balance
        .sort((vA, vB) => (Number(vA.art) < Number(vB.art) ? 1 : -1));

      setAllVaults(_allVaults);
    }
  }, [vaults, handleFilter]);

  useEffect(() => {
    if (unhealthyFilter || vaultSearch || seriesFilter || ilkFilter) {
      handleFilter(allVaults);
    }
  }, [unhealthyFilter, ilkFilter, allVaults, handleFilter, seriesFilter, vaultSearch]);

  if (!vaultsLoading && (!vaults || ![...Object.values(vaults!)].length)) return <MainViewWrap>No Vaults</MainViewWrap>;

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
              value={vaultSearch || ''}
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
                {(ilkFilter || unhealthyFilter || seriesFilter || vaultSearch ? filteredVaults : allVaults).map((v) => {
                  const debtAsset = assets![v.baseId];
                  const collatAsset = assets![v.ilkId];
                  const debtAssetLogo = markMap.get(debtAsset.symbol);
                  const collatAssetLogo = markMap.get(collatAsset.symbol);
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
