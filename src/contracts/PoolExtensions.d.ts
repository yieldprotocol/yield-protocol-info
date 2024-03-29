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
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface PoolExtensionsInterface extends ethers.utils.Interface {
  functions: {
    "invariant(IPool)": FunctionFragment;
    "maxBaseIn(IPool)": FunctionFragment;
    "maxBaseOut(IPool)": FunctionFragment;
    "maxFYTokenIn(IPool)": FunctionFragment;
    "maxFYTokenOut(IPool)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "invariant", values: [string]): string;
  encodeFunctionData(functionFragment: "maxBaseIn", values: [string]): string;
  encodeFunctionData(functionFragment: "maxBaseOut", values: [string]): string;
  encodeFunctionData(
    functionFragment: "maxFYTokenIn",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "maxFYTokenOut",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "invariant", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxBaseIn", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "maxBaseOut", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "maxFYTokenIn",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "maxFYTokenOut",
    data: BytesLike
  ): Result;

  events: {};
}

export class PoolExtensions extends BaseContract {
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

  interface: PoolExtensionsInterface;

  functions: {
    invariant(pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxBaseIn(pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxBaseOut(pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxFYTokenIn(pool: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    maxFYTokenOut(
      pool: string,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  invariant(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxBaseIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxBaseOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxFYTokenIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

  maxFYTokenOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

  callStatic: {
    invariant(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxBaseIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxBaseOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxFYTokenIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxFYTokenOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    invariant(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxBaseIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxBaseOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxFYTokenIn(pool: string, overrides?: CallOverrides): Promise<BigNumber>;

    maxFYTokenOut(pool: string, overrides?: CallOverrides): Promise<BigNumber>;
  };

  populateTransaction: {
    invariant(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxBaseIn(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxBaseOut(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxFYTokenIn(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    maxFYTokenOut(
      pool: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}
