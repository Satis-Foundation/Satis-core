const sigma_proxy_abi = [
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_sigmaPoolNameList",
        "type": "string[]"
      },
      {
        "internalType": "address[]",
        "name": "_sigmaPoolAddressList",
        "type": "address[]"
      },
      {
        "internalType": "address",
        "name": "_sigmaActionContractAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "addWorkerList",
        "type": "address[]"
      }
    ],
    "name": "AddWorkers",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "newAdminAddress",
        "type": "address"
      }
    ],
    "name": "ChangeOwnership",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "newlyAddedPoolAddressList",
        "type": "address[]"
      }
    ],
    "name": "ChangePoolAddress",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address[]",
        "name": "removeWorkerList",
        "type": "address[]"
      }
    ],
    "name": "RemoveWorkers",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_addWorkerList",
        "type": "address[]"
      }
    ],
    "name": "addWorkers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newActionContractAddress",
        "type": "address"
      }
    ],
    "name": "changeSigmaActionContract",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_newPoolNameList",
        "type": "string[]"
      },
      {
        "internalType": "address[]",
        "name": "_newPoolAddressList",
        "type": "address[]"
      }
    ],
    "name": "changeSigmaPool",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_clientAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getClientSigmaDepositRecord",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "clientSigmaDepositRecord",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_clientAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getClientSigmaNonce",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "clientSigmaNonce",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getLiquidityAmountInPool",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "liquidityInPool",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getSatisTokenAmountInContract",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "satisTokenInPool",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getSigmaPoolAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "_sigmaPoolAddress",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "getSigmaPoolOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "sigmaPoolOwner",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address[]",
        "name": "_removeWorkerList",
        "type": "address[]"
      }
    ],
    "name": "removeWorkers",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sigmaActionContractAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenValue",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_data",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "sigmaAddFundWithAction",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isDone",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "sigmaOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "sigmaPoolAddressList",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "sigmaProxyWorkerList",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_targetSignature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_partialWithdrawValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tier",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_poolAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "sigmaVerifyAndPartialWithdrawFund",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isDone",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_targetSignature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_queueValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tier",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_poolAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "sigmaVerifyAndQueue",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isDone",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_targetSignature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_redeemValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tier",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_poolAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "sigmaVerifyAndRedeemToken",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isDone",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes",
        "name": "_targetSignature",
        "type": "bytes"
      },
      {
        "internalType": "address",
        "name": "_tokenAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_withdrawValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_tier",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_chainId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_poolAddress",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_nonce",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_poolName",
        "type": "string"
      }
    ],
    "name": "sigmaVerifyAndWithdrawFund",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isDone",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnershipSigmaPoolProxy",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_workerAddress",
        "type": "address"
      }
    ],
    "name": "verifySigmaProxyWorker",
    "outputs": [
      {
        "internalType": "bool",
        "name": "_isWorker",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
module.exports = { sigma_proxy_abi };