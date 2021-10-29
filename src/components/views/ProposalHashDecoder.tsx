import React, { useEffect, useState } from 'react';
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

  const handleDecode = () => proposalHash && decodeProposalHash();

  useEffect(() => {
    if (calls) {
      const call = calls[1][0];
      console.log('calls', calls);
      console.log('func name', getFunctionName(call.target, call.data));
      console.log('func args', getFunctionArguments(call.target, call.data));
    }
  }, [calls, getFunctionName, getFunctionArguments]);

  return (
    <div className="w-1/2">
      <div className="h-14">
        <TextInput
          onChange={setProposalHash}
          action={handleDecode}
          name="Proposal"
          value={proposalHash}
          placeHolder="Proposal hash"
        />
        <Button label="Decode" action={handleDecode} />
      </div>
      <div className="pt-20 align-middle justify-center">
        {loading && (
          <div className="text-center">
            <ClipLoader loading={loading} />
          </div>
        )}
        {!loading && calls && (
          <>
            <div className="mb-4">
              <div className="mb-1">
                <span className="font-bold">Transaction Hash: </span>
              </div>
              <AddressDisplay addr={txHash[1]} tx />
            </div>
            <div className="mb-4">
              <span className="font-bold mr-2">Calls:</span>
              {calls[1].length}
            </div>
            {calls[1].map((call: any) => (
              <div className="ml-4 my-6" key={uuid()}>
                <div className="mb-2">
                  <span className="font-bold mr-2">Target: </span>
                  {decoded.contracts[call.target]}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Decoded calldata:</span>
                </div>
                <div className="ml-6">
                  function <span className="font-bold">{getFunctionName(call.target, call.data)}</span>
                  <table className="ml-4">
                    {getFunctionArguments(call.target, call.data).map((x: any) => {
                      const [typeName, value] = x;
                      const [type, name] = typeName.split(' ');

                      return (
                        <tr key={uuid()} className="pl-6">
                          <td className="font-bold">{name}</td>
                          <td className="italic" style={{ minWidth: '5rem' }}>
                            ({type})
                          </td>
                          {type === 'address' ? <AddressDisplay addr={value} /> : <code>{value}</code>}
                        </tr>
                      );
                    })}
                  </table>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default ProposalHashDecoder;
