import { Contract } from 'ethers';
import { ActionType } from '../state/actionTypes/contracts';

export interface IContractState {
  eventsLoading: boolean;
  rolesLoading: boolean;
  events: IEventsMap;
  roles: {};
  roleNames: any;
  contractMap: IContractMap | null;
  eventArgsPropsMap: IEventArgsPropsMap;
}

export type IContractAction =
  | IEventsLoadingAction
  | IUpdateEventsAction
  | IUpdateContractMapAction
  | IEventArgsPropsMapAction
  | IRolesLoadingAction
  | IUpdateRolesAction
  | IUpdateEventsAction
  | IResetAction;

export interface IEventsLoadingAction {
  type: ActionType.EVENTS_LOADING;
  payload: boolean;
}

export interface IUpdateEventsAction {
  type: ActionType.UPDATE_EVENTS;
  payload: IEventsMap;
}

export interface IUpdateContractMapAction {
  type: ActionType.UPDATE_CONTRACT_MAP;
  payload: IContractMap;
}

export interface IEventArgsPropsMapAction {
  type: ActionType.UPDATE_EVENT_ARGS_PROPS_MAP;
  payload: IEventArgsPropsMap;
}

export interface IRolesLoadingAction {
  type: ActionType.ROLES_LOADING;
  payload: boolean;
}

export interface IUpdateRolesAction {
  type: ActionType.UPDATE_ROLES;
  payload: any;
}

export interface IResetAction {
  type: ActionType.RESET;
}

export interface IContractMap {
  [id: string]: IContract;
}

export interface IContract {
  contract: Contract;
  name: string;
}
