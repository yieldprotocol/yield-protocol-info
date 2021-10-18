import { useState } from 'react';
import { FunctionFragment, Interface } from '@ethersproject/abi';
import { ethers } from 'ethers';
import { addHexPrefix, fetchEtherscan } from '../utils/etherscan';
import * as yieldEnv from '../yieldEnv.json';
import { NETWORK_LABEL } from '../config/networks';
import { useAppSelector } from '../state/hooks/general';


const useProposalHashDecoder = (proposalHash: string) => {
  const PROPOSE_EVENT="0x2de9aefe888ee33e88ff8f7de007bdda112b7b6a4d0b1cd88690e805920d4091"
  const PROPOSE_ARGUMENTS="tuple(address target, bytes data)[]"

  const chainId = useAppSelector((st) => st.chain.chainId);
  const network = NETWORK_LABEL[chainId]?.toLowerCase();
  const ADDRESS_TIMELOCK = (yieldEnv.addresses as any)[chainId].Timelock;
  const [loading, setLoading] = useState(false);
  const [finalCall, setFinalCall] = useState<any>();
  const [txHash, setTxHash] = useState<any>();
  const [calls, setCalls] = useState<any>();
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
    console.log(`selector found: ${f}`);
    console.log(`args calldata found: ${addHexPrefix(calldata.slice(2 + 2 * 4))}`);
    return [f, addHexPrefix(calldata.slice(2 + 2 * 4))];
  }

  async function getABI(target: string) {
    if (target in decoded.abis) return decoded.abis[target];
    const ret = await fetchEtherscan(
      network,
      new URLSearchParams({
        module: 'contract',
        action: 'getsourcecode',
        address: addHexPrefix(target),
        "apikey": "9C6JHFW1HK4TXJRF3WBWIMJMBYZ7NCW6AS",
      }),
      (x) => console.log(x)
    );
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

    setDecoded({
      ...decoded,
      contract: {
        ...decoded.contracts,
        [target]: ret.ContractName,
      },
      abis: {
        ...decoded.abis,
        [target]: result,
      },
    });
    return result;
  }

  class Call {
    method?: string;

    argProps?: any[];

    arguments: (string|Call)[] = [];

    constructor(readonly to: string, readonly calldata: string) {
    }

    resolve(_method: string, _arguments: (string|Call)[], _argProps: any[]) {
      this.method = _method;
      this.arguments = _arguments;
      this.argProps = _argProps;
    }

    toPrettyJson() {
      return { "function": `${this.method} [${this.to}]`, "arguments": this.arguments };
    }
  }


  async function resolveCall(call: Call) {
    const abi = await getABI(call.to);

    const [func, argsCalldata] = await getFunction(abi, call.calldata);

    let _args: any = ethers.utils.defaultAbiCoder.decode(
      func.inputs.map((p: any) => p.format()),
      argsCalldata
    );

    // @marco - Help!
    const ladles = ["0xeD5D1c6A66EE2c39bac78EE896ef66f5A85d6e68", "0x5840069B175D3EEa154C58b065edC06095bB9217"]
    // if (ethers.utils.getAddress(call.to) === ethers.utils.getAddress(ADDRESS_LADLE) && func.name === 'batch') {
      if (ladles.includes(ethers.utils.getAddress(call.to)) && func.name === 'batch') {
      _args = [_args[0].map((x: any) => (new Call(call.to, x)))];
      console.log('args', _args);
      await Promise.all(_args[0].map((x: any) => resolveCall(x)));
    } else if (
      ladles.includes(ethers.utils.getAddress(call.to)) &&
      func.name === 'route'
    ) {
      _args = [new Call(_args[0], _args[1])];
      await resolveCall(_args[0]);
    } else {
      _args = _args.map((x: any) => x.toString());
    }
    call.resolve(func.name, _args, func.inputs.map((i: any) => ({ name: i.name, type: i.type })))
    return call;
  };

  async function startFetchingABIs(targets: any) {
    // eslint-disable-next-line guard-for-in
    const promises = []
    for (const target of targets) {
      if (!(target in decoded.abis)) {
        // eslint-disable-next-line guard-for-in
        promises.push(fetchEtherscan(network, new URLSearchParams({
          "module": "contract",
          "action": "getsourcecode",
          "address": addHexPrefix(target),
          "apikey": "9C6JHFW1HK4TXJRF3WBWIMJMBYZ7NCW6AS"
        }), (x) => console.log(x)).then((ret: any) => {
          const result = ret.result[0];
          const iface = new Interface(result.ABI);
          const functions = new Map<string, FunctionFragment>();
          // eslint-disable-next-line guard-for-in
          for (const f in iface.functions) {
            functions.set(iface.getSighash(iface.functions[f]), iface.functions[f]);
          }
          const newResult = {
            interface: iface,
            functions
          }
          setDecoded({
            ...decoded,
            contract: {
              ...decoded.contracts,
              [target]: result.ContractName,
            },
            abis: {
              ...decoded.abis,
              [target]: newResult,
            },
          });
        }));
      }
    }
    Promise.all(promises).then(()=>{
      console.log("ABIs fetched");
    })
  }

  async function decodeTxHash(epoch: string, hash: string) {
    const tx = await ethers.getDefaultProvider(network === 'ethereum' ? 'mainnet' : network).getTransaction(hash);
    const input = tx.data;
    const callsArr = ethers.utils.defaultAbiCoder.decode([PROPOSE_ARGUMENTS], addHexPrefix(input.slice(2 + 4 * 2)))[0];
    // 0x4a6c405fad393b24f0fd889bb8ae715b3fcca1f0a12c9ae079d072958c9dbbc7
    const newCalls = [epoch,
      callsArr.map((call: any) => ({
          target: call.target,
          data: call.data
        }))];

    setCalls(newCalls);

    await startFetchingABIs(new Set(callsArr.map((call:any) => call.target)));
  }

  async function decodeHash(hash: string) {
    try {
      const tx:any = (await fetchEtherscan(network, new URLSearchParams({
        "module": "logs",
        "action": "getLogs",
        "address": addHexPrefix(ADDRESS_TIMELOCK),
        "topic0": addHexPrefix(PROPOSE_EVENT),
        "topic1": addHexPrefix(hash),
        "apikey": "9C6JHFW1HK4TXJRF3WBWIMJMBYZ7NCW6AS"
      }), (x) => console.log(x)));

      console.log('txtxtxtxtxtxtx', tx)

      const txHashArray: Array<any> = tx.result

      if (txHashArray.length == 0) {
        throw Error("Failed to find Proposal hash");
      } else if (txHashArray.length > 1) {
        console.warn("Found more than 1 transaction with the same proposal hash; decoding the last one");
      }
      const txnHash = txHashArray[0].transactionHash;
      console.log('txnHash', txnHash)

      console.log('proposalHash', proposalHash)
      console.log('txHash', txHash)
      if (txHash === undefined || proposalHash === hash) {
        console.log('hoagies')
        setTxHash([hash, txnHash]);
        await decodeTxHash(hash, txnHash);
      }
    } catch (ex) {
      console.log(ex);
    }
    return false;
  }

  async function decodeProposalHash() {
    setLoading(true);
    await decodeHash(proposalHash);
    // try {
    //   const tx = await ethers.getDefaultProvider(network).getTransaction(txHash);
    //   if (!tx.to) {
    //     console.log(`Transaction without address: ${tx}`);
    //     return;
    //   }
    //   const call = new Call(tx.to, tx.data);
    //   await resolveCall(call);
    //   setLoading(false);
    // setFinalCall(call)

    // } catch (e) {
    //   setLoading(false);
    //   console.log('error getting decoded data');
    //   console.log(e);
    // }
  }
  return { decodeProposalHash, loading, txHash, calls };
};

export { useProposalHashDecoder };
