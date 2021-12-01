import { ActionType } from '../actionTypes/vaults';

const INITIAL_STATE = {
  /* flags */
  vaultsLoading: false,

  /* Data */
  vaults: {},
  prices: {},
  vaultsGot: false,
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.VAULTS_LOADING:
      return { ...state, vaultsLoading: action.payload };
    case ActionType.VAULTS_GOT:
      return { ...state, vaultsGot: action.payload };
    case ActionType.UPDATE_VAULTS:
      return {
        ...state,
        vaults: action.vaults,
      };
    case ActionType.UPDATE_PRICES:
      return {
        ...state,
        prices: {
          ...state.prices,
          [action.price.ilk]: { ...(state.prices as any)[action.price.ilk], [action.price.base]: action.price.price },
        },
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
