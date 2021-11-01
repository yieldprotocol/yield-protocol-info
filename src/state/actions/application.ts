import { ActionType } from '../actionTypes/application';

export const toggleDarkMode = (darkMode: boolean) => ({ type: ActionType.TOGGLE_DARK_MODE, darkMode });
