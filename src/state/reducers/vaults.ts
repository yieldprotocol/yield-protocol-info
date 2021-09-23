import { ActionType } from '../actionTypes/vaults';

const INITIAL_STATE = {
  /* flags */
  vaultsLoading: false,

  /* Data */
  vaults: {},
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.VAULTS_LOADING:
      return { ...state, vaultsLoading: action.vaultsLoading };
    case ActionType.UPDATE_VAULTS:
      return {
        ...state,
        vaults: action.vaults,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
