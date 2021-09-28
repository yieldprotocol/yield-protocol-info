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

function _warnPrexistingRole(e: any) {
  console.warn(
    `RoleGranted encounted with pre-existing role, blockNumber: ${e.blockNumber} transactionIndex: ${e.transactionIndex} logIndex: ${e.logIndex}`
  );
}

function _warnMissingGrant(e: any) {
  console.warn(
    `RoleRevoked encounted with no pre-existing role found, blockNumber: ${e.blockNumber} transactionIndex: ${e.transactionIndex} logIndex: ${e.logIndex}`
  );

}

export function calcRoles(events: any) {
  // determine current roles by iterating over events chronologically
  // tracking who's been added/removed from each role
  // TODO: write test
  const updatedRoles: any = {};
  const roleBytesSeen = new Set();
  events.sort(eventSort).forEach((e: any) => {
    // skip all other events
    if (![ROLE_GRANTED, ROLE_REVOKED].includes(e.event)) return;

    const [roleBytes, guy] = e.args;

    roleBytesSeen.add(roleBytes); // used to fetch friendly display names later

    switch (e.event) {
      case ROLE_GRANTED:
        if (roleBytes in updatedRoles) {
          if (updatedRoles[roleBytes].has(guy)) {
            _warnPrexistingRole(e);
          } else {
            updatedRoles[roleBytes].add(guy);
          }
        } else {
          updatedRoles[roleBytes] = new Set([guy]);
        }
        break;
      case ROLE_REVOKED:
        if (roleBytes in updatedRoles) {
          if (updatedRoles[roleBytes].has(guy)) {
            updatedRoles[roleBytes].delete(guy);
            if (updatedRoles[roleBytes].size === 0) {
              delete updatedRoles[roleBytes];
            }
          }
          break;
        }
        _warnMissingGrant(e);
        break;
      default:
        break;
    }
  });
  return [updatedRoles, roleBytesSeen];
}

export function getRoles(contractMap: any, contractAddr: any, filter = '*') {
  return async function _getRoles(dispatch: any) {
    dispatch(setRolesLoading(true));
    const contract = contractMap[contractAddr]?.contract!;
    if (contract) {
      try {
        dispatch(setRolesLoading(true));

        const events = await contract.queryFilter(filter, null, null);

        const [updatedRoles, roleBytesSeen] = calcRoles(events);

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
        console.warn('errors', e);
      }
    }
  };
}
export const setRolesLoading = (rolesLoading: boolean) => ({ type: ActionType.ROLES_LOADING, rolesLoading });
export const updateRoles = (payload: any) => ({ type: ActionType.UPDATE_ROLES, payload });
