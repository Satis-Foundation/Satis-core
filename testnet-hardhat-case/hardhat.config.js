/** @type import('hardhat/config').HardhatUserConfig */
require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require('@typechain/hardhat');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.12",
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
      allowUnlimitedContractSize: false,
    },
    goerli: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: ["34590ce513a0fc9d84fe3b0213071e8a5493f184b766769b81d363860ee72879", "aaaf8ea96000fb58e5b9693ad0fc7d6fac499c84762dc678a43012d712cf34fe", "0x1887177de76c422c7de396c993d357b3ab512b0fd21db9fc182829df31425468"],
      allowUnlimitedContractSize: false,
    },
  },
};
