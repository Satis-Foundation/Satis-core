/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Interface, type ContractRunner } from "ethers";
import type {
  IMoneyPoolRaw,
  IMoneyPoolRawInterface,
} from "../../lib_and_interface/IMoneyPoolRaw";

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
        name: "_addValue",
        type: "uint256",
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
    ],
    name: "clientNonce",
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
    inputs: [
      {
        internalType: "address[]",
        name: "_clientAddressList",
        type: "address[]",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "getClientQueueValue",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string[]",
        name: "_ticketIdList",
        type: "string[]",
      },
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "getInstantWithdrawReserve",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
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
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "satisTokenBalance",
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
    inputs: [
      {
        internalType: "address",
        name: "_tokenAddress",
        type: "address",
      },
    ],
    name: "totalLockedAssets",
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
    inputs: [
      {
        internalType: "bytes",
        name: "_targetSignature",
        type: "bytes",
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
        name: "_withdrawValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_poolAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expBlockNo",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ticketId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256",
      },
    ],
    name: "verifyAndQueue",
    outputs: [
      {
        internalType: "bool",
        name: "_isDone",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_targetSignature",
        type: "bytes",
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
        name: "_redeemValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_poolAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expBlockNo",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ticketId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256",
      },
    ],
    name: "verifyAndRedeemToken",
    outputs: [
      {
        internalType: "bool",
        name: "_isDone",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "_targetSignature",
        type: "bytes",
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
        name: "_withdrawValue",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_tier",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_chainId",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_poolAddress",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_expBlockNo",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_ticketId",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_nonce",
        type: "uint256",
      },
    ],
    name: "verifyAndWithdrawFund",
    outputs: [
      {
        internalType: "bool",
        name: "_isDone",
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
        name: "_workerAddress",
        type: "address",
      },
    ],
    name: "verifyWorker",
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
] as const;

export class IMoneyPoolRaw__factory {
  static readonly abi = _abi;
  static createInterface(): IMoneyPoolRawInterface {
    return new Interface(_abi) as IMoneyPoolRawInterface;
  }
  static connect(
    address: string,
    runner?: ContractRunner | null
  ): IMoneyPoolRaw {
    return new Contract(address, _abi, runner) as unknown as IMoneyPoolRaw;
  }
}
