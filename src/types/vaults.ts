import { ActionType } from '../state/actionTypes/vaults';

export interface IVaultState {
  vaultsLoading: boolean;
  vaults: IVaultMap;
  prices: IPriceMap;
}

export type IVaultAction = IVaultsLoadingAction | IUpdateVaultsAction | IUpdatePricesAction | IVaultsResetAction;

export interface IVaultsLoadingAction {
  type: ActionType.VAULTS_LOADING;
  payload: boolean;
}

export interface IUpdateVaultsAction {
  type: ActionType.UPDATE_VAULTS;
  payload: IVaultMap;
}

export interface IUpdatePricesAction {
  type: ActionType.UPDATE_PRICES;
  payload: { quote: string; base: string; price: string };
}

export interface IVaultsResetAction {
  type: ActionType.RESET;
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
  isActive: boolean;
}

export interface IPriceMap {
  [id: string]: IPrice;
}

export interface IPrice {
  [id: string]: string;
}
