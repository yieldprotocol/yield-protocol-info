import { IAppAction, IAppState } from '../../types/application';
import { ActionType } from '../actionTypes/application';

const INITIAL_STATE = {
  theme: 'dark',
  chainId: 1,
};

export default function rootReducer(state: IAppState = INITIAL_STATE, action: IAppAction): IAppState {
  switch (action.type) {
    case ActionType.THEME:
      return { ...state, theme: action.payload };
    case ActionType.CHAIN_ID:
      return { ...state, chainId: action.payload };
    default:
      return state;
  }
}
