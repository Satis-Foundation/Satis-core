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

export interface IActionInterface extends Interface {
  getFunction(
    nameOrSignature: "addFundWithAction" | "queueWithdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "addFundWithAction",
    values: [AddressLike, AddressLike, BigNumberish, string]
  ): string;
  encodeFunctionData(
    functionFragment: "queueWithdraw",
    values: [AddressLike, AddressLike, BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "addFundWithAction",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "queueWithdraw",
    data: BytesLike
  ): Result;
}

export interface IAction extends BaseContract {
  connect(runner?: ContractRunner | null): IAction;
  waitForDeployment(): Promise<this>;

  interface: IActionInterface;

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

  queueWithdraw: TypedContractMethod<
    [
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish,
      _tier: BigNumberish
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
    nameOrSignature: "queueWithdraw"
  ): TypedContractMethod<
    [
      _clientAddress: AddressLike,
      _tokenAddress: AddressLike,
      _tokenValue: BigNumberish,
      _tier: BigNumberish
    ],
    [boolean],
    "nonpayable"
  >;

  filters: {};
}
