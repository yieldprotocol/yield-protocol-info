import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';

import { Dispatch } from 'redux';
import { BigNumber, Contract, ethers, utils } from 'ethers';
import client from '../../config/apolloClient';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { CAULDRON, WAD_BN, WITCH } from '../../utils/constants';
import { calculateCollateralizationRatio, decimal18ToDecimalN, decimalNToDecimal18 } from '../../utils/yieldMath';
import { IContractMap } from '../../types/contracts';
import { IAssetPairData } from '../../types/chain';
import {
  IPrice,
  IPriceMap,
  IUpdatePricesAction,
  IUpdateVaultsAction,
  IVault,
  IVaultAction,
  IVaultGraph,
  IVaultMap,
  IVaultsLoadingAction,
  IVaultsResetAction,
} from '../../types/vaults';
import { ORACLE_INFO } from '../../config/oracles';

const TOP_VAULTS_QUERY = `
  query vaults {
    vaults(orderBy: debtAmount, orderDirection: desc, first: 100) {
      id
      owner
      debtAmount
      collateralAmount
      collateral {
        asset {
          name
          symbol
          assetId
          decimals
        }
      }
      series {
        baseAsset {
          symbol
          assetId
          decimals
        }
        id
      }
    }
  }
`;

export function getVaults(): any {
  return async (dispatch: Dispatch<IVaultAction>, getState: any) => {
    const {
      chain: { chainId, assetPairData },
      contracts: { contractMap },
      vaults: { vaultsGot, prices },
    } = getState();
    if (vaultsGot) return;
    try {
      dispatch(setVaultsLoading(true));

      // the graph

      const {
        data: { vaults },
      } = await client.query({
        query: gql(TOP_VAULTS_QUERY),
      });

      const Cauldron: Contract = contractMap[CAULDRON];
      const Witch: Contract = contractMap[WITCH];

      if (!Cauldron || !Witch) return;

      /* Add in the dynamic vault data by mapping the vaults list */
      const vaultListMod = await Promise.all(
        (vaults as IVaultGraph[]).map(async (vault) => {
          const { collateralAmount: ink, debtAmount: art, id, owner } = vault;
          const { assetId: baseId, decimals: baseDecimals } = vault.series.baseAsset;
          const { assetId: ilkId, decimals: ilkDecimals } = vault.collateral.asset;
          const seriesId = vault.series.id;

          // const [{ ratio: minCollatRatio }, price] = await Promise.all([
          //   await Cauldron.spotOracles(baseId, ilkId),
          //   await getPrice(ilkId, baseId, contractMap, 18, chainId, prices!),
          // ]);

          let price: string;

          try {
            const _ilkPrices = prices[ilkId] || {};
            const _baseIlkPrice = _ilkPrices![baseId] || undefined;

            if (_baseIlkPrice) {
              price = _baseIlkPrice;
            } else {
              const _price = await getPrice(ilkId, baseId, contractMap, ilkDecimals, chainId, prices!);
              const price_ = decimalNToDecimal18(_price, baseDecimals);
              price = ethers.utils.formatUnits(price_, 18);
              dispatch(updatePrices(baseId, ilkId, price));
            }
          } catch (e) {
            console.log('could not get price within vault');
          }

          let minCollatRatioPct: string;

          try {
            if (assetPairData) {
              minCollatRatioPct = assetPairData[ilkId].filter((a: IAssetPairData) => a.baseAssetId === baseId)[0]
                .minCollatRatioPct!;
            } else {
              const { ratio } = await Cauldron.spotOracles(baseId, ilkId);
              minCollatRatioPct = `${ethers.utils.formatUnits(ratio * 100, 6)}`;
            }
          } catch (e) {
            console.log('could not get min collat ratio pct');
            minCollatRatioPct = '0';
          }

          const collatRatio = price! ? (((Number(ink) * Number(price)) / Number(art)) * 100).toString() : '0';
          const collatRatioPct: string = `${cleanValue(collatRatio, 2)}`;

          return {
            id,
            seriesId,
            baseId,
            ilkId,
            owner,
            isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
            collatRatioPct,
            minCollatRatioPct,
            ink,
            art,
            decimals: baseDecimals.toString(),
          };
        })
      );

      console.log('🦄 ~ file: vaults.ts ~ line 74 ~ return ~ vaultListMod', vaultListMod);

      const newVaultMap = vaultListMod.reduce((acc: IVaultMap, item: IVault) => {
        acc[item.id] = item;
        return acc;
      }, {});

      dispatch(updateVaults(newVaultMap));
      dispatch(setVaultsLoading(false));

      dispatch(setVaultsGot(true)); // make sure there is no filter
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
  const oracleName = ORACLE_INFO.get(chainId)?.get(base)?.get(ilk);
  const Oracle = contractMap[oracleName!];

  try {
    const [price] = await Oracle.peek(
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
