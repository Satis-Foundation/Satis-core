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
} from "../common";

export interface ActionInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addFundWithAction"
      | "owner"
      | "proxy"
      | "queueWithdraw"
      | "transferOwnership"
      | "updateProxyAddress"
      | "withdrawFund"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "ChangeOwnership"
      | "ChangeProxy"
      | "Queue"
      | "TransferIn"
      | "Withdraw"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addFundWithAction",
    values: [AddressLike, AddressLike, BigNumberish, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(functionFragment: "proxy", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "queueWithdraw",
    values: [string, AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "updateProxyAddress",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawFund",
    values: [string, AddressLike, AddressLike, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addFundWithAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "proxy", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "queueWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "updateProxyAddress",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "withdrawFund",
    data: BytesLike
  ): Result;
}

export namespace ChangeOwnershipEvent {
  export type InputTuple = [newOwner: AddressLike];
  export type OutputTuple = [newOwner: string];
  export interface OutputObject {
    newOwner: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ChangeProxyEvent {
  export type InputTuple = [newProxy: AddressLike];
  export type OutputTuple = [newProxy: string];
  export interface OutputObject {
    newProxy: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace QueueEvent {
  export type InputTuple = [
    ticketId: string,
    clientAddress: AddressLike,
    tokenAddress: AddressLike,
    queueValue: BigNumberish
  ];
  export type OutputTuple = [
    ticketId: string,
    clientAddress: string,
    tokenAddress: string,
    queueValue: bigint
  ];
  export interface OutputObject {
    ticketId: string;
    clientAddress: string;
    tokenAddress: string;
    queueValue: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferInEvent {
  export type InputTuple = [
    clientAddress: AddressLike,
    tokenAddress: AddressLike,
    transactionValue: BigNumberish,
    data: string
  ];
  export type OutputTuple = [
    clientAddress: string,
    tokenAddress: string,
    transactionValue: bigint,
    data: string
  ];
  export interface OutputObject {
    clientAddress: string;
    tokenAddress: string;
    transactionValue: bigint;
    data: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace WithdrawEvent {
  export type InputTuple = [
    ticketId: string,
    clientAddress: AddressLike,
    tokenAddress: AddressLike,
    withdrawValue: BigNumberish
  ];
  export type OutputTuple = [
    ticketId: string,
    clientAddress: string,
    tokenAddress: string,
    withdrawValue: bigint
  ];
  export interface OutputObject {
    ticketId: string;
    clientAddress: string;
    tokenAddress: string;
    withdrawValue: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface Action extends BaseContract {
  connect(runner?: ContractRunner | null): Action;
  waitForDeployment(): Promise<this>;

  interface: ActionInterface;

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

  addFundWithAction: TypedContractMethod<
    [
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish,
      _data: string
    ],
    [boolean],
    "nonpayable"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  proxy: TypedContractMethod<[], [string], "view">;

  queueWithdraw: TypedContractMethod<
    [
      _ticketId: string,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  transferOwnership: TypedContractMethod<
    [_newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  updateProxyAddress: TypedContractMethod<
    [_newProxyAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  withdrawFund: TypedContractMethod<
    [
      _ticketId: string,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addFundWithAction"
  ): TypedContractMethod<
    [
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish,
      _data: string
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "proxy"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "queueWithdraw"
  ): TypedContractMethod<
    [
      _ticketId: string,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwnership"
  ): TypedContractMethod<[_newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "updateProxyAddress"
  ): TypedContractMethod<[_newProxyAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "withdrawFund"
  ): TypedContractMethod<
    [
      _ticketId: string,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  getEvent(
    key: "ChangeOwnership"
  ): TypedContractEvent<
    ChangeOwnershipEvent.InputTuple,
    ChangeOwnershipEvent.OutputTuple,
    ChangeOwnershipEvent.OutputObject
  >;
  getEvent(
    key: "ChangeProxy"
  ): TypedContractEvent<
    ChangeProxyEvent.InputTuple,
    ChangeProxyEvent.OutputTuple,
    ChangeProxyEvent.OutputObject
  >;
  getEvent(
    key: "Queue"
  ): TypedContractEvent<
    QueueEvent.InputTuple,
    QueueEvent.OutputTuple,
    QueueEvent.OutputObject
  >;
  getEvent(
    key: "TransferIn"
  ): TypedContractEvent<
    TransferInEvent.InputTuple,
    TransferInEvent.OutputTuple,
    TransferInEvent.OutputObject
  >;
  getEvent(
    key: "Withdraw"
  ): TypedContractEvent<
    WithdrawEvent.InputTuple,
    WithdrawEvent.OutputTuple,
    WithdrawEvent.OutputObject
  >;

  filters: {
    "ChangeOwnership(address)": TypedContractEvent<
      ChangeOwnershipEvent.InputTuple,
      ChangeOwnershipEvent.OutputTuple,
      ChangeOwnershipEvent.OutputObject
    >;
    ChangeOwnership: TypedContractEvent<
      ChangeOwnershipEvent.InputTuple,
      ChangeOwnershipEvent.OutputTuple,
      ChangeOwnershipEvent.OutputObject
    >;

    "ChangeProxy(address)": TypedContractEvent<
      ChangeProxyEvent.InputTuple,
      ChangeProxyEvent.OutputTuple,
      ChangeProxyEvent.OutputObject
    >;
    ChangeProxy: TypedContractEvent<
      ChangeProxyEvent.InputTuple,
      ChangeProxyEvent.OutputTuple,
      ChangeProxyEvent.OutputObject
    >;

    "Queue(string,address,address,uint256)": TypedContractEvent<
      QueueEvent.InputTuple,
      QueueEvent.OutputTuple,
      QueueEvent.OutputObject
    >;
    Queue: TypedContractEvent<
      QueueEvent.InputTuple,
      QueueEvent.OutputTuple,
      QueueEvent.OutputObject
    >;

    "TransferIn(address,address,uint256,string)": TypedContractEvent<
      TransferInEvent.InputTuple,
      TransferInEvent.OutputTuple,
      TransferInEvent.OutputObject
    >;
    TransferIn: TypedContractEvent<
      TransferInEvent.InputTuple,
      TransferInEvent.OutputTuple,
      TransferInEvent.OutputObject
    >;

    "Withdraw(string,address,address,uint256)": TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
    Withdraw: TypedContractEvent<
      WithdrawEvent.InputTuple,
      WithdrawEvent.OutputTuple,
      WithdrawEvent.OutputObject
    >;
  };
}
