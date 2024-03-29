/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  ISigmaAction,
  ISigmaActionInterface,
} from "../../lib_and_interface/ISigmaAction";

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
    name: "sigmaAddFundWithAction",
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
        internalType: "string",
        name: "_ticketId",
        type: "string",
      },
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
    ],
    name: "sigmaQueueWithdraw",
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
        name: "_redeemValue",
        type: "uint256",
      },
    ],
    name: "sigmaVerifyAndRedeemToken",
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
        internalType: "string",
        name: "_ticketId",
        type: "string",
      },
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
    ],
    name: "sigmaWithdrawFund",
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

export class ISigmaAction__factory {
  static readonly abi = _abi;
  static createInterface(): ISigmaActionInterface {
    return new Interface(_abi) as ISigmaActionInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): ISigmaAction {
    return new Contract(address, _abi, runner) as unknown as ISigmaAction;
  }
}
