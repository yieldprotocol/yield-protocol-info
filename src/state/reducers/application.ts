import { ActionType } from '../actionTypes/application';

const INITIAL_STATE = {
  darkMode: false as boolean,
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.TOGGLE_DARK_MODE:
      return { ...state, darkMode: action.darkMode };
    default:
      return state;
  }
}
