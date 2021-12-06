import { EventFragment } from '@ethersproject/abi';
import { Contract, Event } from 'ethers';
import {
  IContractMap,
  IEventArgsPropsMap,
  IEventArgsPropsMapAction,
  IEventsMap,
  IResetAction,
  IUpdateContractMapAction,
} from '../../types/contracts';
import { ActionType } from '../actionTypes/contracts';

export function getEvents(contractMap: IContractMap, name: string, filter: any = '*'): any {
  return async function _getEvents(dispatch: any) {
    dispatch(setEventsLoading(true));
    const contract: Contract = contractMap[name];

    if (contract) {
      try {
        dispatch(setEventsLoading(true));
        const events = await contract.queryFilter(filter, undefined, undefined);

        const updatedEvents = events.map((e: Event, i: number) => ({
          id: i,
          event: e.event,
          blockNumber: e.blockNumber,
          args: e.args ? e.args.join(', ') : '',
        }));

        const eventsMap: IEventsMap = { [name]: updatedEvents };

        dispatch(updateEvents(eventsMap));
        dispatch(setEventsLoading(false));
      } catch (e) {
        dispatch(setEventsLoading(false));
        console.log('Error fetching events data: ', e);
      }
    }
  };
}

const getEventArgProps = (contract: Contract) =>
  Object.entries(contract.interface.events).reduce((acc: any, curr: any): any => {
    // example interface:
    // key: "RoleAdminChanged(bytes4,bytes4)"
    // value: {
    //    anonymous: false,
    //    inputs: [{ name: "assetId", type: "bytes6" }, {name: "address", type: "address"}],
    //    name: "AssetAdded",
    //    type: "event",
    //    _isFragment: true
    //  }
    //
    // final shape of the accumulator:
    //  {"RoleAdminChanged": [{name: "assetId", type: "bytes6"}, {name: "asset", type: "address"]}
    const [key, value] = curr;
    const eventName: string = key.split('(')[0];
    if (!(eventName in acc)) {
      acc[eventName] = (value as EventFragment).inputs.map(({ name, type }) => ({ name, type }));
    }
    return acc;
  }, {});

export function getEventArgs(contractMap: IContractMap, name: string): any {
  return async function _getEventArg(dispatch: any) {
    /* Update the Event argument properties */
    const newEventArgPropsMap: IEventArgsPropsMap = {};
    newEventArgPropsMap[name] = getEventArgProps(contractMap[name]);
    dispatch(updateEventArgPropsMap(newEventArgPropsMap));
  };
}

export const updateEventArgPropsMap = (eventArgPropsMap: IEventArgsPropsMap): IEventArgsPropsMapAction => ({
  type: ActionType.UPDATE_EVENT_ARGS_PROPS_MAP,
  payload: eventArgPropsMap,
});
export const updateEvents = (events: IEventsMap): any => ({ type: ActionType.UPDATE_EVENTS, payload: events });
export const setEventsLoading = (eventsLoading: boolean) => ({
  type: ActionType.EVENTS_LOADING,
  payload: eventsLoading,
});
export const updateContractMap = (contractMap: IContractMap): IUpdateContractMapAction => ({
  type: ActionType.UPDATE_CONTRACT_MAP,
  payload: contractMap,
});
export const reset = (): IResetAction => ({ type: ActionType.RESET });
export const setContractsLoading = (contractsLoading: boolean) => ({
  type: ActionType.CONTRACTS_LOADING,
  payload: contractsLoading,
});
