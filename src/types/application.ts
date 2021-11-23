import { ActionType } from '../state/actionTypes/application';

export interface IAppState {
  darkMode: boolean;
  version: string | undefined;
}

export type IAppAction = IAppToggleDarkModeAction | IAppVersionAction | IAppResetAction;

interface IAppToggleDarkModeAction {
  type: ActionType.TOGGLE_DARK_MODE;
  payload: boolean;
}

interface IAppVersionAction {
  type: ActionType.VERSION;
  payload: string;
}

interface IAppResetAction {
  type: ActionType.RESET;
}
