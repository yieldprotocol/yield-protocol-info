import { ethers, utils } from 'ethers';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { ONE_WEI_BN } from '../../utils/constants';
import { calculateCollateralizationRatio } from '../../utils/yieldMath';

export function getVaults(priceMap: any, contractMap: any, series: any, assets: any) {
  return async function _getVaults(dispatch: any) {
    dispatch(setVaultsLoading(true));

    const fromBlock = 1;
    const Cauldron = (Object.values(contractMap).filter((x: any) => x.name === 'Cauldron')[0] as any).contract;
    const Witch = (Object.values(contractMap).filter((x: any) => x.name === 'Witch')[0] as any).contract;

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

      /* Add in the dynamic vault data by mapping the vaults list */
      const vaultListMod = await Promise.all(
        vaultList.map(async (vault: any) => {
          /* update balance and series  ( series - because a vault can have been rolled to another series) */
          const [{ ink, art }, { owner, seriesId, ilkId }, { min: minDebt, max: maxDebt }, price] = await Promise.all([
            await Cauldron.balances(vault.id),
            await Cauldron.vaults(vault.id),
            await Cauldron.debt(vault.baseId, vault.ilkId),
            await updatePrice(vault.ilkId, vault.baseId, priceMap, contractMap),
          ]);

          const base = assets[vault.baseId];
          const ilk = assets[ilkId];

          const collateralizationRatio = calculateCollateralizationRatio(ink, price, art, true);

          return {
            ...vault,
            owner,
            isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
            seriesId,
            ilkId,
            ink_: cleanValue(utils.formatUnits(ink, ilk.decimals), ilk.digitFormat), // for display purposes only
            art_: cleanValue(utils.formatUnits(art, base.decimals), base.digitFormat), // for display purposes only
            collatRatioPct: cleanValue(collateralizationRatio, 2),
          };
        })
      );

      const newVaultMap = vaultListMod.reduce((acc: any, item: any) => {
        acc[item.id] = item;
        return acc;
      }, {});

      dispatch(updateVaults(newVaultMap));
      dispatch(setVaultsLoading(false));
    }
  };
}

const updatePrice = async (ilk: string, base: string, priceMap: any, contractMap: any) => {
  try {
    const _ilkPriceMap = priceMap[ilk] || {};

    const Oracle = (Object.values(contractMap).filter((x: any) => x.name === 'ChainlinkMultiOracle')[0] as any)
      .contract;
    const [price] = await Oracle.peek(bytesToBytes32(ilk, 6), bytesToBytes32(base, 6), ONE_WEI_BN);

    _ilkPriceMap[base] = price;

    updatePrices(_ilkPriceMap);
    return price;
  } catch (e) {
    console.log(e);
    return ethers.constants.Zero;
  }
};

export const updateVaults = (vaults: any) => ({ type: ActionType.UPDATE_VAULTS, vaults });
export const setVaultsLoading = (vaultsLoading: boolean) => ({ type: ActionType.VAULTS_LOADING, vaultsLoading });
const updatePrices = (prices: any) => ({ type: ActionType.UPDATE_PRICES, prices });
