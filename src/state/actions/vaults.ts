import { gql } from '@apollo/client';
import { Dispatch } from 'redux';
import { format, fromUnixTime } from 'date-fns';
import { Contract, ethers, EventFilter, utils } from 'ethers';
import client from '../../config/apolloClient';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { CAULDRON, WAD_BN, WITCH } from '../../utils/constants';
import { decimal18ToDecimalN, decimalNToDecimal18, calculateCollateralizationRatio } from '../../utils/yieldMath';
import { IContractMap } from '../../types/contracts';
import { IAssetMap, IAssetPairData, IAssetPairMap } from '../../types/chain';
import {
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
import * as contracts from '../../contracts';
import { USDC, WETH, yvUSDC } from '../../config/assets';

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

export function getMainnetVaults(vaultId?: string | undefined): any {
  return async (dispatch: Dispatch<IVaultAction>, getState: any) => {
    const {
      chain: { chainId, assetPairData },
      contracts: { contractMap },
      vaults: { vaultsGot, prices, vaults: vaultsInState },
    } = getState();
    if (vaultsGot && !vaultId) return;
    try {
      dispatch(setVaultsLoading(true));

      let vaultsToUse;

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

      const Cauldron: Contract = contractMap[CAULDRON];
      const Witch: Contract = contractMap[WITCH];

      if (!Cauldron || !Witch) return;

      /* Add in the dynamic vault data by mapping the vaults list */
      const vaultListMod = await Promise.all(
        (vaultsToUse as IVaultGraph[]).map(async (vault) => {
          const { collateralAmount: ink, debtAmount: art, id, owner } = vault;
          const { assetId: baseId, decimals: baseDecimals } = vault.series.baseAsset;
          const { assetId: ilkId, decimals: ilkDecimals } = vault.collateral.asset;
          const seriesId = vault.series.id;

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

      const newVaultMap = (
        vaultId ? [...Object.values(vaultsInState as IVaultMap), ...vaultListMod] : vaultListMod
      ).reduce((acc: IVaultMap, item: IVault) => {
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

export function getNotMainnetVaults(): any {
  return async (dispatch: Dispatch<IVaultAction>, getState: any) => {
    const {
      chain: { chainId, series, assets },
      contracts: { contractMap },
      vaults: { vaultsGot, prices },
    } = getState();
    if (vaultsGot) return;
    try {
      dispatch(setVaultsLoading(true));
      const fromBlock = (chainId as number) === (42161 || 421611) ? -50000 : 1;
      const Cauldron: Contract = contractMap[CAULDRON];
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

export const compareOraclePrices = async (assetMap: IAssetMap | null) => {
  if (!assetMap) return;

  interface IPrice {
    blocksAgo: number;
    price: string;
    baseId: string;
    ilkId: string;
  }

  const mainnetProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_1);
  const arbProvider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL_42161);

  const mainnetOracleAddr = '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52';
  const arbOracleAddr = '0x30e042468e333Fde8E52Dd237673D7412045D2AC';

  const mainnetCauldronAddr = '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52';
  const arbCauldronAddr = '0x30e042468e333Fde8E52Dd237673D7412045D2AC';

  const mainnetOracle = contracts.ChainlinkMultiOracle__factory.connect(mainnetOracleAddr, mainnetProvider);
  const arbOracle = contracts.ChainlinkMultiOracle__factory.connect(arbOracleAddr, arbProvider);

  const getBlocksAgoPrices = async (
    oracle: contracts.ChainlinkMultiOracle | contracts.ChainlinkUSDOracle,
    ilkId: string,
    baseId: string,
    blocksAgo: number
  ) => {
    let price_: string;
    const prices: IPrice[] = [];

    for (let i = blocksAgo; i >= 0; i--) {
      // eslint-disable-next-line no-await-in-loop
      const [price] = await oracle.peek(
        bytesToBytes32(ilkId, 6),
        bytesToBytes32(baseId, 6),
        decimal18ToDecimalN(WAD_BN, assetMap[ilkId].decimals),
        { blockTag: -blocksAgo }
      );

      const _price = decimalNToDecimal18(price, assetMap[baseId].decimals);
      price_ = ethers.utils.formatUnits(_price, 18);
      prices.push({ blocksAgo: i, price: price_, baseId, ilkId });
    }

    return prices;
  };

  const usdcWethMainnetPrices = await getBlocksAgoPrices(mainnetOracle, WETH, USDC, 50);
  const usdcWethArbPrices = await getBlocksAgoPrices(arbOracle, WETH, USDC, 50);

  interface IPriceCompare {
    blocksAgo: number | undefined;
    mainnetBlock: number;
    arbBlock: number;
    baseSymbol: string;
    ilkSymbol: string;
    arbPrice: string | undefined;
    mainnetPrice: string | undefined;
    arbTimestamp: number;
    arbTime: Date;
    mainnetTimestamp: number;
    mainnetTime: Date;
  }

  const consolidated: IPriceCompare[] = await Promise.all(
    usdcWethMainnetPrices.map(async (x: IPrice) => {
      const correspondingBlock = usdcWethArbPrices.find((y: IPrice) => y.blocksAgo === x.blocksAgo);
      const { timestamp: arbTimestamp, number: arbBlock } = await arbProvider.getBlock(-correspondingBlock?.blocksAgo!);
      const { timestamp: mainnetTimestamp, number: mainnetBlock } = await mainnetProvider.getBlock(
        -correspondingBlock?.blocksAgo!
      );
      const arbTime = fromUnixTime(arbTimestamp);
      const mainnetTime = fromUnixTime(mainnetTimestamp);
      const mainnetPrice = x.price;
      const arbPrice = correspondingBlock?.price;

      return {
        blocksAgo: correspondingBlock?.blocksAgo,
        mainnetBlock,
        arbBlock,
        baseSymbol: assetMap[x.baseId].symbol,
        ilkSymbol: assetMap[x.ilkId].symbol,
        arbPrice,
        mainnetPrice,
        arbTimestamp,
        arbTime,
        mainnetTimestamp,
        mainnetTime,
      };
    })
  );
  console.log('🦄 ~ compareOraclePrices', consolidated);
};
