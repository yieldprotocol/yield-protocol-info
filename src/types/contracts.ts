import { Contract } from 'ethers';

export interface IContractState {
  eventsLoading: boolean;
  rolesLoading: boolean;
  events: {};
  roles: {};
  contractMap: IContractMap;
  eventArgsPropsMap: IEventArgPropsMap;
}

export interface IContractMap {
  [name: string]: Contract;
}

export interface IEventArgPropsMap {
  [name: string]: IEventArgProps;
}

export interface IEventArgProps {
  [name: string]: IEventArg[];
}

interface IEventArg {
  name: string;
  type: string;
}
