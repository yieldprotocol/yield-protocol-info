import { ActionType } from '../actionTypes/contracts';

const INITIAL_STATE = {
  /* flags */
  eventsLoading: false,

  /* Data */
  events: {},
  roles: {},
  roleNames: {},
  contractMap: {},
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.EVENTS_LOADING:
      return { ...state, eventsLoading: action.eventsLoading };
    case ActionType.UPDATE_EVENTS:
      return {
        ...state,
        ...action.payload,
      };
    case ActionType.UPDATE_CONTRACT_MAP:
      return {
        ...state,
        contractMap: action.contractMap,
      };
    case ActionType.UPDATE_ROLENAMES:
      return {
        ...state,
        roleNames: action.roleNames,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
