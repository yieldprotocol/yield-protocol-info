import { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, fetchEtherscan, getABI } from '../utils/etherscan';
import * as yieldEnv from '../yieldEnv.json';
import { useAppSelector } from '../state/hooks/general';

const useProposalHashDecoder = (proposalHash: string) => {
  const PROPOSE_EVENT = '0x2de9aefe888ee33e88ff8f7de007bdda112b7b6a4d0b1cd88690e805920d4091';
  const PROPOSE_ARGUMENTS = 'tuple(address target, bytes data)[]';

  const { provider, chainId } = useAppSelector((st) => st.chain);
  const ADDRESS_TIMELOCK = (yieldEnv.addresses as any)[chainId].Timelock;
  const [loading, setLoading] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<any>();
  const [calls, setCalls] = useState<any>();
  const [decoded, setDecoded] = useState<any>({
    abis: {},
    contracts: {},
    calls: {},
  });

  const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  async function startFetchingABIs(targets: Set<any>) {
    const targetsArr = Array.from(targets.values());

    let _decoded = decoded;

    for (let idx = 0; idx < targetsArr.length; idx++) {
      const target = targetsArr[idx];
      const shouldDelay = idx % 5 === 0 && idx !== 0;

      if (shouldDelay) delay(1000);

      if (!(target in decoded.abis)) {
        console.log('🦄 ~ file: useProposalHashDecoder.ts ~ line 37 ~ startFetchingABIs ~ target ', target);
        try {
          // eslint-disable-next-line no-await-in-loop
          const result = await getABI(chainId, target);

          if (result) {
            const iface = new Interface(result);
            const functions = new Map<string, FunctionFragment>();

            Object.keys(iface.functions).map((f) =>
              functions.set(iface.getSighash(iface.functions[f]), iface.functions[f])
            );

            _decoded = {
              ..._decoded,
              contracts: {
                ..._decoded.contracts,
                [target]: result.ContractName,
              },
              abis: {
                ..._decoded.abis,
                [target]: { interface: iface, functions },
              },
            };
          }
        } catch (e) {
          console.log('could not parse abi', e);
        }
      }
    }
    setLoading(false);
    setDecoded(_decoded);
    return undefined;
  }

  async function decodeTxHash(epoch: string, hash: string) {
    if (!provider) return;
    const tx = await provider.getTransaction(hash);
    const input = tx?.data;
    const callsArr = ethers.utils.defaultAbiCoder.decode([PROPOSE_ARGUMENTS], addHexPrefix(input.slice(2 + 4 * 2)))[0];
    const newCalls = [
      epoch,
      callsArr.map((call: any) => ({
        target: call.target,
        data: call.data,
      })),
    ];

    setCalls(newCalls);

    await startFetchingABIs(new Set(callsArr.map((call: any) => call.target)));
  }

  async function decodeHash(hash: string) {
    try {
      const tx: any = await fetchEtherscan(
        chainId,
        new URLSearchParams({
          module: 'logs',
          action: 'getLogs',
          address: addHexPrefix(ADDRESS_TIMELOCK),
          topic0: addHexPrefix(PROPOSE_EVENT),
          topic1: addHexPrefix(hash),
          apikey: process.env.REACT_APP_ETHERSCAN_API_KEY as string,
        })
      );

      const txHashArray: Array<any> = tx.result;

      if (txHashArray.length === 0) {
        throw Error('Failed to find Proposal hash');
      } else if (txHashArray.length > 1) {
        console.warn('Found more than 1 transaction with the same proposal hash; decoding the last one');
      }
      const txnHash = txHashArray[0].transactionHash;

      if (txHash === undefined || proposalHash === hash) {
        setTxHash([hash, txnHash]);
        await decodeTxHash(hash, txnHash);
      }
    } catch (ex) {
      console.warn(ex);
    }
    return false;
  }

  function getFunctionName(target: string, calldata: string): any {
    if (!(target in decoded.abis)) {
      return calldata;
    }

    const abi = decoded.abis[target];
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);

    if (!f) {
      return 'Selector not found';
    }

    const fn = f.format(ethers.utils.FormatTypes.full);
    return fn.split('(')[0].split('function ')[1];
  }

  function getFunctionArguments(target: string, calldata: string): Array<[string, string]> {
    if (!(target in decoded.abis)) {
      return [['status', 'no contract address']];
    }

    const abi = decoded.abis[target];
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);

    if (!f) {
      return [['status', 'Selector not found']];
    }

    try {
      const hexedCallData = addHexPrefix(calldata.slice(10));
      const types = f.inputs.map((p: any) => p.format());
      const args = ethers.utils.defaultAbiCoder.decode(types, hexedCallData);
      return f.inputs.map((v: any, i: any) => [v.format(ethers.utils.FormatTypes.full), args[i]]);
    } catch (e) {
      console.log(e);
    }

    return [];
  }

  async function decodeProposalHash() {
    setLoading(true);
    try {
      await decodeHash(proposalHash);
    } catch (e) {
      console.warn(e);
      setLoading(false);
    }
  }
  return { decodeProposalHash, loading, txHash, calls, getFunctionName, getFunctionArguments, decoded };
};

export { useProposalHashDecoder };
