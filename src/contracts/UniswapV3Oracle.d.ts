/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface UniswapV3OracleInterface extends ethers.utils.Interface {
  functions: {
    "LOCK()": FunctionFragment;
    "ROOT()": FunctionFragment;
    "decimals()": FunctionFragment;
    "get(bytes32,bytes32,uint256)": FunctionFragment;
    "getRoleAdmin(bytes4)": FunctionFragment;
    "grantRole(bytes4,address)": FunctionFragment;
    "grantRoles(bytes4[],address)": FunctionFragment;
    "hasRole(bytes4,address)": FunctionFragment;
    "lockRole(bytes4)": FunctionFragment;
    "peek(bytes32,bytes32,uint256)": FunctionFragment;
    "renounceRole(bytes4,address)": FunctionFragment;
    "revokeRole(bytes4,address)": FunctionFragment;
    "revokeRoles(bytes4[],address)": FunctionFragment;
    "secondsAgo()": FunctionFragment;
    "setRoleAdmin(bytes4,bytes4)": FunctionFragment;
    "setSecondsAgo(uint32)": FunctionFragment;
    "setSource(bytes6,bytes6,address)": FunctionFragment;
    "setSources(bytes6[],bytes6[],address[])": FunctionFragment;
    "sources(bytes6,bytes6)": FunctionFragment;
    "sourcesData(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "LOCK", values?: undefined): string;
  encodeFunctionData(functionFragment: "ROOT", values?: undefined): string;
  encodeFunctionData(functionFragment: "decimals", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "get",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRoles",
    values: [BytesLike[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(functionFragment: "lockRole", values: [BytesLike]): string;
  encodeFunctionData(
    functionFragment: "peek",
    values: [BytesLike, BytesLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRoles",
    values: [BytesLike[], string]
  ): string;
  encodeFunctionData(
    functionFragment: "secondsAgo",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setRoleAdmin",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setSecondsAgo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setSource",
    values: [BytesLike, BytesLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "setSources",
    values: [BytesLike[], BytesLike[], string[]]
  ): string;
  encodeFunctionData(
    functionFragment: "sources",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "sourcesData", values: [string]): string;

  decodeFunctionResult(functionFragment: "LOCK", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ROOT", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "decimals", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "get", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "grantRoles", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "lockRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "peek", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "revokeRoles",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "secondsAgo", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSecondsAgo",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSource", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "setSources", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "sources", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "sourcesData",
    data: BytesLike
  ): Result;

  events: {
    "RoleAdminChanged(bytes4,bytes4)": EventFragment;
    "RoleGranted(bytes4,address,address)": EventFragment;
    "RoleRevoked(bytes4,address,address)": EventFragment;
    "SecondsAgoSet(uint32)": EventFragment;
    "SourceSet(bytes6,bytes6,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SecondsAgoSet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SourceSet"): EventFragment;
}

export class UniswapV3Oracle extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: UniswapV3OracleInterface;

  functions: {
    LOCK(overrides?: CallOverrides): Promise<[string]>;

    ROOT(overrides?: CallOverrides): Promise<[string]>;

    decimals(overrides?: CallOverrides): Promise<[number]>;

    get(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<[string]>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    grantRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<[boolean]>;

    lockRole(
      role: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    peek(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { value: BigNumber; updateTime: BigNumber }
    >;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    revokeRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    secondsAgo(overrides?: CallOverrides): Promise<[number]>;

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSecondsAgo(
      secondsAgo_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSource(
      base: BytesLike,
      quote: BytesLike,
      source: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSources(
      bases: BytesLike[],
      quotes: BytesLike[],
      sources_: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    sources(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { source: string; inverse: boolean }>;

    sourcesData(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, number] & {
        factory: string;
        baseToken: string;
        quoteToken: string;
        fee: number;
      }
    >;
  };

  LOCK(overrides?: CallOverrides): Promise<string>;

  ROOT(overrides?: CallOverrides): Promise<string>;

  decimals(overrides?: CallOverrides): Promise<number>;

  get(
    base: BytesLike,
    quote: BytesLike,
    amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

  grantRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  grantRoles(
    roles: BytesLike[],
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  hasRole(
    role: BytesLike,
    account: string,
    overrides?: CallOverrides
  ): Promise<boolean>;

  lockRole(
    role: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  peek(
    base: BytesLike,
    quote: BytesLike,
    amount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { value: BigNumber; updateTime: BigNumber }
  >;

  renounceRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRole(
    role: BytesLike,
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  revokeRoles(
    roles: BytesLike[],
    account: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  secondsAgo(overrides?: CallOverrides): Promise<number>;

  setRoleAdmin(
    role: BytesLike,
    adminRole: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSecondsAgo(
    secondsAgo_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSource(
    base: BytesLike,
    quote: BytesLike,
    source: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSources(
    bases: BytesLike[],
    quotes: BytesLike[],
    sources_: string[],
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  sources(
    arg0: BytesLike,
    arg1: BytesLike,
    overrides?: CallOverrides
  ): Promise<[string, boolean] & { source: string; inverse: boolean }>;

  sourcesData(
    arg0: string,
    overrides?: CallOverrides
  ): Promise<
    [string, string, string, number] & {
      factory: string;
      baseToken: string;
      quoteToken: string;
      fee: number;
    }
  >;

  callStatic: {
    LOCK(overrides?: CallOverrides): Promise<string>;

    ROOT(overrides?: CallOverrides): Promise<string>;

    decimals(overrides?: CallOverrides): Promise<number>;

    get(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { value: BigNumber; updateTime: BigNumber }
    >;

    getRoleAdmin(role: BytesLike, overrides?: CallOverrides): Promise<string>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    grantRoles(
      roles: BytesLike[],
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<boolean>;

    lockRole(role: BytesLike, overrides?: CallOverrides): Promise<void>;

    peek(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { value: BigNumber; updateTime: BigNumber }
    >;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    revokeRoles(
      roles: BytesLike[],
      account: string,
      overrides?: CallOverrides
    ): Promise<void>;

    secondsAgo(overrides?: CallOverrides): Promise<number>;

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setSecondsAgo(
      secondsAgo_: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;

    setSource(
      base: BytesLike,
      quote: BytesLike,
      source: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setSources(
      bases: BytesLike[],
      quotes: BytesLike[],
      sources_: string[],
      overrides?: CallOverrides
    ): Promise<void>;

    sources(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<[string, boolean] & { source: string; inverse: boolean }>;

    sourcesData(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<
      [string, string, string, number] & {
        factory: string;
        baseToken: string;
        quoteToken: string;
        fee: number;
      }
    >;
  };

  filters: {
    RoleAdminChanged(
      role?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string],
      { role: string; newAdminRole: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleRevoked(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    SecondsAgoSet(
      secondsAgo?: BigNumberish | null
    ): TypedEventFilter<[number], { secondsAgo: number }>;

    SourceSet(
      base?: BytesLike | null,
      quote?: BytesLike | null,
      source?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { base: string; quote: string; source: string }
    >;
  };

  estimateGas: {
    LOCK(overrides?: CallOverrides): Promise<BigNumber>;

    ROOT(overrides?: CallOverrides): Promise<BigNumber>;

    decimals(overrides?: CallOverrides): Promise<BigNumber>;

    get(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    grantRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    lockRole(
      role: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    peek(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    revokeRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    secondsAgo(overrides?: CallOverrides): Promise<BigNumber>;

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSecondsAgo(
      secondsAgo_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSource(
      base: BytesLike,
      quote: BytesLike,
      source: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSources(
      bases: BytesLike[],
      quotes: BytesLike[],
      sources_: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    sources(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    sourcesData(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    LOCK(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROOT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    decimals(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    get(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    getRoleAdmin(
      role: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    grantRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    grantRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    hasRole(
      role: BytesLike,
      account: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    lockRole(
      role: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    peek(
      base: BytesLike,
      quote: BytesLike,
      amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    renounceRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRole(
      role: BytesLike,
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    revokeRoles(
      roles: BytesLike[],
      account: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    secondsAgo(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSecondsAgo(
      secondsAgo_: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSource(
      base: BytesLike,
      quote: BytesLike,
      source: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSources(
      bases: BytesLike[],
      quotes: BytesLike[],
      sources_: string[],
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    sources(
      arg0: BytesLike,
      arg1: BytesLike,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    sourcesData(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
