import { ActionType } from '../actionTypes/application';
import { IAppToggleDarkModeAction, IAppVersionAction } from '../../types/application';

export const toggleDarkMode = (darkMode: boolean): IAppToggleDarkModeAction => ({
  type: ActionType.TOGGLE_DARK_MODE,
  payload: darkMode,
});
export const updateVersion = (version: string): IAppVersionAction => ({ type: ActionType.VERSION, payload: version });
