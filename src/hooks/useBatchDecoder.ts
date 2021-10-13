import { useEffect, useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, fetchEtherscan } from '../utils/etherscan';
import * as yieldEnv from '../yieldEnv.json';
import { NETWORK_LABEL } from '../config/networks';

const useBatchDecoder = (txHash: string) => {
  const chainId = 42;
  const network = NETWORK_LABEL[chainId]?.toLowerCase();
  const ADDRESS_LADLE = (yieldEnv.addresses as any)[chainId].Ladle;
  const [loading, setLoading] = useState(false);
  const [calls, setCalls] = useState<any>();
  const [decoded, setDecoded] = useState<any>({
    abis: {},
    contracts: {},
    calls: {},
  });

  async function getCalls() {
    console.log('getcalls');
    setLoading(true);

    const tx = await ethers.getDefaultProvider(network).getTransaction(txHash);
    if (!tx?.to) {
      console.log(`Transaction without address: ${tx}`);
      return;
    }
    const call = { to: tx.to, data: tx.data };
    console.log(`call: ${call}`);
    await resolveCall(call);
    setCalls([txHash, call]);
    setLoading(false);
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
    console.log('calldata', calldata);
    const selector = calldata.slice(0, 2 + 4 * 2);
    console.log('abi in getfunc', abi);
    const f = abi.functions.get(selector);
    if (!f) {
      console.log(`Can't find selector ${selector} in function ${abi}`);
    }
    return [f, addHexPrefix(calldata.slice(2 + 2 * 4))];
  }

  async function getABI(target: string) {
    if (!(target in decoded.abis)) {
      const ret = await fetchEtherscan(
        network,
        new URLSearchParams({
          module: 'contract',
          action: 'getsourcecode',
          address: addHexPrefix(target),
          apikey: 'FSUGH69TNP8K1Q1TAZQYND5VDHETGMADR5',
        }),
        (x) => console.log(x)
      );
      const iface = new Interface(ret.result[0].ABI);
      const functions = new Map<string, FunctionFragment>();
      // eslint-disable-next-line guard-for-in
      for (const f in iface.functions) {
        console.log('f', f);
        functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]);
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

  async function resolveCall(calling: any) {
    const abi = await getABI(calling.to);
    console.log('abi', abi);
    const [func, argsCalldata] = await getFunction(abi, calling.data);

    let _args = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );

    console.log('args', _args);
    if (ethers.utils.getAddress(calling.to) === ethers.utils.getAddress(ADDRESS_LADLE) && func.name === 'batch') {
      _args = [_args[0].map((x: any) => ({ to: calling.to, data: x }))];

      await Promise.all(_args[0].map((x: any) => resolveCall(x)));
    } else if (
      ethers.utils.getAddress(calling.to) === ethers.utils.getAddress(ADDRESS_LADLE) &&
      func.name === 'route'
    ) {
      _args = [{ to: _args[0], data: _args[1] }];
      await resolveCall(_args[0]);
    } else {
      _args = _args.map((x) => x.toString());
    }
  }

  async function decodeTxHash() {
    try {
      const tx = await ethers.getDefaultProvider(network).getTransaction(txHash);
      if (!tx.to) {
        console.log(`Transaction without address: ${tx}`);
        return;
      }
      const call = { to: tx.to, data: tx.data };
      await resolveCall(call);
    } catch (e) {
      console.log('error getting decoded data');
    }
  }
  return { decodeTxHash, decoded, loading };
};

export { useBatchDecoder };
