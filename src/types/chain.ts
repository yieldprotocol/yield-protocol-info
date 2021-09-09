import { ethers, BigNumber, BigNumberish } from 'ethers';
// import { FYToken, Pool, Strategy } from '../contracts';

export enum ActionType {
  APP_VERSION = 'chain/APP_VERSION',
  FALLBACK_PROVIDER = 'chain/FALLBACK_PROVIDER',
  PROVIDER = 'chain/PROVIDER',
  SIGNER = 'chain/SIGNER',
  CHAIN_LOADING = 'chain/CHAIN_LOADING',
  CHAIN_ID = 'chain/CHAIN_ID',
  WEB3_ACTIVE = 'chain/WEB3_ACTIVE',
  CONNECTORS = 'chain/CONNECTORS',
  CONNECTOR = 'chain/CONNECTOR',
  ACCOUNT = 'chain/ACCOUNT',
  CONTRACT_MAP = 'chain/CONTRACT_MAP',
  ADD_SERIES = 'chain/ADD_SERIES',
  ADD_ASSET = 'chain/ADD_ASSET',
}

export interface ISignable {
  name: string;
  version: string;
  address: string;
  symbol: string;
}

export interface ISeriesRoot extends ISignable {
  id: string;
  displayName: string;
  displayNameMobile: string;
  maturity: number;
  fullDate: Date;
  // fyTokenContract: FYToken;
  fyTokenAddress: string;
  // poolContract: Pool;
  poolAddress: string;
  poolName: string;
  poolVersion: string; // for signing
  poolSymbol: string; // for signing

  decimals: number;

  baseId: string;

  color: string;
  textColor: string;
  startColor: string;
  endColor: string;

  oppositeColor: string;
  oppStartColor: string;
  oppEndColor: string;

  seriesMark: React.ElementType;

  // baked in token fns
  getTimeTillMaturity: () => string;
  isMature: () => boolean;
  getBaseAddress: () => string; // antipattern, but required here because app simulatneoulsy gets assets and series
}

export interface IAssetRoot extends ISignable {
  // fixed/static:
  id: string;
  decimals: number;
  color: string;
  image: React.FC;
  displayName: string;
  displayNameMobile: string;
  joinAddress: string;
  digitFormat: number;

  // baseContract: ERC20Permit;

  // baked in token fns
  getBalance: (account: string) => Promise<BigNumber>;
  getAllowance: (account: string, spender: string) => Promise<BigNumber>;
  mintTest: () => Promise<VoidFunction>;
}

export interface IStrategyRoot extends ISignable {
  id: string;
  baseId: string;
  decimals: number;
  // strategyContract: Strategy;
}

export interface IPoolRoot extends ISignable {}

export interface ISeries extends ISeriesRoot {
  apr: string;
  baseReserves: BigNumber;
  fyTokenReserves: BigNumber;
  fyTokenRealReserves: BigNumber;
  totalSupply: BigNumber;
  totalSupply_: string;

  poolTokens?: BigNumber | undefined;
  poolTokens_?: string | undefined;
  fyTokenBalance?: BigNumber | undefined;
  fyTokenBalance_?: string | undefined;

  poolPercent?: string | undefined;

  seriesIsMature: boolean;
}

export interface IAsset extends IAssetRoot {
  isYieldBase: boolean;
  balance: BigNumber;
  balance_: string;
  hasLadleAuth: boolean;
  hasJoinAuth: boolean;
}

export interface IStrategy extends IStrategyRoot {
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

export interface IPool extends IPoolRoot {}
