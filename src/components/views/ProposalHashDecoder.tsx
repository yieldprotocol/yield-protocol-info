import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { v4 as uuid } from 'uuid';
import TextInput from '../TextInput';
import { useProposalHashDecoder } from '../../hooks/useProposalHashDecoder';
import Button from '../Button';
import AddressDisplay from '../AddressDisplay';

const ProposalHashDecoder = () => {
  const [proposalHash, setProposalHash] = useState('');
  const { decodeProposalHash, loading, calls, txHash, getFunctionName, getFunctionArguments, decoded } =
    useProposalHashDecoder(proposalHash);
  console.log('calls', calls);
  console.log('decoded', decoded);
  console.log('txHash', txHash);
  if (calls) {
    console.log('calls', calls);
    const call = calls[1][0];
    console.log(getFunctionName(call.target, call.data));
    console.log(getFunctionArguments(call.target, call.data));
  }

  return (
    <div className="w-1/2">
      <div className="h-14">
        <TextInput
          onChange={setProposalHash}
          action={decodeProposalHash}
          name="Proposal"
          value={proposalHash}
          placeHolder="Proposal hash"
        />
        <Button label="Decode" action={decodeProposalHash} />
      </div>
      <div className="pt-20 align-middle justify-center">
        {loading && (
          <div className="text-center">
            <ClipLoader loading={loading} />
          </div>
        )}
        {!loading && calls && (
          <>
            <div className="mb-2">
              <span className="font-bold">Transaction Hash </span><AddressDisplay addr={txHash[1]} tx />
            </div>
            <span className="font-bold mr-2">
            Calls:
            </span>
            {calls[1].length}
            {calls[1].map((call: any) => (
              <>
                <div className="mb-2">
                <span className="font-bold mr-2">Target: </span>{decoded.contracts[call.target]}
                </div>
                <div className="mb-3">

                <span className="font-bold">Decoded calldata:</span>
                </div>
                <div className="ml-4">
                  function{' '}<span className="font-bold">{getFunctionName(call.target, call.data)[0].split(' ')[1]}</span>
                  <table className="ml-4">
                    {getFunctionArguments(call.target, call.data).map((x: any, idx: number) => {
                      const [typeName, value] = x;
                      const [type, name] = typeName.split(' ')

                      return (
                        <tr key={uuid()} className="pl-6">
                          <td className="font-bold">{name}</td>
                          <td className="italic" style={{ minWidth: '5rem' }}>({type})</td>
                          {type === 'address' ? <AddressDisplay addr={value}/> : <code>{value}</code> }
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalHashDecoder;
