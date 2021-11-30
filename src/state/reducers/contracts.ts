import { IContractAction, IContractState } from '../../types/contracts';
import { ActionType } from '../actionTypes/contracts';

const INITIAL_STATE = {
  /* flags */
  eventsLoading: false,
  rolesLoading: false,

  /* Data */
  events: {},
  roles: {},
  roleNames: {},
  contractMap: null,
  eventArgsPropsMap: {},
};

export default function rootReducer(state: IContractState = INITIAL_STATE, action: IContractAction): IContractState {
  switch (action.type) {
    case ActionType.EVENTS_LOADING:
      return { ...state, eventsLoading: action.payload };
    case ActionType.UPDATE_EVENTS:
      return {
        ...state,
        events: action.payload,
      };
    case ActionType.UPDATE_CONTRACT_MAP:
      return {
        ...state,
        contractMap: action.payload,
      };
    case ActionType.UPDATE_EVENT_ARGS_PROPS_MAP:
      return {
        ...state,
        eventArgsPropsMap: action.payload,
      };
    case ActionType.ROLES_LOADING:
      return { ...state, rolesLoading: action.payload };
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
