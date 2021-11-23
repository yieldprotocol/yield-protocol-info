import { BigNumber } from 'ethers';

export interface IVaultState {
  vaultsLoading: boolean;
  vaults: IVaultMap;
  prices: IPriceMap;
}

export interface IVaultMap {
  [id: string]: IVault;
}

export interface IVault {
  id: string;
  seriesId: string;
  baseId: string;
  ilkId: string;
  owner: string;
  isWitchOwner: boolean;
  collatRatioPct: string;
  minCollatRatioPct: string;
  ink: string;
  art: string;
  decimals: string;
}

export interface IPriceMap {
  [id: string]: IPrice;
}

export interface IPrice {
  [id: string]: BigNumber;
}
