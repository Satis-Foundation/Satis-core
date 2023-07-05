/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Contract,
  ContractFactory,
  ContractTransactionResponse,
  Interface,
} from "ethers";
import type {
  Signer,
  AddressLike,
  ContractDeployTransaction,
  ContractRunner,
} from "ethers";
import type { NonPayableOverrides } from "../../common";
import type {
  SigmaAction,
  SigmaActionInterface,
} from "../../sigma_mining/SigmaAction";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_initialProxyAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "ChangeOwnership",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "newSigmaProxy",
        type: "address",
      },
    ],
    name: "ChangeSigmaProxy",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "clientAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "queueValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tier",
        type: "uint256",
      },
    ],
    name: "Queue",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "clientAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionValue",
        type: "uint256",
      },
    ],
    name: "RedeemToken",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "clientAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "transactionValue",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "data",
        type: "string",
      },
    ],
    name: "TransferIn",
    type: "event",
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
    inputs: [],
    name: "proxy",
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
    name: "sigmaQueueWithdraw",
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
        name: "_newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_newProxyAddress",
        type: "address",
      },
    ],
    name: "updateProxyAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161088e38038061088e83398101604081905261002f916100bc565b6001600160a01b0381166100895760405162461bcd60e51b815260206004820152601c60248201527f5a65726f206164647265737320666f72207369676d612070726f787900000000604482015260640160405180910390fd5b60008054336001600160a01b031991821617909155600180549091166001600160a01b03929092169190911790556100ec565b6000602082840312156100ce57600080fd5b81516001600160a01b03811681146100e557600080fd5b9392505050565b610793806100fb6000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063eac32a8e1161005b578063eac32a8e146100e8578063ec556889146100fd578063f2fde38b14610110578063f625bb7c1461012357600080fd5b8063328447a51461008257806366e391f1146100aa5780638da5cb5b146100bd575b600080fd5b61009561009036600461057b565b610136565b60405190151581526020015b60405180910390f35b6100956100b83660046105cd565b6101ed565b6000546100d0906001600160a01b031681565b6040516001600160a01b0390911681526020016100a1565b6100fb6100f63660046106a9565b610292565b005b6001546100d0906001600160a01b031681565b6100fb61011e3660046106a9565b610393565b6100956101313660046106cb565b6104b3565b6001546000906001600160a01b031633146101985760405162461bcd60e51b815260206004820152601a60248201527f506c65617365207573652070726f787920636f6e74726163742e00000000000060448201526064015b60405180910390fd5b604080516001600160a01b038087168252851660208201529081018390527f0afa335d3ba3781567be21732e97c7ec9bee6917d3bbda262b70339424642f879060600160405180910390a15060019392505050565b6001546000906001600160a01b0316331461024a5760405162461bcd60e51b815260206004820152601a60248201527f506c65617365207573652070726f787920636f6e74726163742e000000000000604482015260640161018f565b7fca56091464bda7fd3a1d84d6eedd04e592e9a44e37c5418220a48c79908b9f578585858560405161027f949392919061070d565b60405180910390a1506001949350505050565b6000546001600160a01b031633146102db5760405162461bcd60e51b815260206004820152600c60248201526b2737ba1030b71030b236b4b760a11b604482015260640161018f565b6001600160a01b0381166103315760405162461bcd60e51b815260206004820181905260248201527f5a65726f206164647265737320666f72206e6577207369676d612070726f7879604482015260640161018f565b6001805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040519081527fecf3a480426d45df3182212195e583631b547e451781f28d0e3c0df9d02921ec906020015b60405180910390a150565b6000546001600160a01b031633146103dc5760405162461bcd60e51b815260206004820152600c60248201526b2737ba1030b71030b236b4b760a11b604482015260640161018f565b6001600160a01b0381166104585760405162461bcd60e51b815260206004820152602760248201527f5a65726f206164647265737320666f72206e6577207369676d6120616374696f60448201527f6e206f776e657200000000000000000000000000000000000000000000000000606482015260840161018f565b6000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0383169081179091556040519081527f244ded7a3b73e60f03281fc183df050e6134d393c50788e980dc090f06e7280990602001610388565b6001546000906001600160a01b031633146105105760405162461bcd60e51b815260206004820152601a60248201527f506c65617365207573652070726f787920636f6e74726163742e000000000000604482015260640161018f565b604080516001600160a01b03808816825286166020820152908101849052606081018390527f1d7a52ff511841ef43b9d8e46cfe1b8c7d5d667eab6f397285547a7d847be5cf9060800161027f565b80356001600160a01b038116811461057657600080fd5b919050565b60008060006060848603121561059057600080fd5b6105998461055f565b92506105a76020850161055f565b9150604084013590509250925092565b634e487b7160e01b600052604160045260246000fd5b600080600080608085870312156105e357600080fd5b6105ec8561055f565b93506105fa6020860161055f565b925060408501359150606085013567ffffffffffffffff8082111561061e57600080fd5b818701915087601f83011261063257600080fd5b813581811115610644576106446105b7565b604051601f8201601f19908116603f0116810190838211818310171561066c5761066c6105b7565b816040528281528a602084870101111561068557600080fd5b82602086016020830137600060208483010152809550505050505092959194509250565b6000602082840312156106bb57600080fd5b6106c48261055f565b9392505050565b600080600080608085870312156106e157600080fd5b6106ea8561055f565b93506106f86020860161055f565b93969395505050506040820135916060013590565b60006001600160a01b038087168352602081871681850152856040850152608060608501528451915081608085015260005b8281101561075b5785810182015185820160a00152810161073f565b8281111561076d57600060a084870101525b5050601f01601f19169190910160a0019594505050505056fea164736f6c634300080c000a";

type SigmaActionConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: SigmaActionConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class SigmaAction__factory extends ContractFactory {
  constructor(...args: SigmaActionConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    _initialProxyAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(_initialProxyAddress, overrides || {});
  }
  override deploy(
    _initialProxyAddress: AddressLike,
    overrides?: NonPayableOverrides & { from?: string }
  ) {
    return super.deploy(_initialProxyAddress, overrides || {}) as Promise<
      SigmaAction & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): SigmaAction__factory {
    return super.connect(runner) as SigmaAction__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): SigmaActionInterface {
    return new Interface(_abi) as SigmaActionInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): SigmaAction {
    return new Contract(address, _abi, runner) as unknown as SigmaAction;
  }
}