import { Dispatch } from 'redux';
import { ethers, utils } from 'ethers';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import {
  CAULDRON,
  CHAINLINK_MULTI_ORACLE,
  CHAINLINK_USD_ORACLE,
  COMPOSITE_MULTI_ORACLE,
  ENS,
  stETH,
  WAD_BN,
  WITCH,
} from '../../utils/constants';
import { calculateCollateralizationRatio, decimal18ToDecimalN } from '../../utils/yieldMath';
import { IContractMap } from '../../types/contracts';
import {
  IPriceMap,
  IUpdatePricesAction,
  IUpdateVaultsAction,
  IVault,
  IVaultAction,
  IVaultMap,
  IVaultsLoadingAction,
  IVaultsResetAction,
} from '../../types/vaults';

export function getVaults(): any {
  return async (dispatch: Dispatch<IVaultAction>, getState: any) => {
    const {
      chain: { series, assets, chainId },
      contracts: { contractMap },
      vaults: { vaultsGot, prices },
    } = getState();

    if (vaultsGot) return;
    try {
      dispatch(setVaultsLoading(true));
      const fromBlock = 1;
      const Cauldron = contractMap[CAULDRON];
      const Witch = contractMap[WITCH];

      if (!Cauldron || !Witch) return;

      if (Object.keys(Cauldron.filters).length) {
        const vaultsBuiltFilter = Cauldron.filters.VaultBuilt(null, null);

        const vaultsBuilt = await Cauldron.queryFilter(vaultsBuiltFilter, fromBlock);
        const vaultEventList = await Promise.all(
          vaultsBuilt.map(async (x: any) => {
            const { vaultId: id, ilkId, seriesId, owner } = Cauldron.interface.parseLog(x).args;
            const _series = series[seriesId];
            return {
              id,
              seriesId,
              baseId: _series?.baseId!,
              ilkId,
              decimals: _series?.decimals!,
              owner,
            };
          })
        );

        /* Add in the dynamic vault data by mapping the vaults list */
        const vaultListMod = await Promise.all(
          vaultEventList.map(async (vault: any) => {
            /* update balance and series  ( series - because a vault can have been rolled to another series) */
            const [{ ink, art }, { ratio: minCollatRatio }, price] = await Promise.all([
              await Cauldron.balances(vault.id),
              await Cauldron.spotOracles(vault.baseId, vault.ilkId),
              await getPrice(vault.ilkId, vault.baseId, contractMap, 18, chainId, prices!),
            ]);

            const { owner, seriesId, ilkId, decimals } = vault;
            const base = assets[vault.baseId];
            const ilk = assets[ilkId];

            return {
              ...vault,
              owner,
              isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
              collatRatioPct: `${cleanValue(calculateCollateralizationRatio(ink, price!, art, true), 2)}`,
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
      dispatch(setVaultsGot(true));
    } catch (e) {
      dispatch(setVaultsLoading(false));
      console.log(e);
    }
  };
}

export async function getPrice(
  ilk: string,
  base: string,
  contractMap: IContractMap,
  decimals: number = 18,
  chainId: number,
  priceMap: IPriceMap
) {
  const compositeOracleAssets = [stETH, ENS];
  let Oracle;

  try {
    switch (chainId as number) {
      case 1:
      case 42:
        Oracle =
          compositeOracleAssets.includes(ilk) || compositeOracleAssets.includes(base)
            ? contractMap[COMPOSITE_MULTI_ORACLE]
            : contractMap[CHAINLINK_MULTI_ORACLE];
        break;
      case 421611:
        Oracle = contractMap[CHAINLINK_USD_ORACLE];
        break;
      default:
        break;
    }

    const [price] = await Oracle?.peek(
      bytesToBytes32(ilk, 6),
      bytesToBytes32(base, 6),
      decimal18ToDecimalN(WAD_BN, decimals)
    );
    return price;
  } catch (e) {
    return ethers.constants.Zero;
  }
}

export const updateVaults = (vaults: IVaultMap): IUpdateVaultsAction => ({
  type: ActionType.UPDATE_VAULTS,
  payload: vaults,
});
export const setVaultsLoading = (vaultsLoading: boolean): IVaultsLoadingAction => ({
  type: ActionType.VAULTS_LOADING,
  payload: vaultsLoading,
});
export const reset = (): IVaultsResetAction => ({ type: ActionType.RESET });
export const updatePrices = (quote: string, base: string, price: string): IUpdatePricesAction => ({
  type: ActionType.UPDATE_PRICES,
  payload: { quote, base, price },
});

export const setVaultsGot = (vaultsGot: boolean): any => ({
  type: ActionType.VAULTS_GOT,
  payload: vaultsGot,
});
