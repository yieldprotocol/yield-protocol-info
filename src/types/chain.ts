import { BigNumber } from 'ethers';

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
  [id: string]: IAssetPairData;
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
  poolSymbol: string; // for signing
  totalSupply: BigNumber;
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
  decimals: string;
  poolAddress: string;
  currInvariant: string;
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
