import { IAppAction, IAppState } from '../../types/application';
import { ActionType } from '../actionTypes/application';

const INITIAL_STATE = {
  darkMode: false,
  version: process.env.REACT_APP_VERSION,
};

export default function rootReducer(state: IAppState = INITIAL_STATE, action: IAppAction): IAppState {
  switch (action.type) {
    case ActionType.TOGGLE_DARK_MODE:
      return { ...state, darkMode: action.payload };
    case ActionType.VERSION:
      return { ...state, version: action.payload };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
