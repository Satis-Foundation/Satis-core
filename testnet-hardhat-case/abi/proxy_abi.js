const proxy_abi = [
    {
      "inputs": [
        {
          "internalType": "string[]",
          "name": "_poolNameList",
          "type": "string[]"
        },
        {
          "internalType": "address[]",
          "name": "_poolAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_actionContractAddress",
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
      "inputs": [],
      "name": "actionContractAddress",
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
      "name": "addFundWithAction",
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
      "name": "changeActionContract",
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
      "name": "changePool",
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
      "name": "getClientDepositRecord",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "clientDepositRecord",
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
      "name": "getClientNonce",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "clientNonce",
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
          "internalType": "string",
          "name": "_poolName",
          "type": "string"
        }
      ],
      "name": "getPoolAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "_poolAddress",
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
      "name": "getPoolOwner",
      "outputs": [
        {
          "internalType": "address",
          "name": "poolOwner",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
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
      "name": "poolAddressList",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "_newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnershipMoneyPoolProxy",
      "outputs": [],
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
      "name": "verifyAndPartialWithdrawFund",
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
      "name": "verifyAndQueue",
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
      "name": "verifyAndWithdrawFund",
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
          "name": "_workerAddress",
          "type": "address"
        }
      ],
      "name": "verifyWorker",
      "outputs": [
        {
          "internalType": "bool",
          "name": "_isWorker",
          "type": "bool"
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
      "name": "workerList",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
];
module.exports = { proxy_abi };