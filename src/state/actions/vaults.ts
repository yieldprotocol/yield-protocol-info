import { gql } from '@apollo/client';
import { Dispatch } from 'redux';
import { Contract, ethers, EventFilter } from 'ethers';
import client from '../../config/apolloClient';
import { ActionType } from '../actionTypes/vaults';
import { bytesToBytes32, cleanValue } from '../../utils/appUtils';
import { CAULDRON, WAD_BN, WITCH } from '../../utils/constants';
import { decimal18ToDecimalN, decimalNToDecimal18 } from '../../utils/yieldMath';
import { IContractMap } from '../../types/contracts';
import { IAssetPairData } from '../../types/chain';
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
import * as contracts from '../../contracts'
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

      const {
        data: { vaults },
      } = await client.query({
        query: gql(TOP_VAULTS_QUERY),
      });

      const Cauldron: Contract = contractMap[CAULDRON];
      const Witch: Contract = contractMap[WITCH];

      const vaultId = '0x7fcaa8c036ca4ec15d3a9fd1';

      const _bytesToBytes32 = (x: string, n: number): string => x + '00'.repeat(32 - n);
      const _vaultId = _bytesToBytes32(vaultId, 12);
      console.log('🦄 ~ file: vaults.ts ~ line 75 ~ return ~ _vaultId', _vaultId);
      const witchFilter = Witch.filters.Auctioned(_vaultId, null);
      const events = await Witch.queryFilter(witchFilter);
      console.log('🦄 ~ file: vaults.ts ~ line 76 ~ return ~ events', events);

      if (!Cauldron || !Witch) return;

      /* Add in the dynamic vault data by mapping the vaults list */
      const vaultListMod = await Promise.all(
        (vaults as IVaultGraph[]).map(async (vault) => {
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

export const compareOraclePrices = () => {
  interface IPrice {
    blocksAgo: number;
    price: string;
    baseId: string;
    ilkId: string;
  }

  const mainnetProvider = new ethers.providers.JsonRpcProvider(
    'https://mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0day2a2'
  );
  const arbProvider = new ethers.providers.JsonRpcProvider(
    'https://arbitrum-mainnet.infura.io/v3/2af222f674024a0f84b5f0aad0da72a2'
  );
  const mainnetChainId = 1;
    const arbChainId = 42161;

    const mainnetOracleAddr = '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52';
    const arbOracleAddr = '0x30e042468e333Fde8E52Dd237673D7412045D2AC';

    const mainnetCauldronAddr = '0xcDCe5C87f691058B61f3A65913f1a3cBCbAd9F52';
    const arbCauldronAddr = '0x30e042468e333Fde8E52Dd237673D7412045D2AC';

    const mainnetOracle = contracts.ChainlinkMultiOracle__factory.connect(mainnetOracleAddr, mainnetProvider);
    const arbOracle = contracts.ChainlinkMultiOracle__factory.connect(arbOracleAddr, arbProvider);

    const getBlocksAgoPrices = async (
      oracle: contracts.ChainlinkMultiOracle | contracts.ChainlinkUSDOracle,
      baseId: string,
      ilkId: string,
      ilkDecimals: number,
      blocksAgo: number
    ) => {
      let price_: string;
      const prices: IPrice[] = [];

      for (let i = blocksAgo; i >= 0; i--) {
        const [price] = await oracle.peek(
          bytesToBytes32(ilkId, 6),
          bytesToBytes32(baseId, 6),
          decimal18ToDecimalN(WAD_BN, ilkDecimals),
          { blockTag: -blocksAgo }
        );
        price_ = ethers.utils.formatUnits(price, ilkDecimals);
        prices.push({ blocksAgo: i, price: price_, baseId, ilkId });
      }

      return prices;
    };

    const wethDecimals = 18;
    const usdcWethMainnetPrices = await getBlocksAgoPrices(mainnetOracle, USDC, WETH, wethDecimals, 10);
    console.log('🦄 ~ file: hardhat.config.ts ~ line 65 ~ usdcWethMainnetPrices', usdcWethMainnetPrices);
    const usdcWethArbPrices = await getBlocksAgoPrices(arbOracle, USDC, WETH, wethDecimals, 10);
  }
}