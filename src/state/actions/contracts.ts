import axios from 'axios';
import { ActionType } from '../actionTypes/contracts';

const ROLE_GRANTED = 'RoleGranted';
const ROLE_REVOKED = 'RoleRevoked';
const ROOT = '0x00000000';

export function getEvents(contractMap: any, contractAddr: any, filter = '*') {
  return async function _getEvents(dispatch: any) {
    dispatch(setEventsLoading(true));
    const contract = contractMap[contractAddr]?.contract!;
    if (contract) {
      try {
        dispatch(setEventsLoading(true));
        const events = await contract.queryFilter(filter, null, null);

        const updatedEvents = events.map((e: any, i: number) => ({
          id: i,
          event: e.event,
          blockNumber: e.blockNumber,
          args: e.args ? e.args.join(', ') : '',
          logIndex: e.logIndex,
        }));

        // determine current roles by iterating over events chronologically
        // tracking who's been added/removed from each role
        const roleBytesSeen = new Set(); // used to fetch friendly display names later
        const sortedEvents = updatedEvents.sort((a: any, b: any) => a.logIndex - b.logIndex);
        const updatedRoles = sortedEvents.reduce((acc: any, e: any) => {
          if (![ROLE_GRANTED, ROLE_REVOKED].includes(e.event)) return acc;
          const [roleBytes, guy]: [roleBytes: string, guy: string] = e.args.split(',');
          roleBytesSeen.add(`${roleBytes}`);
          if (e.event === ROLE_GRANTED) {
            if (roleBytes in acc) {
              acc[roleBytes].add(guy);
            } else {
              acc[roleBytes] = new Set([guy]);
            }
          }
          if (e.event === ROLE_REVOKED) {
            if (roleBytes in acc) {
              if (acc[roleBytes].size === 1) {
                delete acc[roleBytes];
              } else {
                acc[roleBytes].delete(guy);
              }
            } else {
              // I don't think this could happen...
              console.warn('RevokeRole encounted before GrantRole, logIndex:', e.logIndex);
            }
          }

          return acc;
        }, {});

        const eventsMap = { [contractAddr]: updatedEvents };
        const rolesMap = { [contractAddr]: updatedRoles };

        const roleNames: any = {
          [ROOT]: 'admin',
        };
        const promises: Promise<void>[] = [];

        roleBytesSeen.forEach(async (hex_signature: any) => {
          const promise = axios
            .get('https://www.4byte.directory/api/v1/signatures/', { params: { hex_signature } })
            .then((res) => {
              const {
                data: { results },
              } = res;
              if (results?.length === 1) {
                const [functionName] = results[0].text_signature.split('(');
                roleNames[hex_signature] = functionName;
              }
            });
          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          dispatch(updateRoleNames(roleNames));

        });

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
        dispatch(
          updateEvents({
            events: eventsMap,
            roles: rolesMap,
          })
        );
        dispatch(setEventsLoading(false));
      } catch (e) {
        dispatch(setEventsLoading(false));
        console.log('Error fetching events data: ', e);
      }
    }
  };
}
export const updateEvents = (payload: any) => ({ type: ActionType.UPDATE_EVENTS, payload });
export const updateRoleNames = (roleNames: any) => ({ type: ActionType.UPDATE_ROLENAMES, roleNames });
export const setEventsLoading = (eventsLoading: boolean) => ({ type: ActionType.EVENTS_LOADING, eventsLoading });
export const updateContractMap = (contractMap: any) => ({ type: ActionType.UPDATE_CONTRACT_MAP, contractMap });
