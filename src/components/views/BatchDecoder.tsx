import React, { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import ClipLoader from 'react-spinners/ClipLoader';
import { addHexPrefix, fetchEtherscan } from '../../utils/etherscan';
import TextInput from '../TextInput';

class Call {
  method?: string;

  arguments: (string | Call)[] = [];

  constructor(readonly to: string, readonly calldata: string) {}

  resolve(_method: string, _arguments: any) {
    this.method = _method;
    this.arguments = _arguments;
  }

  toPrettyJson() {
    return { function: `${this.method} [${this.to}]`, arguments: this.arguments };
  }
}

const ADDRESS_LADLE = '0x5840069b175d3eea154c58b065edc06095bb9217';

let provider: any;
export function CallsDisplay({ txnHash }: any) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [calls, setCalls]: any = useState([]);
  const [decoded, setDecoded]: any = useState({
    abis: {},
    contracts: {},
    calls: {},
  });

  const network = 'mainnet';
  if (!provider) {
    provider = ethers.getDefaultProvider(network);
    console.log('provider', provider);
  }

  async function getCalls() {
    console.log('getcalls');
    setLoading(true);

    const tx = await provider.getTransaction(txnHash);
    console.log('tx', tx);
    if (!tx?.to) {
      console.log(`Transaction without address: ${tx}`);
      return;
    }
    const call = new Call(tx.to, tx.data);
    console.log(`call: ${call}`);
    await resolveCall(call);
    setCalls([txnHash, call]);
    setLoading(false);
  }

  if (!loading && !loaded) {
    getCalls();
  }

  async function getABI(target: string) {
    if (!(target in decoded.abis)) {
      const ret = (
        await fetchEtherscan(
          network,
          new URLSearchParams({
            module: 'contract',
            action: 'getsourcecode',
            address: addHexPrefix(target),
          }),
          (x) => console.log(x)
        )
      ).result[0];
      const iface = new Interface(ret.ABI);
      const functions = new Map<string, FunctionFragment>();
      for (const f in iface.functions) {
        if (Object.prototype.hasOwnProperty.call(f, 'getSighash')) {
          functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]);
        }
      }
      setDecoded({
        ...decoded,
        contract: {
          ...decoded.contracts,
          [target]: ret.ContractName,
        },
        abis: {
          ...decoded.abis,
          [target]: {
            interface: iface,
            functions,
          },
        },
      });
    }
    return decoded.abis[target];
  }

  async function resolveCall(calling: Call) {
    const abi = await getABI(calling.to);
    console.log('abi', abi);
    const [func, argsCalldata] = await getFunction(abi, calling.calldata);
    console.log('getFunction', [func, argsCalldata]);

    let args = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );

    console.log('args', args);
    if (ethers.utils.getAddress(calling.to) === ethers.utils.getAddress(ADDRESS_LADLE) && func.name === 'batch') {
      args = [args[0].map((x: any) => new Call(calling.to, x))];

      await Promise.all(args[0].map((x: any) => resolveCall(x)));
    } else if (
      ethers.utils.getAddress(calling.to) === ethers.utils.getAddress(ADDRESS_LADLE) &&
      func.name === 'route'
    ) {
      args = [new Call(args[0], args[1])];
      await resolveCall(args[0]);
    } else {
      args = args.map((x) => x.toString());
    }
    // const decoded_args = func.inputs.map((v) => {
    //   return v.format(ethers.utils.FormatTypes.minimal);
    // });
    calling.resolve(func.name, args);
  }

  function getFunctionName(target: string, calldata: string): string {
    if (!(target in decoded.abis)) {
      return 'Fetching function name...';
    }
    const abi = decoded.abis[target];
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);
    if (!f) {
      return "Selector not found, that's bad";
    }
    return f.format(ethers.utils.FormatTypes.full);
  }

  function getFunctionArguments(target: string, calldata: string): Array<[string, string]> {
    if (!(target in decoded.abis)) {
      return [['status', 'Fetching function arguments...']];
    }
    return [];
  }

  async function getFunction(
    abi: { interface: Interface; functions: Map<string, FunctionFragment> },
    calldata: string
  ): Promise<any> {
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);
    if (!f) {
      throw new Error(`Can't find selector ${selector} in function ${abi}`);
    }
    return [f, addHexPrefix(calldata.slice(2 + 2 * 4))];
  }

  function getCallsJson() {
    return JSON.stringify(
      calls[1],
      (k, v) => {
        if (v instanceof Call) {
          return v.toPrettyJson();
        }
        return v;
      },
      2
    );
  }

  return (
    <div>
      <ClipLoader loading={loading} />
      {calls.length && getCallsJson()}
    </div>
  );
}

const BatchDecoder = () => {
  const [txnHash, setTxnHash] = useState('');
  return (
    <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20" style={{ width: '38rem' }}>
      <TextInput action={setTxnHash} name="Transaction" placeHolder="Transaction hash" />
      {txnHash && <CallsDisplay txnHash={txnHash} />}
    </div>
  );
};

export default BatchDecoder;
