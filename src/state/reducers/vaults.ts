import { IVaultState } from '../../types/vaults';
import { ActionType } from '../actionTypes/vaults';

const INITIAL_STATE = {
  /* flags */
  vaultsLoading: false,

  /* Data */
  vaults: {},
  prices: {},
};

export default function rootReducer(state: IVaultState = INITIAL_STATE, action: any): IVaultState {
  switch (action.type) {
    case ActionType.VAULTS_LOADING:
      return { ...state, vaultsLoading: action.vaultsLoading };
    case ActionType.UPDATE_VAULTS:
      return {
        ...state,
        vaults: action.vaults,
      };
    case ActionType.UPDATE_PRICES:
      return {
        ...state,
        prices: action.prices,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
