import { ActionType } from '../state/actionTypes/application';

export interface IAppState {
  theme: string;
  chainId: number;
}

export type IAppAction = IAppThemeAction | IAppChainIdAction;

export interface IAppThemeAction {
  type: ActionType.THEME;
  payload: string;
}

export interface IAppChainIdAction {
  type: ActionType.CHAIN_ID;
  payload: number;
}
