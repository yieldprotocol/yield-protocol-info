import { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, fetchEtherscan } from '../utils/etherscan';
import { useAppSelector } from '../state/hooks/general';
import { getProvider } from '../lib/chain';

const useBatchDecoder = (txHash: string) => {
  const { chainId } = useAppSelector(({ application }) => application);
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
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);
    if (!f) {
      console.log(`Can't find selector ${selector} in function ${abi}`);
    }
    return [f, addHexPrefix(calldata.slice(2 + 2 * 4))];
  }

  async function getABI(target: string) {
    if (target in decoded.abis) return decoded.abis[target];
    const ret = await fetchEtherscan(
      chainId!,
      new URLSearchParams({
        module: 'contract',
        action: 'getsourcecode',
        address: addHexPrefix(target),
        apikey: process.env.ETHERSCAN_API_KEY,
      })
    );
    console.log('🦄 ~ file: useBatchDecoder.ts ~ line 41 ~ getABI ~ ret', ret);
    const iface = new Interface(ret.result[0].ABI);
    const functions = new Map<string, FunctionFragment>();
    // eslint-disable-next-line guard-for-in
    for (const f in iface.functions) {
      functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]);
    }

    const result = {
      interface: iface,
      functions,
    };

    setDecoded((d: any) => ({
      ...d,
      contracts: {
        ...d.contracts,
        [target]: ret.ContractName,
      },
      abis: {
        ...d.abis,
        [target]: result,
      },
    }));
    return result;
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

  async function resolveCall(call: Call) {
    const abi = await getABI(call.to);
    const [func, argsCalldata] = await getFunction(abi, call.calldata);

    let _args: any = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );

    if (ethers.utils.getAddress(call.to) && func.name === 'batch') {
      _args = [_args[0].map((x: any) => new Call(call.to, x))];
      await Promise.all(_args[0].map((x: any) => resolveCall(x)));
    } else if (func.name === 'execute') {
      _args = [_args[0].map((x: any) => new Call(x[0], x[1]))];
      await Promise.all(_args[0].map((x: any) => resolveCall(x)));
    } else if (ethers.utils.getAddress(call.to) && func.name === 'route') {
      _args = [new Call(_args[0], _args[1])];
      await resolveCall(_args[0]);
    } else {
      _args = _args.map((x: any) => x.toString());
    }
    call.resolve(
      func.name,
      _args,
      func.inputs.map((i: any) => ({ name: i.name, type: i.type }))
    );
    return call;
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
