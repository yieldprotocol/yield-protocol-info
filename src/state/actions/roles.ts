import axios from 'axios';
import { ActionType } from '../actionTypes/contracts';

const ROLE_GRANTED = 'RoleGranted';
const ROLE_REVOKED = 'RoleRevoked';
const ROOT = '0x00000000';

export function eventSort(a: any, b: any) {
  if (a.blockNumber > b.blockNumber) return 1;
  if (a.blockNumber < b.blockNumber) return -1;
  if (a.transactionIndex > b.transactionIndex) return 1;
  if (a.transactionIndex < b.transactionIndex) return -1;
  if (a.logIndex > b.logIndex) return 1;
  if (a.logIndex < b.logIndex) return -1;
  return 0;
}

export function getRoles(contractMap: any, contractAddr: any, filter = '*') {
  return async function _getRoles(dispatch: any) {
    dispatch(setRolesLoading(true));
    const contract = contractMap[contractAddr]?.contract!;
    if (contract) {
      try {
        dispatch(setRolesLoading(true));
        const events = await contract.queryFilter(filter, null, null);

        // determine current roles by iterating over events chronologically
        // tracking who's been added/removed from each role
        const roleBytesSeen = new Set(); // used to fetch friendly display names later
        const updatedRoles = events.sort(eventSort).reduce((acc: any, e: any) => {
          if (![ROLE_GRANTED, ROLE_REVOKED].includes(e.event)) return acc;
          const [roleBytes, guy] = e.args;
          roleBytesSeen.add(roleBytes);
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
              // This shouldn't be possible...
              console.warn(
                `RevokeRole encounted before GrantRole, blockNumber: ${e.blockNumber} transactionIndex: ${e.transactionIndex} logIndex: ${e.logIndex}`
              );
            }
          }
          return acc;
        }, {});

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
          dispatch(updateRoles({ roleNames, roles: rolesMap }));
          dispatch(setRolesLoading(false));
        });
      } catch (e) {
        dispatch(setRolesLoading(false));
      }
    }
  };
}
export const setRolesLoading = (rolesLoading: boolean) => ({ type: ActionType.ROLES_LOADING, rolesLoading });
export const updateRoles = (payload: any) => ({ type: ActionType.UPDATE_ROLES, payload });
