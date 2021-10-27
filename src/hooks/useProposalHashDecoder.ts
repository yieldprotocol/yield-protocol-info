import { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, fetchEtherscan } from '../utils/etherscan';
import * as yieldEnv from '../yieldEnv.json';
import { NETWORK_LABEL } from '../config/networks';
import { useAppSelector } from '../state/hooks/general';

const useProposalHashDecoder = (proposalHash: string) => {
  const PROPOSE_EVENT = '0x2de9aefe888ee33e88ff8f7de007bdda112b7b6a4d0b1cd88690e805920d4091';
  const PROPOSE_ARGUMENTS = 'tuple(address target, bytes data)[]';

  const chainId = useAppSelector((st) => st.chain.chainId);
  const network = NETWORK_LABEL[chainId]?.toLowerCase();
  const ADDRESS_TIMELOCK = (yieldEnv.addresses as any)[chainId].Timelock;
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<any>();
  const [calls, setCalls] = useState<any>();
  const [decoded, setDecoded] = useState<any>({
    abis: {},
    contracts: {},
    calls: {},
  });

  async function startFetchingABIs(targets: any) {
    const promises = [];
    const newDecoded: any = {
      abis: {},
      contracts: {},
      calls: {},
    }
    for (const target of targets) {
      if (!(target in decoded.abis)) {
        promises.push(
          fetchEtherscan(
            network,
            new URLSearchParams({
              module: 'contract',
              action: 'getsourcecode',
              address: addHexPrefix(target),
              apikey: '9C6JHFW1HK4TXJRF3WBWIMJMBYZ7NCW6AS',
            }),
            (x) => console.warn(x)
          ).then((ret: any) => {
            const result = ret.result[0];
            const iface = new Interface(result.ABI);
            const functions = new Map<string, FunctionFragment>();
            // eslint-disable-next-line guard-for-in
            for (const f in iface.functions) {
              functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]);
            }
            const newResult = {
              interface: iface,
              functions,
            };
            newDecoded.contracts[target] = result.ContractName
            newDecoded.abis[target] = newResult
          })
          );
        }
      }
      Promise.all(promises).then(() => {
        setDecoded(newDecoded);
        setLoading(false);
    });
  }

  async function decodeTxHash(epoch: string, hash: string) {
    const tx = await ethers.getDefaultProvider(network === 'ethereum' ? 'mainnet' : network).getTransaction(hash);
    const input = tx.data;
    const callsArr = ethers.utils.defaultAbiCoder.decode([PROPOSE_ARGUMENTS], addHexPrefix(input.slice(2 + 4 * 2)))[0];
    // 0x4a6c405fad393b24f0fd889bb8ae715b3fcca1f0a12c9ae079d072958c9dbbc7
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
        network,
        new URLSearchParams({
          module: 'logs',
          action: 'getLogs',
          address: addHexPrefix(ADDRESS_TIMELOCK),
          topic0: addHexPrefix(PROPOSE_EVENT),
          topic1: addHexPrefix(hash),
          apikey: '9C6JHFW1HK4TXJRF3WBWIMJMBYZ7NCW6AS',
        }),
        (x) => console.warn(x)
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
      return 'Fetching function name...';
    }
    const abi = decoded.abis[target];
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);
    if (!f) {
      return "Selector not found, that's bad";
    }
    const fn = f.format(ethers.utils.FormatTypes.full);

    const parts = fn.split('(');
    const args = parts[1].replace(')', '').split(', ');
    return [parts[0], args];
  }

  function getFunctionArguments(target: string, calldata: string): Array<[string, string]> {
    if (!(target in decoded.abis)) {
      return [['status', 'Fetching function arguments...']];
    }
    const abi = decoded.abis[target];
    const selector = calldata.slice(0, 2 + 4 * 2);
    const f = abi.functions.get(selector);
    if (!f) {
      return [['status', "Selector not found, that's bad"]];
    }
    const args = ethers.utils.defaultAbiCoder.decode(
      [f.format(ethers.utils.FormatTypes.full)],
      addHexPrefix(calldata.slice(2 + 2 * 4))
    )[0];
    return f.inputs.map((v: any, i: any) => [v.format(ethers.utils.FormatTypes.full), args[i]]);
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
