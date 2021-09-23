import { ActionType } from '../actionTypes/vaults';

export function getVaults(contractMap: any, series: any) {
  return async function _getVaults(dispatch: any) {
    dispatch(setVaultsLoading(true));

    const fromBlock = 1;
    const Cauldron = (Object.values(contractMap).filter((x: any) => x.name === 'Cauldron')[0] as any).contract;

    if (Object.keys(Cauldron.filters).length) {
      const vaultsBuiltFilter = Cauldron.filters.VaultBuilt(null, null);
      const vaultsReceivedfilter = Cauldron.filters.VaultGiven(null, null);

      const [vaultsBuilt, vaultsReceived] = await Promise.all([
        Cauldron.queryFilter(vaultsBuiltFilter, fromBlock),
        Cauldron.queryFilter(vaultsReceivedfilter, fromBlock),
      ]);

      const buildEventList = await Promise.all(
        vaultsBuilt.map(async (x: any) => {
          const { vaultId: id, ilkId, seriesId } = Cauldron.interface.parseLog(x).args;
          const _series = series[seriesId];
          return {
            id,
            seriesId,
            baseId: _series?.baseId!,
            ilkId,
            decimals: _series?.decimals!,
          };
        })
      );

      const recievedEventsList = await Promise.all(
        vaultsReceived.map(async (x: any) => {
          const { vaultId: id } = Cauldron.interface.parseLog(x).args;
          const { ilkId, seriesId } = await Cauldron.vaults(id);
          const _series = series[seriesId];
          return {
            id,
            seriesId,
            baseId: _series?.baseId!,
            ilkId,
            decimals: _series?.decimals!,
          };
        })
      );

      const vaultList = [...buildEventList, ...recievedEventsList];

      const newVaultMap = vaultList.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {});

      dispatch(updateVaults(newVaultMap));
      dispatch(setVaultsLoading(false));
    }
  };
}

export const updateVaults = (vaults: any) => ({ type: ActionType.UPDATE_VAULTS, vaults });
export const setVaultsLoading = (vaultsLoading: boolean) => ({ type: ActionType.VAULTS_LOADING, vaultsLoading });
