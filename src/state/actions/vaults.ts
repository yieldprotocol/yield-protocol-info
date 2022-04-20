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
