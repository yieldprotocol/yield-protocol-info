import { ethers } from 'ethers';
import { ActionType } from '../state/actionTypes/chain';

export interface IChainState {
  provider: ethers.providers.JsonRpcProvider | null;
  chainId: number;
  chainLoading: boolean;
  seriesLoading: boolean;
  strategiesLoading: boolean;
  assetsLoading: boolean;
  tvlLoading: boolean;
  assetPairDataLoading: boolean;
  series: ISeriesMap | null;
  strategies: IStrategyMap | null;
  assets: IAssetMap | null;
  assetsTvl: IAssetsTvl[];
  assetPairData: IAssetPairMap | null;
}

export type IChainAction =
  | IChainProviderAction
  | IChainChainIdAction
  | IChainChainLoadingAction
  | IChainSeriesLoadingAction
  | IChainStrategiesLoadingAction
  | IChainAssetsLoadingAction
  | IChainAssetPairDataLoadingAction
  | IChainUpdateSeriesAction
  | IChainUpdateStrategiesAction
  | IChainUpdateAssetsAction
  | IChainUpdateAssetPairMapAction
  | IChainUpdateAssetsTVLAction
  | IChainTvlLoadingAction
  | IChainResetAction;

export interface IChainProviderAction {
  type: ActionType.PROVIDER;
  payload: ethers.providers.JsonRpcProvider;
}

export interface IChainChainIdAction {
  type: ActionType.CHAIN_ID;
  payload: number;
}

export interface IChainChainLoadingAction {
  type: ActionType.CHAIN_LOADING;
  payload: boolean;
}

export interface IChainSeriesLoadingAction {
  type: ActionType.SERIES_LOADING;
  payload: boolean;
}

export interface IChainStrategiesLoadingAction {
  type: ActionType.STRATEGIES_LOADING;
  payload: boolean;
}

export interface IChainAssetsLoadingAction {
  type: ActionType.ASSETS_LOADING;
  payload: boolean;
}

export interface IChainAssetPairDataLoadingAction {
  type: ActionType.ASSET_PAIR_DATA_LOADING;
  payload: boolean;
}

export interface IChainUpdateSeriesAction {
  type: ActionType.UPDATE_SERIES;
  payload: ISeriesMap;
}

export interface IChainUpdateStrategiesAction {
  type: ActionType.UPDATE_STRATEGIES;
  payload: IStrategyMap;
}

export interface IChainUpdateAssetsAction {
  type: ActionType.UPDATE_ASSETS;
  payload: IAssetMap;
}

export interface IChainUpdateAssetPairMapAction {
  type: ActionType.UPDATE_ASSET_PAIR_DATA;
  payload: { assetId: string; assetPairData: IAssetPairData[] };
}

export interface IChainUpdateAssetsTVLAction {
  type: ActionType.UPDATE_ASSETS_TVL;
  payload: IAssetsTvl[];
}

export interface IChainTvlLoadingAction {
  type: ActionType.TVL_LOADING;
  payload: boolean;
}

export interface IChainResetAction {
  type: ActionType.RESET;
}

export interface ISeriesMap {
  [id: string]: ISeries;
}

export interface IAssetMap {
  [id: string]: IAsset;
}

export interface IStrategyMap {
  [id: string]: IStrategy;
}

export interface IAssetPairMap {
  [id: string]: IAssetPairData[];
}

export interface IAssetsTvl {
  id: string;
  symbol: string;
  value: string;
}

export interface ISeries {
  id: string;
  baseId: string;
  maturity: number;
  name: string;
  symbol: string;
  version: string;
  address: string;
  fyTokenAddress: string;
  decimals: number;
  poolAddress: string;
  poolVersion: string;
  poolName: string;
  poolSymbol: string;
  totalSupply: string;
  fullDate: Date;
  displayName: string;
  season: string;

  startColor: string;
  endColor: string;
  color: string;
  textColor: string;
  oppStartColor: string;
  oppEndColor: string;
  oppTextColor: string;
}

export interface IAsset {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  version: string;
  joinAddress: string;
  digitFormat: number;
}

export interface IStrategy {
  id: string;
  address: string;
  symbol: string;
  name: string;
  version: string;
  baseId: string;
  decimals: number;
  poolAddress: string;
  currInvariant?: string;
}

export interface IAssetPairData {
  baseAssetId: string;
  ilkAssetId: string;
  minCollatRatioPct: string;
  minDebt: string;
  maxDebt: string;
  minDebt_: string;
  maxDebt_: string;
  totalDebt_: string;
  totalDebtInUSDC: string;
}
