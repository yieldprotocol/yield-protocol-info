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
          console.log(ogArgs);
          return (
            <>
              <tr style={{ paddingLeft: '2rem' }} className="no-wrap">
                <td style={{ paddingLeft: '2rem', paddingRight: '2rem' }} className="italic">
                  {call.argProps[idx].name}
                </td>
                <td>
                  {/** If there's only one argument (and it's not an object), display it right next to the arg name */}
                  {args.length === 1 &&
                    (!(args[0] instanceof Object) && (call.argProps[idx].type === 'address' ? <AddressDisplay addr={args[0]}/> : (
                      <span>
                        <code>{args[0]}</code>
                      </span>
                    )))}
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
                        <td><code>{JSON.stringify(v)}</code></td>
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
  const { decodeProposalHash, loading, calls, txHash } = useProposalHashDecoder(proposalHash);
  console.log('calls', calls)
  console.log('txHash', txHash)

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
        {/* {!loading && call && <CallDisplay call={call} />} */}
      </div>
    </div>
  );
};

export default ProposalHashDecoder;
