/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IAction,
  IActionInterface,
} from "../../lib_and_interface/IAction";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_clientAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenValue",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_data",
        type: "string",
      },
    ],
    name: "addFundWithAction",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_clientAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_tokenValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
    ],
    name: "queueWithdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export class IAction__factory {
  static readonly abi = _abi;
  static createInterface(): IActionInterface {
    return new Interface(_abi) as IActionInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): IAction {
    return new Contract(address, _abi, runner) as unknown as IAction;
  }
}
