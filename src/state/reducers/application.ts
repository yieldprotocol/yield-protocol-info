import { IApplicationState } from '../../types/application';
import { ActionType } from '../actionTypes/application';

const INITIAL_STATE = {
  darkMode: false,
  version: process.env.REACT_APP_VERSION,
};

export default function rootReducer(state: IApplicationState = INITIAL_STATE, action: any): IApplicationState {
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
