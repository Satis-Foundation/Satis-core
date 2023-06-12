/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('hardhat-typechain');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.2",
      },
      {
        version: "0.4.24",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 0,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
};
