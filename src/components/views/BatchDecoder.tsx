import { Fragment, useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import TextInput from '../TextInput';
import { useBatchDecoder } from '../../hooks/useBatchDecoder';
import Button from '../Button';
import AddressDisplay from '../AddressDisplay';
import Spinner from '../Spinner';
import { markMap } from '../../config/marks';
import useSeries from '../../hooks/useSeries';
import useAssets from '../../hooks/useAssets';
import { IAssetMap, ISeriesMap } from '../../types/chain';

const CallDisplay = ({ call, assets, series }: { call: any; assets: IAssetMap; series: ISeriesMap }) => (
  <table>
    <tbody>
      <tr className="font-bold pt-4">
        <td>{call.method}</td>
      </tr>
      {call.arguments?.map((ogArgs: any, idx: number) => {
        const args: any = Array.isArray(ogArgs) ? ogArgs : [ogArgs];
        const asset =
          assets && assets[args[0]] ? assets[args[0]] : Object.values(assets!).filter((a) => a.address === args[0])[0];
        const logo = asset ? markMap?.get(assets![asset.id].symbol!) : null;
        const seriesItem = Object.values(series).filter((a) => a.id === args[0])[0];
        return (
          <Fragment key={uuid()}>
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
                {logo && <div className="h-4 w-4 justify-start">{logo}</div>}
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
                        <CallDisplay call={v} assets={assets} series={series} />
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
          </Fragment>
        );
      })}
    </tbody>
  </table>
);

const BatchDecoder = () => {
  const { data: assets } = useAssets();
  const { data: series } = useSeries();

  const [txHash, setTxHash] = useState('');
  const { decodeTxHash, loading, call } = useBatchDecoder(txHash);

  const handleDecode = useCallback(() => {
    if (txHash) decodeTxHash();
  }, [txHash, decodeTxHash]);

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
        {loading && <Spinner />}
        {!loading && call && (
          <div className="dark:bg-green-200 p-4 rounded-lg">
            <CallDisplay call={call} assets={assets} series={series} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDecoder;
