import React, { useState } from 'react';
import { v4 as uuid } from 'uuid';
import TextInput from '../TextInput';
import { useBatchDecoder } from '../../hooks/useBatchDecoder';
import Button from '../Button';
import AddressDisplay from '../AddressDisplay';
import Spinner from '../Spinner';
import { markMap } from '../../config/marks';
import { useAppSelector } from '../../state/hooks/general';
import { IAsset, IAssetMap, ISeries, ISeriesMap } from '../../types/chain';

const CallDisplay = ({ call }: any): any => {
  const assets = useAppSelector((st) => st.chain.assets);
  const series = useAppSelector((st) => st.chain.series);
  return (
    <table>
      <tbody>
        <tr className="font-bold pt-4">
          <td>{call.method}</td>
        </tr>
        {call.arguments?.map((ogArgs: any, idx: number) => {
          const args: any = Array.isArray(ogArgs) ? ogArgs : [ogArgs];
          const asset = assets[args[0]]
            ? assets[args[0]]
            : Object.values(assets as IAssetMap).filter((a: IAsset) => a.address === args[0])[0];
          const logo = asset ? markMap?.get(assets[asset.id].symbol!) : null;
          const seriesItem = Object.values(series as ISeriesMap).filter((a: ISeries) => a.id === args[0])[0];
          return (
            <div key={uuid()} className="">
              <tr className="no-wrap">
                <td className="italic px-4">{call.argProps[idx].name}</td>
                <td className="flex gap-1">
                  {/** If there's only one argument (and it's not an object), display it right next to the arg name */}
                  {args.length === 1 &&
                    !(args[0] instanceof Object) &&
                    (call.argProps[idx].type === 'address' ? (
                      <AddressDisplay addr={args[0]} />
                    ) : (
                      <span>
                        <code>{args[0]}</code>
                      </span>
                    ))}
                  {logo && <div className="h-4 w-4 m-auto">{logo}</div>}
                  {seriesItem && (
                    <div>
                      <i>({seriesItem.displayName})</i>
                    </div>
                  )}
                </td>
              </tr>
              {(args.length > 1 || (args.length === 1 && args[0] instanceof Object)) &&
                args.map((v: any) => (
                  <tr key={uuid()}>
                    {v instanceof Object ? (
                      <>
                        <td className="px-4" />
                        <td>
                          <CallDisplay call={v} />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4" />
                        <td>
                          <code>{JSON.stringify(v)}</code>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
            </div>
          );
        })}
      </tbody>
    </table>
  );
};

const BatchDecoder = () => {
  const [txHash, setTxHash] = useState('');
  const { decodeTxHash, loading, call } = useBatchDecoder(txHash);
  const handleDecode = () => txHash && decodeTxHash();
  return (
    <div className="w-1/2">
      <div className="h-14">
        <TextInput
          onChange={setTxHash}
          action={handleDecode}
          name="Transaction"
          value={txHash}
          placeHolder="Transaction hash"
        />
        <Button label="Decode" action={handleDecode} />
      </div>
      <div className="pt-20 align-middle justify-center">
        <Spinner loading={loading} />
        {!loading && call && (
          <div className="dark:bg-green-200 p-4 rounded-lg">
            <CallDisplay call={call} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDecoder;
