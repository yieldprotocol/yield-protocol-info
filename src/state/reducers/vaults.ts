import { IVaultAction, IVaultState } from '../../types/vaults';
import { ActionType } from '../actionTypes/vaults';

const INITIAL_STATE = {
  /* flags */
  vaultsLoading: false,

  /* Data */
  vaults: {},
  prices: {},
  vaultsGot: false,
};

export default function rootReducer(state: IVaultState = INITIAL_STATE, action: IVaultAction): IVaultState {
  switch (action.type) {
    case ActionType.VAULTS_LOADING:
      return { ...state, vaultsLoading: action.payload };
    case ActionType.VAULTS_GOT:
      return { ...state, vaultsGot: action.payload };
    case ActionType.UPDATE_VAULTS:
      return {
        ...state,
        vaults: action.payload,
      };
    case ActionType.UPDATE_PRICES:
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.payload.quote]: {
            ...state.prices[action.payload.quote],
            [action.payload.base]: action.payload.price,
          },
        },
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
