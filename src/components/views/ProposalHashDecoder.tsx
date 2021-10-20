import React, { useState } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { v4 as uuid } from 'uuid';
import TextInput from '../TextInput';
import { useProposalHashDecoder } from '../../hooks/useProposalHashDecoder';
import Button from '../Button';
import AddressDisplay from '../AddressDisplay';

const CallDisplay = ({ call }: any): any => (
  <table>
    <tbody>
      <tr style={{ paddingTop: '1rem' }} className="font-bold">
        <td>{call.method}</td>
      </tr>
      {call.arguments?.map((ogArgs: any, idx: number) => {
        const args: any = Array.isArray(ogArgs) ? ogArgs : [ogArgs];
        return (
          <>
            <tr style={{ paddingLeft: '2rem' }} className="no-wrap">
              <td style={{ paddingLeft: '2rem', paddingRight: '2rem' }} className="italic">
                {call.argProps[idx].name}
              </td>
              <td>
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
              </td>
            </tr>
            {(args.length > 1 || (args.length === 1 && args[0] instanceof Object)) &&
              args.map((v: any) => (
                <tr key={uuid()}>
                  {v instanceof Object ? (
                    <>
                      <td style={{ paddingLeft: '2rem', paddingRight: '2rem' }} />
                      <td>
                        <CallDisplay call={v} />
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ paddingLeft: '2rem', paddingRight: '2rem' }} />
                      <td>
                        <code>{JSON.stringify(v)}</code>
                      </td>
                    </>
                  )}
                </tr>
              ))}
          </>
        );
      })}
    </tbody>
  </table>
);
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
