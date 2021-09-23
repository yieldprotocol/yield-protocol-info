import { ActionType } from '../actionTypes/contracts';

export function getEvents(contractMap: any, contractAddr: any, filter = '*') {
  return async function _getEvents(dispatch: any) {
    dispatch(setEventsLoading(true));
    const contract = contractMap[contractAddr]?.contract!;

    if (contract) {
      try {
        dispatch(setEventsLoading(true));
        const events = await contract.queryFilter(filter, null, null);
        console.log(events);
        const updatedEvents = events.map((e: any, i: number) => ({
          id: i,
          event: e.event,
          blockNumber: e.blockNumber,
          args: e.args.join(', '),
        }));

        const eventsMap = { [contractAddr]: updatedEvents };

        /* build a map from the event data */
        // const eventMap: Map<string, string> = new Map(
        //   events.map((log: any) => events.interface.parseLog(log).args) as [[string, string]]
        // );

        // const newObj: any = {};
        // await Promise.all([
        //   ...events.map(async (x: any): Promise<void> => {
        //     const { seriesId: id, baseId, fyToken } = contract.interface.parseLog(x).args;
        //     const { maturity } = await Cauldron.series(id);

        //       const events = {
        //         id,
        //         baseId,
        //         maturity,
        //         name,
        //         symbol,
        //         version,
        //         address: fyToken,
        //         fyTokenAddress: fyToken,
        //         decimals,
        //         poolAddress,
        //         poolVersion,
        //         poolName,
        //         poolSymbol,
        //       };
        //       newSeriesObj[id] = _chargeSeries(newSeries);
        //     }
        //   }),
        // ]);
        dispatch(updateEvents(eventsMap));
        dispatch(setEventsLoading(false));
      } catch (e) {
        dispatch(setEventsLoading(false));
        console.log('Error fetching events data: ', e);
      }
    }
  };
}

export const updateEvents = (events: any) => ({ type: ActionType.UPDATE_EVENTS, events });
export const setEventsLoading = (eventsLoading: boolean) => ({ type: ActionType.EVENTS_LOADING, eventsLoading });
export const updateContractMap = (contractMap: any) => ({ type: ActionType.UPDATE_CONTRACT_MAP, contractMap });
