import React, {  useState } from 'react';
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
const addressLadle = '0x5840069b175d3eea154c58b065edc06095bb9217';

const BatchDecoder = () => {
  const [txnHash, setTxnHash] = useState('');
  const [txnLoading, setTxnLoading] = useState(false);
  const [calls, setCalls]: any = useState([]);
  const [decoded, setDecoded]: any = useState({
    abis: {},
    contracts: {},
    calls: {},
  });

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

  async function resolveCall(call: Call) {
    const abi = await getABI(call.to);
    const [func, argsCalldata] = await getFunction(abi, call.calldata);

    let args = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );
    if (ethers.utils.getAddress(call.to) === ethers.utils.getAddress(addressLadle) && func.name === 'batch') {
      args = [args[0].map((x: any) => new Call(call.to, x))];

      await Promise.all(args[0].map((x: any) => resolveCall(x)));
    } else if (ethers.utils.getAddress(call.to) === ethers.utils.getAddress(addressLadle) && func.name === 'route') {
      args = [new Call(args[0], args[1])];
      await resolveCall(args[0]);
    } else {
      args = args.map((x) => x.toString());
    }
    // const decoded_args = func.inputs.map((v) => {
    //   return v.format(ethers.utils.FormatTypes.minimal);
    // });
    call.resolve(func.name, args);
  }

  async function decodeTxHash(hash: string) {
    setTxnLoading(true);
    const tx = await ethers.getDefaultProvider(network).getTransaction(hash);
    if (!tx?.to) {
      console.log(`Transaction without address: ${tx}`);
      return;
    }
    const call = new Call(tx.to, tx.data);
    console.log(`call: ${call}`);
    await resolveCall(call);
    setCalls([hash, call]);
  }

  const network = 'mainnet'; // !!!!

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

  if (txnHash) {
    decodeTxHash(txnHash);
  }

  return (
    <div className="flex justify-center sm:pt-8 md:pt-10 md:pb-20" style={{ width: '38rem' }}>
      <TextInput action={setTxnHash} name="Transaction" placeHolder="Transaction hash" />
      <ClipLoader loading={txnLoading} />
      {calls.length && getCallsJson()}
    </div>
  );
};

export default BatchDecoder;
