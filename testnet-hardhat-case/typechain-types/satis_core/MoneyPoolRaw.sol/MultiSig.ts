/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export interface MultiSigInterface extends Interface {
  getFunction(
    nameOrSignature: "test_verifySignature" | "verifySignature"
  ): FunctionFragment;

  getEvent(nameOrSignatureOrTopic: "Debug"): EventFragment;

  encodeFunctionData(
    functionFragment: "test_verifySignature",
    values: [
      AddressLike,
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "verifySignature",
    values: [
      AddressLike,
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish
    ]
  ): string;

  decodeFunctionResult(
    functionFragment: "test_verifySignature",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifySignature",
    data: BytesLike
  ): Result;
}

export namespace DebugEvent {
  export type InputTuple = [msg: string];
  export type OutputTuple = [msg: string];
  export interface OutputObject {
    msg: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface MultiSig extends BaseContract {
  connect(runner?: ContractRunner | null): MultiSig;
  waitForDeployment(): Promise<this>;

  interface: MultiSigInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  test_verifySignature: TypedContractMethod<
    [
      _targetAddress: AddressLike,
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _nonce: BigNumberish
    ],
    [string],
    "view"
  >;

  verifySignature: TypedContractMethod<
    [
      _targetAddress: AddressLike,
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _nonce: BigNumberish
    ],
    [boolean],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "test_verifySignature"
  ): TypedContractMethod<
    [
      _targetAddress: AddressLike,
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _nonce: BigNumberish
    ],
    [string],
    "view"
  >;
  getFunction(
    nameOrSignature: "verifySignature"
  ): TypedContractMethod<
    [
      _targetAddress: AddressLike,
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _nonce: BigNumberish
    ],
    [boolean],
    "view"
  >;

  getEvent(
    key: "Debug"
  ): TypedContractEvent<
    DebugEvent.InputTuple,
    DebugEvent.OutputTuple,
    DebugEvent.OutputObject
  >;

  filters: {
    "Debug(string)": TypedContractEvent<
      DebugEvent.InputTuple,
      DebugEvent.OutputTuple,
      DebugEvent.OutputObject
    >;
    Debug: TypedContractEvent<
      DebugEvent.InputTuple,
      DebugEvent.OutputTuple,
      DebugEvent.OutputObject
    >;
  };
}
