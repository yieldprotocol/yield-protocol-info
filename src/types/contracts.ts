import { Contract } from 'ethers';
import { ActionType } from '../state/actionTypes/contracts';

export interface IContractState {
  eventsLoading: boolean;
  rolesLoading: boolean;
  events: {};
  roles: {};
  contractMap: IContractMap;
  eventArgsPropsMap: IEventArgsPropsMap;
}

export type IContractAction =
  | IEventsLoadingAction
  | IUpdateEventsAction
  | IUpdateContractMapAction
  | IEventArgsPropsMapAction
  | IRolesLoadingAction
  | IUpdateRolesAction
  | IResetAction;

export interface IEventsLoadingAction {
  type: ActionType.EVENTS_LOADING;
  payload: boolean;
}

export interface IUpdateEventsAction {
  type: ActionType.UPDATE_EVENTS;
  payload: any;
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
  [name: string]: Contract;
}

export interface IEventArgsPropsMap {
  [name: string]: IEventArgsProps;
}

export interface IEventArgsProps {
  [name: string]: IEventArgs[];
}

interface IEventArgs {
  name: string;
  type: string;
}
