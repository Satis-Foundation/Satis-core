const multisig_abi = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "msg",
          "type": "string"
        }
      ],
      "name": "Debug",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_targetAddress",
          "type": "address"
        },
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
      "name": "test_verifySignature",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_targetAddress",
          "type": "address"
        },
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
      "name": "verifySignature",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
];
module.exports = { multisig_abi };