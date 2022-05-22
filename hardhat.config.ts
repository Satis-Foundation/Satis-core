/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require('hardhat-typechain');
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 800,
      },
      metadata: {
        bytecodeHash: 'none',
      },
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
    },
  },

};
