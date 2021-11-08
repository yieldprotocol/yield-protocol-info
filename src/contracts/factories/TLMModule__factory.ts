/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { TLMModule, TLMModuleInterface } from "../TLMModule";

const _abi = [
  {
    inputs: [
      {
        internalType: "contract ICauldron",
        name: "cauldron_",
        type: "address",
      },
      {
        internalType: "contract IWETH9",
        name: "weth_",
        type: "address",
      },
      {
        internalType: "contract DssTlmAbstract",
        name: "tlm_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    name: "FeeSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "integration",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "set",
        type: "bool",
      },
    ],
    name: "IntegrationAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "assetId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "join",
        type: "address",
      },
    ],
    name: "JoinAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "module",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "set",
        type: "bool",
      },
    ],
    name: "ModuleAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "address",
        name: "pool",
        type: "address",
      },
    ],
    name: "PoolAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "ilk",
        type: "bytes32",
      },
    ],
    name: "SeriesRegistered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        indexed: true,
        internalType: "bool",
        name: "set",
        type: "bool",
      },
    ],
    name: "TokenAdded",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "borrowingFee",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "cauldron",
    outputs: [
      {
        internalType: "contract ICauldron",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "integrations",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "joins",
    outputs: [
      {
        internalType: "contract IJoin",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "modules",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "pools",
    outputs: [
      {
        internalType: "contract IPool",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "bytes32",
        name: "ilk",
        type: "bytes32",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "router",
    outputs: [
      {
        internalType: "contract Router",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "seriesId",
        type: "bytes6",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "fyDaiToSell",
        type: "uint256",
      },
    ],
    name: "sell",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes6",
        name: "",
        type: "bytes6",
      },
    ],
    name: "seriesToIlk",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tlm",
    outputs: [
      {
        internalType: "contract DssTlmAbstract",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tlmModule",
    outputs: [
      {
        internalType: "contract TLMModule",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokens",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "weth",
    outputs: [
      {
        internalType: "contract IWETH9",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class TLMModule__factory {
  static readonly abi = _abi;
  static createInterface(): TLMModuleInterface {
    return new utils.Interface(_abi) as TLMModuleInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TLMModule {
    return new Contract(address, _abi, signerOrProvider) as TLMModule;
  }
}
