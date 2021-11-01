import React from 'react';
import { v4 as uuid } from 'uuid';

import AddressDisplay from './AddressDisplay';

const RolesTable = ({ roles, roleNames }: any) => {
  if (!roles) return null;
  const displayName = (bytes: string) => roleNames[bytes] || `unknown role (${bytes}) `;
  const displayGuys = (key: string) =>
    Array.from(roles[key]).map((x) => (
      <div key={uuid()}>
        <AddressDisplay addr={x} />
      </div>
    ));
  return (
    <div>
      <table className="table min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            <th
              key="role"
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Role
            </th>
            <th
              key="users"
              scope="col"
              className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
            >
              Users
            </th>
          </tr>
        </thead>
        <tbody className="bg-green divide-y divide-gray-200">
          {[
            ...Object.keys(roles).map((key) => (
              <tr key={key}>
                <td className="px-6 py-4" key={`${key}-role`}>
                  <div className="justify-items-start">
                    <div className="text-sm font-medium text-gray-900 justify-items-start">{displayName(key)}</div>
                  </div>
                </td>
                <td className="px-6 py-4" key={`${key}-guys`}>
                  <div className="justify-items-start">
                    <div className="text-sm font-medium text-gray-900 justify-items-start">{displayGuys(key)}</div>
                  </div>
                </td>
              </tr>
            )),
          ]}
        </tbody>
      </table>
    </div>
  );
};
export default RolesTable;
