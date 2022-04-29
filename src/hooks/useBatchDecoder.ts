import { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, getABI } from '../utils/etherscan';
import { useAppSelector } from '../state/hooks/general';
import { getProvider } from '../lib/chain';

const useBatchDecoder = (txHash: string) => {
  const chainId = useAppSelector(({ application }) => application.chainId);
  const provider = getProvider(chainId);

  const [loading, setLoading] = useState(false);
  const [finalCall, setFinalCall] = useState<any>(null);
  const [decoded, setDecoded] = useState<any>({
    abis: {},
    contracts: {},
    calls: {},
  });

  async function getFunction(
    abi: { interface: Interface; functions: Map<string, FunctionFragment> },
    calldata: string
  ): Promise<any> {
    if (!abi.interface || !abi.functions) return ['functions not found', 'data not found'];

    const selector = calldata.slice(0, 2 + 4 * 2);

    const f = abi.functions.get(selector);

    if (!f) {
      console.log(`Can't find selector ${selector} in function ${abi}`);
      return ['func not found', 'data not found'];
    }

    return [f, addHexPrefix(calldata.slice(2 + 2 * 4))];
  }

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function _getABI(target: string) {
    if (target in decoded.abis) return decoded.abis[target];

    try {
      const _result = await getABI(chainId, target);

      const iface = new Interface(_result);

      const functions = new Map<string, FunctionFragment>();
      Object.keys(iface.functions).map((f) => functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]));

      const res = { interface: iface, functions };

      setDecoded((d: any) => ({
        ...d,
        contracts: {
          ...d.contracts,
          [target]: _result.ContractName,
        },
        abis: {
          ...d.abis,
          [target]: res,
        },
      }));

      return res;
    } catch (error) {
      console.log(error);
      console.log('could not get abi data for: ', target);
      return {};
    }
  }

  class Call {
    method?: string;

    argProps?: any[];

    arguments: (string | Call)[] = [];

    constructor(readonly to: string, readonly calldata: string) {}

    resolve(_method: string, _arguments: (string | Call)[], _argProps: any[]) {
      this.method = _method;
      this.arguments = _arguments;
      this.argProps = _argProps;
    }

    toPrettyJson() {
      return { function: `${this.method} [${this.to}]`, arguments: this.arguments };
    }
  }

  async function resolveCall(call: Call, counter: number | null = 0) {
    if (counter === null) return call;

    const shouldDelay = counter % 3 === 0 && counter !== 0;
    if (shouldDelay) delay(1000);

    const abi = await _getABI(call.to);
    const newCount = counter + 1;

    const [func, argsCalldata] = await getFunction(abi, call.calldata);

    let _args: any = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );

    if (ethers.utils.getAddress(call.to) && func.name === 'batch') {
      _args = [_args[0].map((x: any) => new Call(call.to, x))];
      await Promise.all(_args[0].map((x: any, idx: number) => resolveCall(x, newCount + idx)));
    } else if (func.name === 'execute') {
      _args = [_args[0].map((x: any) => new Call(x[0], x[1]))];
      await Promise.all(_args[0].map((x: any, idx: number) => resolveCall(x, newCount + idx)));
    } else if (ethers.utils.getAddress(call.to) && func.name === 'route') {
      _args = [new Call(_args[0], _args[1])];
      await resolveCall(_args[0], newCount);
    } else {
      _args = _args.map((x: any) => x.toString());
    }
    call.resolve(
      func.name,
      _args,
      func.inputs.map((i: any) => ({ name: i.name, type: i.type }))
    );
    return resolveCall(call, null);
  }

  async function decodeTxHash() {
    setLoading(true);

    if (!provider) return;

    try {
      const tx = await provider.getTransaction(txHash);
      console.log(tx);
      if (!tx?.to) {
        console.log(`Transaction without address: ${tx}`);
        return;
      }
      const call = new Call(tx.to, tx.data);
      await resolveCall(call);
      setFinalCall(call);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log('error getting decoded data');
      console.log(e);
    }
  }

  return { decodeTxHash, loading, call: finalCall };
};

export { useBatchDecoder };
