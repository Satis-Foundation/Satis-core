/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@typechain/hardhat');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.20",
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
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
    },
  },
};