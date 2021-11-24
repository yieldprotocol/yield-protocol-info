import { ActionType } from '../actionTypes/application';

export const toggleDarkMode = (darkMode: boolean) => ({ type: ActionType.TOGGLE_DARK_MODE, darkMode });
export const updateVersion = (version: string) => ({ type: ActionType.VERSION, version });
