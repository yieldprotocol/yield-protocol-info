import { ethers, utils } from 'ethers';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import {
  CAULDRON,
  CHAINLINK_MULTI_ORACLE,
  CHAINLINK_USD_ORACLE,
  COMPOSITE_MULTI_ORACLE,
  WAD_BN,
  WITCH,
} from '../../utils/constants';
import { calculateCollateralizationRatio, decimal18ToDecimalN } from '../../utils/yieldMath';
import { IContractMap } from '../../types/contracts';
import { IPriceMap, IVault, IVaultMap } from '../../types/vaults';

export function getVaults(contractMap: IContractMap, series: any, assets: any, chainId: number, priceMap: IPriceMap) {
  return async function _getVaults(dispatch: any) {
    try {
      dispatch(setVaultsLoading(true));

      const fromBlock = 1;
      const Cauldron = contractMap[CAULDRON];
      const Witch = contractMap[WITCH];

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
            const [{ ink, art }, { owner, seriesId, ilkId }, { dec: decimals }, { ratio: minCollatRatio }, price] =
              await Promise.all([
                await Cauldron.balances(vault.id),
                await Cauldron.vaults(vault.id),
                await Cauldron.debt(vault.baseId, vault.ilkId),
                await Cauldron.spotOracles(vault.baseId, vault.ilkId),
                await getPrice(vault.ilkId, vault.baseId, contractMap, await Cauldron.decimals, chainId, priceMap),
              ]);

            const base = assets[vault.baseId];
            const ilk = assets[ilkId];

            return {
              ...vault,
              owner,
              isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
              collatRatioPct: `${cleanValue(calculateCollateralizationRatio(ink, price, art, true), 2)}`,
              minCollatRatioPct: `${utils.formatUnits(minCollatRatio * 100, 6)}`, // collat ratios always have 6 decimals
              ink: ilk ? cleanValue(utils.formatUnits(ink, ilk.decimals), ilk.digitFormat) : '',
              art: base ? cleanValue(utils.formatUnits(art, base.decimals), base.digitFormat) : '',
              decimals,
              seriesId,
            };
          })
        );

        const newVaultMap = vaultListMod.reduce((acc: IVaultMap, item: IVault) => {
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

export async function getPrice(
  ilk: string,
  base: string,
  contractMap: any,
  decimals: number = 18,
  chainId: number,
  priceMap: IPriceMap
) {
  // check if the price map already has the price
  console.log('price map', priceMap);
  if (priceMap[ilk][base]) return priceMap[ilk][base];
  let Oracle;
  try {
    switch (chainId as number) {
      case 1:
        Oracle =
          base === '0x303400000000' || ilk === '0x303400000000' || base === '0x303700000000' || ilk === '0x303700000000'
            ? contractMap[COMPOSITE_MULTI_ORACLE]
            : contractMap[CHAINLINK_MULTI_ORACLE];
        break;
      case 42:
        Oracle =
          base === '0x303400000000' || ilk === '0x303400000000' || base === '0x303700000000' || ilk === '0x303700000000'
            ? contractMap[COMPOSITE_MULTI_ORACLE]
            : contractMap[CHAINLINK_MULTI_ORACLE];
        break;
      case 421611:
        Oracle = contractMap[CHAINLINK_USD_ORACLE];
        break;
      default:
        break;
    }

    const [price] = await Oracle.peek(
      bytesToBytes32(ilk, 6),
      bytesToBytes32(base, 6),
      decimal18ToDecimalN(WAD_BN, decimals)
    );

    // update price map
    const newPriceMap = priceMap;
    newPriceMap[ilk][base] = price;
    updatePrices(newPriceMap);

    return price;
  } catch (e) {
    console.log(e);
    return ethers.constants.Zero;
  }
}

export const updateVaults = (vaults: any) => ({ type: ActionType.UPDATE_VAULTS, vaults });
export const setVaultsLoading = (vaultsLoading: boolean) => ({ type: ActionType.VAULTS_LOADING, vaultsLoading });
export const reset = () => ({ type: ActionType.RESET });
export const updatePrices = (prices: IPriceMap) => ({ type: ActionType.UPDATE_PRICES, prices });
