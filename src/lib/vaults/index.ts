import { ethers } from 'ethers';
import { gql } from '@apollo/client';
import client from '../../config/apolloClient';
import { ORACLE_INFO } from '../../config/oracles';
import { IContractMap } from '../../types/contracts';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { CAULDRON, WAD_BN, WITCH } from '../../utils/constants';
import { calculateCollateralizationRatio, decimal18ToDecimalN, decimalNToDecimal18 } from '../../utils/yieldMath';
import { IVault, IVaultGraph, IVaultMap } from '../../types/vaults';
import { IAssetMap, IAssetPairData, ISeriesMap } from '../../types/chain';
import { VaultBuiltEvent } from '../../contracts/Cauldron';
import { USDC, WETH } from '../../config/assets';

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

const SINGLE_VAULT_QUERY = `
  query getVault($address: ID!) {
    vault(id: $address) {
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

export const getMainnetVaults = async (
  contractMap: IContractMap,
  assetPairData: IAssetPairData[] | undefined,
  chainId: number,
  vaultId?: string
) => {
  let vaultsToUse: IVaultGraph[];

  // if vault id is supplied, get only that vault's data
  if (vaultId) {
    const {
      data: { vault },
    } = await client.query({
      query: gql(SINGLE_VAULT_QUERY),
      variables: { address: vaultId },
    });
    vaultsToUse = [vault];
  } else {
    const {
      data: { vaults },
    } = await client.query({
      query: gql(TOP_VAULTS_QUERY),
    });
    vaultsToUse = vaults;
  }

  const Cauldron = contractMap[CAULDRON];
  const Witch = contractMap[WITCH];

  /* Add in the dynamic vault data by mapping the vaults list */
  const vaultListMod = await Promise.all(
    vaultsToUse.map(async (vault) => {
      const { collateralAmount: ink, debtAmount: art, id, owner } = vault;
      const { assetId: baseId, decimals: baseDecimals } = vault.series.baseAsset;
      const { assetId: ilkId, decimals: ilkDecimals } = vault.collateral.asset;
      const seriesId = vault.series.id;

      let minCollatRatioPct: string;
      const _price = await getPrice(ilkId, baseId, contractMap, ilkDecimals, chainId);
      const price = decimalNToDecimal18(_price, baseDecimals);

      try {
        if (assetPairData) {
          minCollatRatioPct = assetPairData.filter((a) => a.ilkAssetId === ilkId)[0].minCollatRatioPct;
        } else {
          const { ratio } = await Cauldron.spotOracles(baseId, ilkId);
          minCollatRatioPct = `${ethers.utils.formatUnits(ratio * 100, 6)}`;
        }
      } catch (e) {
        console.log('could not get min collat ratio pct');
        minCollatRatioPct = '0';
      }

      const collatRatioPct = `${cleanValue(calculateCollateralizationRatio(ink, price, art, true), 2)}`;

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

  return vaultListMod.reduce((acc: IVaultMap, item: IVault) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

export const getNotMainnetVaults = async (
  contractMap: IContractMap,
  assetPairData: IAssetPairData[],
  seriesMap: ISeriesMap,
  assetMap: IAssetMap,
  chainId: number,
  vaultId?: string
) => {
  const Cauldron = contractMap[CAULDRON];
  const Witch = contractMap[WITCH];

  const vaultsBuiltFilter = Cauldron.filters.VaultBuilt(null, null);
  const vaultsBuilt = await Cauldron.queryFilter(vaultsBuiltFilter, 0);

  const vaultEventList = await Promise.all(
    vaultsBuilt.map(async (x: VaultBuiltEvent) => {
      const { vaultId: id, ilkId, seriesId, owner } = x.args;
      const _series = seriesMap[seriesId];
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
    vaultEventList.map(async (vault) => {
      /* update balance and series  ( series - because a vault can have been rolled to another series) */
      try {
        const _ilk = assetMap[vault.ilkId];
        const [{ ink, art }, { ratio: minCollatRatio }, price] = await Promise.all([
          await Cauldron.balances(vault.id),
          await Cauldron.spotOracles(vault.baseId, vault.ilkId),
          await getPrice(vault.ilkId, vault.baseId, contractMap, _ilk.decimals, chainId),
        ]);

        const { owner, seriesId, ilkId, decimals } = vault;
        const base = assetMap[vault.baseId];
        const ilk = assetMap[ilkId];

        return {
          ...vault,
          owner,
          isWitchOwner: `${Witch.address === owner}`, // check if witch is the owner (in liquidation process)
          collatRatioPct: `${cleanValue(calculateCollateralizationRatio(ink, price!, art, true), 2)}`,
          minCollatRatioPct: `${ethers.utils.formatUnits(minCollatRatio * 100, 6)}`, // collat ratios always have 6 decimals
          ink: ilk ? cleanValue(ethers.utils.formatUnits(ink, ilk.decimals), ilk.digitFormat) : '',
          art: base ? cleanValue(ethers.utils.formatUnits(art, base.decimals), base.digitFormat) : '',
          decimals,
          seriesId,
        };
      } catch (error) {
        return {};
      }
    })
  );

  return vaultListMod.reduce((acc: IVaultMap, item: IVault) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

export const getPrice = async (
  ilkId: string,
  baseId: string,
  contractMap: IContractMap,
  ilkDecimals: number,
  chainId: number
) => {
  const oracleName = ORACLE_INFO.get(chainId)?.get(baseId)?.get(ilkId);
  const Oracle = contractMap[oracleName!];

  try {
    const [price] = await Oracle.peek(
      bytesToBytes32(ilkId, 6),
      bytesToBytes32(baseId, 6),
      decimal18ToDecimalN(WAD_BN, ilkDecimals)
    );
    return price;
  } catch (e) {
    return ethers.constants.Zero;
  }
};
