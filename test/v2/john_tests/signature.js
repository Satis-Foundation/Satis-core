const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');
require('@nomiclabs/hardhat-web3');



describe ("Test Signature", function() {
    it ("Test Signature", async function() {
        this.timeout(5000);

        const signers = await ethers.getSigners();
        console.log("Number of accounts: " + signers.length);

        const u0 = signers[0];
 
        const abi = await ethers.getContractFactory("MultiSig", u0);
        const contract = await abi.deploy();
        console.log(`MultiSig contract deployed at ${contract.address}`);

        // test_verifySignature(
        //     address _targetAddress,
        //     bytes memory _targetSignature,
        //     address _clientAddress,
        //     address _tokenAddress,
        //     uint256 _withdrawValue,
        //     uint256 _tier,
        //     uint256 _chainId,
        //     address _poolAddress,
        //     uint256 _nonce
        // )
        let s = await contract
            .connect(u0)
            .test_verifySignature(
                "0xc4adcf8814a1da13522716a23331ce4d48a1414d", // address _targetAddress,
                "0x15fe6cc66a822511bac01ada72e86a0c8029c603361bb6b80b36c646428af8990014053f6ce720a575406b66647323dbbcbfa7db87c3681fbd25b70642a0e8111b", // bytes memory _targetSignature,
                "0xE0DaA5F78c0E1A6694a0ecDE1D3E56d4f805bB5B", // address _clientAddress,
                "0x8dA7F2e4e6Ca5f32999CE70e989388df4Dc3c590", // address _tokenAddress,
                495210727, // uint256 _withdrawValue,
                1, // uint256 _tier,
                1337, // uint256 _chainId,
                "0x717f524d31B27A183fAcf971567901F7f2875276", // address _poolAddress,
                1, // uint256 _nonce
            );
        console.log(s);
    })
});