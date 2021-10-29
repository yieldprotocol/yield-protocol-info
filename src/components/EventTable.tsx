import React from 'react';
import { v4 as uuid } from 'uuid';
import AddressDisplay from './AddressDisplay';

const ArgsCell = ({ values, eventArgs }: any) => (
  <table>
    <tbody>
      {eventArgs &&
        values?.split(',').map((value: string, idx: number) => (
          <tr key={uuid()}>
            <td style={{ minWidth: '8rem' }}>{eventArgs ? eventArgs[idx].name : `unknown arg${idx}`}:</td>
            <td>
              <p>
                {(eventArgs && eventArgs[idx].type) === 'address' ? (
                  <AddressDisplay addr={value} />
                ) : (
                  <code>{value}</code>
                )}
              </p>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
);

const EventTable = ({ events, eventArgsProps }: any) => (
  <div>
    <table className="table min-w-full divide-y divide-gray-200">
      <thead className="">
        <tr>
          {[...Object.keys(events[0])].map((key: any) => (
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
        {[...events]
          .filter((e) => !!e.event)
          .map((e: any) => (
            <tr key={e.id}>
              {[...Object.values(e)].map((value: any, idx: number) => (
                <td className="px-6 py-4" key={uuid()}>
                  <div className="justify-items-start">
                    <div className="text-sm font-medium text-gray-900 justify-items-start">
                      {idx === 3 ? <ArgsCell values={value} eventArgs={eventArgsProps[e.event]} /> : value}
                    </div>
                  </div>
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  </div>
);

export default EventTable;
