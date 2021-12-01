import { ActionType } from '../state/actionTypes/application';

export interface IAppState {
  darkMode: boolean;
  version: string | undefined;
}

export type IAppAction = IAppToggleDarkModeAction | IAppVersionAction | IAppResetAction;

export interface IAppToggleDarkModeAction {
  type: ActionType.TOGGLE_DARK_MODE;
  payload: boolean;
}

export interface IAppVersionAction {
  type: ActionType.VERSION;
  payload: string;
}

export interface IAppResetAction {
  type: ActionType.RESET;
}
