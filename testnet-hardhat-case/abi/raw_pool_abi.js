const raw_pool_abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_initialProxyAddress",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_initialSigmaProxyAddress",
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
          "name": "newOwner",
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
          "internalType": "address",
          "name": "newProxy",
          "type": "address"
        }
      ],
      "name": "ChangeProxy",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "newSigmaProxy",
          "type": "address"
        }
      ],
      "name": "ChangeSigmaProxy",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "takeProfitValue",
          "type": "uint256"
        }
      ],
      "name": "OwnerTakeProfit",
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
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "workerAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address[]",
          "name": "clientAddressList",
          "type": "address[]"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "dumpValueList",
          "type": "uint256[]"
        }
      ],
      "name": "WorkerDumpBridgedFund",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_fundingValue",
          "type": "uint256"
        }
      ],
      "name": "fundSatisToken",
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
          "name": "_clientAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "name": "getClientInstantWithdrawReserve",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_clientAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        }
      ],
      "name": "getClientQueueValue",
      "outputs": [
        {
          "internalType": "uint256[]",
          "name": "",
          "type": "uint256[]"
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
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "instantWithdrawReserve",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
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
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_takeProfitValue",
          "type": "uint256"
        }
      ],
      "name": "ownerTakeProfit",
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
      "name": "proxy",
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
      "name": "queueCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
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
          "name": "",
          "type": "address"
        }
      ],
      "name": "satisTokenBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sigmaProxy",
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
          "name": "_clientAddress",
          "type": "address"
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
        }
      ],
      "name": "verifyAndRedeemToken",
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
          "name": "_clientAddress",
          "type": "address"
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
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "withdrawalQueue",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "_clientAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_instantWithdrawValueList",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_totalDumpAmount",
          "type": "uint256"
        }
      ],
      "name": "workerDumpInstantWithdrawalFund",
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
          "name": "_clientAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_queueValueList",
          "type": "uint256[]"
        },
        {
          "internalType": "uint256",
          "name": "_totalDumpAmount",
          "type": "uint256"
        }
      ],
      "name": "workerDumpRebalancedFund",
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
          "name": "_takeValue",
          "type": "uint256"
        }
      ],
      "name": "workerTakeLockedFund",
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
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_takingValue",
          "type": "uint256"
        }
      ],
      "name": "workerTakeSatisToken",
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
          "name": "_clientAddressList",
          "type": "address[]"
        },
        {
          "internalType": "address",
          "name": "_tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint256[]",
          "name": "_tokenValueList",
          "type": "uint256[]"
        }
      ],
      "name": "workerUnlockFund",
      "outputs": [
        {
          "internalType": "bool",
          "name": "_isDone",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
];
module.exports = { raw_pool_abi };