import React from 'react';

const RolesTable = ({ roles, roleNames }: any) => {
  if (!roles) return null;
  const displayName = (bytes: string) => roleNames[bytes] || `unknown role (${bytes}) `;
  const displayGuys = (key: string) => Array.from(roles[key]).map((x) => <p key={key+x}><code>{`${x}`}</code></p>)
  // Hey Marco what do you think of this styling ^^?  I like it because its fixed width and the addresses line up
  // if you like it maybe we could apply it to the args column in Contracts as well
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
