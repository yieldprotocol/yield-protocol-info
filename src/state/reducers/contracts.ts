import { ActionType } from '../actionTypes/contracts';

const INITIAL_STATE = {
  /* flags */
  eventsLoading: false,
  rolesLoading: false,

  /* Data */
  events: {},
  roles: {},
  contractMap: {},
};

export default function rootReducer(state = INITIAL_STATE, action: any) {
  switch (action.type) {
    case ActionType.EVENTS_LOADING:
      return { ...state, eventsLoading: action.eventsLoading };
    case ActionType.UPDATE_EVENTS:
      return {
        ...state,
        events: action.events,
      };
    case ActionType.UPDATE_CONTRACT_MAP:
      return {
        ...state,
        contractMap: action.contractMap,
      };
      case ActionType.ROLES_LOADING:
        return { ...state, rolesLoading: action.rolesLoading };
    case ActionType.UPDATE_ROLES:
      return {
        ...state,
        ...action.payload,
      };
    case ActionType.RESET:
      return INITIAL_STATE;
    default:
      return state;
  }
}
