import { BigNumber } from 'ethers';

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

  currentSeriesId: string;
  currentPoolAddr: string;
  nextSeriesId: string;

  currentSeries: ISeries | undefined;
  nextSeries: ISeries | undefined;
  active: boolean;

  strategyTotalSupply?: BigNumber;
  strategyTotalSupply_?: string;

  poolTotalSupply?: BigNumber;
  poolTotalSupply_?: string;

  strategyPoolBalance?: BigNumber;
  strategyPoolBalance_?: string;
  strategyPoolPercent?: string;

  accountBalance?: BigNumber;
  accountBalance_?: string;
  accountStrategyPercent?: string | undefined;

  accountPoolBalance?: BigNumber;
  accountPoolBalance_?: string;
  accountPoolPercent?: string | undefined;
}
