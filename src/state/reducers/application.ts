import { ActionType } from '../actionTypes/application';

const INITIAL_STATE = {
  darkMode: false as boolean,
  version: process.env.REACT_APP_VERSION as string,
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.TOGGLE_DARK_MODE:
      return { ...state, darkMode: action.darkMode };
    case ActionType.VERSION:
      return { ...state, version: action.version };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
