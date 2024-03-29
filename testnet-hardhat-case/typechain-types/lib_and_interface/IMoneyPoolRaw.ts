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
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface IMoneyPoolRawInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addFundWithAction"
      | "clientNonce"
      | "getClientQueueValue"
      | "getInstantWithdrawReserve"
      | "owner"
      | "satisTokenBalance"
      | "totalLockedAssets"
      | "verifyAndQueue"
      | "verifyAndRedeemToken"
      | "verifyAndWithdrawFund"
      | "verifyWorker"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addFundWithAction",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "clientNonce",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getClientQueueValue",
    values: [AddressLike[], AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getInstantWithdrawReserve",
    values: [string[], AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "satisTokenBalance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "totalLockedAssets",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyAndQueue",
    values: [
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyAndRedeemToken",
    values: [
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyAndWithdrawFund",
    values: [
      BytesLike,
      AddressLike,
      AddressLike,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      AddressLike,
      BigNumberish,
      string,
      BigNumberish
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "verifyWorker",
    values: [AddressLike]
  ): string;

  decodeFunctionResult(
    functionFragment: "addFundWithAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "clientNonce",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getClientQueueValue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getInstantWithdrawReserve",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "satisTokenBalance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalLockedAssets",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyAndQueue",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyAndRedeemToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyAndWithdrawFund",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "verifyWorker",
    data: BytesLike
  ): Result;
}

export interface IMoneyPoolRaw extends BaseContract {
  connect(runner?: ContractRunner | null): IMoneyPoolRaw;
  waitForDeployment(): Promise<this>;

  interface: IMoneyPoolRawInterface;

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
      _addValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  clientNonce: TypedContractMethod<
    [_clientAddress: AddressLike],
    [bigint],
    "view"
  >;

  getClientQueueValue: TypedContractMethod<
    [_clientAddressList: AddressLike[], _tokenAddress: AddressLike],
    [bigint[]],
    "view"
  >;

  getInstantWithdrawReserve: TypedContractMethod<
    [_ticketIdList: string[], _tokenAddress: AddressLike],
    [bigint[]],
    "view"
  >;

  owner: TypedContractMethod<[], [string], "view">;

  satisTokenBalance: TypedContractMethod<
    [_tokenAddress: AddressLike],
    [bigint],
    "view"
  >;

  totalLockedAssets: TypedContractMethod<
    [_tokenAddress: AddressLike],
    [bigint],
    "view"
  >;

  verifyAndQueue: TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  verifyAndRedeemToken: TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _redeemValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  verifyAndWithdrawFund: TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  verifyWorker: TypedContractMethod<
    [_workerAddress: AddressLike],
    [boolean],
    "view"
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
      _addValue: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "clientNonce"
  ): TypedContractMethod<[_clientAddress: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getClientQueueValue"
  ): TypedContractMethod<
    [_clientAddressList: AddressLike[], _tokenAddress: AddressLike],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "getInstantWithdrawReserve"
  ): TypedContractMethod<
    [_ticketIdList: string[], _tokenAddress: AddressLike],
    [bigint[]],
    "view"
  >;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "satisTokenBalance"
  ): TypedContractMethod<[_tokenAddress: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalLockedAssets"
  ): TypedContractMethod<[_tokenAddress: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "verifyAndQueue"
  ): TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "verifyAndRedeemToken"
  ): TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _redeemValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "verifyAndWithdrawFund"
  ): TypedContractMethod<
    [
      _targetSignature: BytesLike,
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _withdrawValue: BigNumberish,
      _tier: BigNumberish,
      _chainId: BigNumberish,
      _poolAddress: AddressLike,
      _expBlockNo: BigNumberish,
      _ticketId: string,
      _nonce: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "verifyWorker"
  ): TypedContractMethod<[_workerAddress: AddressLike], [boolean], "view">;

  filters: {};
}
