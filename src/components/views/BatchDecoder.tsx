import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import TextInput from '../TextInput';
import { useBatchDecoder } from '../../hooks/useBatchDecoder';
import Button from '../Button';

const BatchDecoder = () => {
  const [txHash, setTxHash] = useState('');
  const { decodeTxHash, decoded, loading } = useBatchDecoder(txHash);

  return (
    <>
      <div className="w-1/2 h-10">
        <TextInput action={setTxHash} name="Transaction" value={txHash} placeHolder="Transaction hash" />
        <Button label="Decode" action={decodeTxHash} />
      </div>
      <div className="">
        {loading && <ClipLoader loading={loading} />}
        {/* {decoded && <div>{decoded.calls}</div>} */}
      </div>
    </>
  );
};

export default BatchDecoder;
