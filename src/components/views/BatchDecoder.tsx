import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import TextInput from '../TextInput';
import { useBatchDecoder } from '../../hooks/useBatchDecoder';
import Button from '../Button';

const BatchDecoder = () => {
  const [txHash, setTxHash] = useState('');
  const { decodeTxHash, loading, funcName, args } = useBatchDecoder(txHash);
  return (
    <div className="w-1/2">
      <div className="h-14">
        <TextInput action={setTxHash} name="Transaction" value={txHash} placeHolder="Transaction hash" />
        <Button label="Decode" action={decodeTxHash} />
      </div>
      <div className="pt-20 align-middle justify-center">
        {loading && (
          <div className="text-center">
            <ClipLoader loading={loading} />
          </div>
        )}
        {!loading && funcName && <div className="">method: {funcName}</div>}
        {!loading && args && (
          <div className="pt-4">
            args:
            {args.map((x: string, i: number) => {
              const _key = i;
              return (
                <p className="pt-4" key={_key}>
                  <code className=" break-words">{x}</code>
                </p>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchDecoder;
