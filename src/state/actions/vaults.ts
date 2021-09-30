import { ethers, utils } from 'ethers';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { ONE_WEI_BN } from '../../utils/constants';
import { calculateCollateralizationRatio } from '../../utils/yieldMath';

export function getVaults(priceMap: any, contractMap: any, series: any, assets: any) {
  return async function _getVaults(dispatch: any) {
    try {
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
            const [{ ink, art }, { owner, seriesId, ilkId }, { min: minDebt, max: maxDebt }, price] = await Promise.all(
              [
                await Cauldron.balances(vault.id),
                await Cauldron.vaults(vault.id),
                await Cauldron.debt(vault.baseId, vault.ilkId),
                await getPrice(vault.ilkId, vault.baseId, contractMap),
              ]
            );

            const base = assets[vault.baseId];
            const ilk = assets[ilkId];

            const collateralizationRatio = calculateCollateralizationRatio(ink, price, art, true);
            const price_ = cleanValue(utils.formatUnits(price, 18)); // TODO is this format unit correct
            const ink_ = cleanValue(utils.formatUnits(ink, ilk.decimals), ilk.digitFormat); // for display purposes only
            const art_ = cleanValue(utils.formatUnits(art, base.decimals), base.digitFormat); // for display purposes only
            const inkToArtBal = (Number(ink_) * Number(price_)).toString();

            return {
              ...vault,
              owner,
              isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
              seriesId,
              ilkId,
              ink_,
              art_,
              collatRatioPct: cleanValue(collateralizationRatio, 2),
              price_,
              inkToArtBal,
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
    } catch (e) {
      dispatch(updateVaults({}));
      dispatch(setVaultsLoading(false));
      console.log(e);
    }
  };
}

async function getPrice(ilk: string, base: string, contractMap: any) {
  try {
    const Oracle = (Object.values(contractMap).filter((x: any) => x.name === 'ChainlinkMultiOracle')[0] as any)
      .contract;
    const [price] = await Oracle.peek(bytesToBytes32(ilk, 6), bytesToBytes32(base, 6), ONE_WEI_BN);
    return price;
  } catch (e) {
    console.log(e);
    return ethers.constants.Zero;
  }
}

export const updateVaults = (vaults: any) => ({ type: ActionType.UPDATE_VAULTS, vaults });
export const setVaultsLoading = (vaultsLoading: boolean) => ({ type: ActionType.VAULTS_LOADING, vaultsLoading });
export const reset = () => ({ type: ActionType.RESET });

// const updatePrices = (price: any, ilk: string, base: string) => ({
//   type: ActionType.UPDATE_PRICES,
//   price: { price, ilk, base },
// });
