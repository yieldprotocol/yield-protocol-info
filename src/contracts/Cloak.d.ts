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
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface CloakInterface extends ethers.utils.Interface {
  functions: {
    "LOCK()": FunctionFragment;
    "LOCK8605463013()": FunctionFragment;
    "ROOT()": FunctionFragment;
    "ROOT4146650865()": FunctionFragment;
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
    "setRoleAdmin(bytes4,bytes4)": FunctionFragment;
    "setSource(address)": FunctionFragment;
    "stEthId()": FunctionFragment;
    "wstETH()": FunctionFragment;
    "wstEthId()": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "LOCK", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "LOCK8605463013",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "ROOT", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ROOT4146650865",
    values?: undefined
  ): string;
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
    functionFragment: "setRoleAdmin",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "setSource", values: [string]): string;
  encodeFunctionData(functionFragment: "stEthId", values?: undefined): string;
  encodeFunctionData(functionFragment: "wstETH", values?: undefined): string;
  encodeFunctionData(functionFragment: "wstEthId", values?: undefined): string;

  decodeFunctionResult(functionFragment: "LOCK", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "LOCK8605463013",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ROOT", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "ROOT4146650865",
    data: BytesLike
  ): Result;
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
  decodeFunctionResult(
    functionFragment: "setRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setSource", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "stEthId", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wstETH", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "wstEthId", data: BytesLike): Result;

  events: {
    "RoleAdminChanged(bytes4,bytes4)": EventFragment;
    "RoleGranted(bytes4,address,address)": EventFragment;
    "RoleRevoked(bytes4,address,address)": EventFragment;
    "SourceSet(address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "RoleAdminChanged"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleGranted"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "RoleRevoked"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SourceSet"): EventFragment;
}

export type RoleAdminChangedEvent = TypedEvent<
  [string, string] & { role: string; newAdminRole: string }
>;

export type RoleGrantedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type RoleRevokedEvent = TypedEvent<
  [string, string, string] & { role: string; account: string; sender: string }
>;

export type SourceSetEvent = TypedEvent<[string] & { wstETH: string }>;

export class Cloak extends BaseContract {
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

  interface: CloakInterface;

  functions: {
    LOCK(overrides?: CallOverrides): Promise<[string]>;

    LOCK8605463013(overrides?: CallOverrides): Promise<[string]>;

    ROOT(overrides?: CallOverrides): Promise<[string]>;

    ROOT4146650865(overrides?: CallOverrides): Promise<[string]>;

    get(
      base: BytesLike,
      quote: BytesLike,
      baseAmount: BigNumberish,
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
      baseAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { quoteAmount: BigNumber; updateTime: BigNumber }
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

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setSource(
      wstETH_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    stEthId(overrides?: CallOverrides): Promise<[string]>;

    wstETH(overrides?: CallOverrides): Promise<[string]>;

    wstEthId(overrides?: CallOverrides): Promise<[string]>;
  };

  LOCK(overrides?: CallOverrides): Promise<string>;

  LOCK8605463013(overrides?: CallOverrides): Promise<string>;

  ROOT(overrides?: CallOverrides): Promise<string>;

  ROOT4146650865(overrides?: CallOverrides): Promise<string>;

  get(
    base: BytesLike,
    quote: BytesLike,
    baseAmount: BigNumberish,
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
    baseAmount: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber] & { quoteAmount: BigNumber; updateTime: BigNumber }
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

  setRoleAdmin(
    role: BytesLike,
    adminRole: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setSource(
    wstETH_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  stEthId(overrides?: CallOverrides): Promise<string>;

  wstETH(overrides?: CallOverrides): Promise<string>;

  wstEthId(overrides?: CallOverrides): Promise<string>;

  callStatic: {
    LOCK(overrides?: CallOverrides): Promise<string>;

    LOCK8605463013(overrides?: CallOverrides): Promise<string>;

    ROOT(overrides?: CallOverrides): Promise<string>;

    ROOT4146650865(overrides?: CallOverrides): Promise<string>;

    get(
      base: BytesLike,
      quote: BytesLike,
      baseAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { quoteAmount: BigNumber; updateTime: BigNumber }
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
      baseAmount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber] & { quoteAmount: BigNumber; updateTime: BigNumber }
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

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;

    setSource(wstETH_: string, overrides?: CallOverrides): Promise<void>;

    stEthId(overrides?: CallOverrides): Promise<string>;

    wstETH(overrides?: CallOverrides): Promise<string>;

    wstEthId(overrides?: CallOverrides): Promise<string>;
  };

  filters: {
    "RoleAdminChanged(bytes4,bytes4)"(
      role?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string],
      { role: string; newAdminRole: string }
    >;

    RoleAdminChanged(
      role?: BytesLike | null,
      newAdminRole?: BytesLike | null
    ): TypedEventFilter<
      [string, string],
      { role: string; newAdminRole: string }
    >;

    "RoleGranted(bytes4,address,address)"(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    RoleGranted(
      role?: BytesLike | null,
      account?: string | null,
      sender?: string | null
    ): TypedEventFilter<
      [string, string, string],
      { role: string; account: string; sender: string }
    >;

    "RoleRevoked(bytes4,address,address)"(
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

    "SourceSet(address)"(
      wstETH?: null
    ): TypedEventFilter<[string], { wstETH: string }>;

    SourceSet(wstETH?: null): TypedEventFilter<[string], { wstETH: string }>;
  };

  estimateGas: {
    LOCK(overrides?: CallOverrides): Promise<BigNumber>;

    LOCK8605463013(overrides?: CallOverrides): Promise<BigNumber>;

    ROOT(overrides?: CallOverrides): Promise<BigNumber>;

    ROOT4146650865(overrides?: CallOverrides): Promise<BigNumber>;

    get(
      base: BytesLike,
      quote: BytesLike,
      baseAmount: BigNumberish,
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
      baseAmount: BigNumberish,
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

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setSource(
      wstETH_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    stEthId(overrides?: CallOverrides): Promise<BigNumber>;

    wstETH(overrides?: CallOverrides): Promise<BigNumber>;

    wstEthId(overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    LOCK(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    LOCK8605463013(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROOT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    ROOT4146650865(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    get(
      base: BytesLike,
      quote: BytesLike,
      baseAmount: BigNumberish,
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
      baseAmount: BigNumberish,
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

    setRoleAdmin(
      role: BytesLike,
      adminRole: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setSource(
      wstETH_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    stEthId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wstETH(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    wstEthId(overrides?: CallOverrides): Promise<PopulatedTransaction>;
  };
}
