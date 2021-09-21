import React from 'react';
import { v4 as uuid } from 'uuid';

const EventTable = ({ events }: any) =>
  events ? (
    <div>
      <table className="table min-w-full divide-y divide-gray-200">
        <thead className="">
          <tr>
            {Object.keys(events[0]).map((key: any) => (
              <th
                key={key}
                scope="col"
                className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider justify-items-start text-left"
              >
                {key}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-green divide-y divide-gray-200">
          {[...events.slice(0, 50)].map((e: any) => (
            <tr key={e.id}>
              {[...Object.values(e)].map((x: any) => (
                <td className="px-6 py-4" key={uuid()}>
                  <div className="justify-items-start">
                    <div className="text-sm font-medium text-gray-900 justify-items-start">{x}</div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : null;

export default EventTable;
