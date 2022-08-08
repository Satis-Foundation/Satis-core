const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');



describe ("Deployment Test", function() {

    it ("Deploy multiple pools", async function() {

        const signers = await ethers.getSigners();
        console.log("Number of accounts: " + signers.length);


        const tokenOwner = signers[0];
        tokenOwnerAddress = tokenOwner['address'];
        console.log("Token owner address: " + tokenOwnerAddress);

        const tokenContract = await ethers.getContractFactory("Token", tokenOwner);
        const token = await tokenContract.deploy();
        console.log("Token contract deployed");

        const tokenAddress = token.address;
        console.log("Token address: " + tokenAddress);


        const poolOwner = signers[1];
        poolOwnerAddress = poolOwner['address'];
        console.log("Money Pool owner address: " + poolOwnerAddress);

        const poolRawContract1 = await ethers.getContractFactory("MoneyPoolRaw", poolOwner);
        const pool1 = await poolRawContract1.deploy();
        const pool1Addr = pool1.address;
        console.log(`Pool raw contract 1 deployed at ${pool1Addr}`);

        const poolRawContract2 = await ethers.getContractFactory("MoneyPoolRaw", poolOwner);
        const pool2 = await poolRawContract2.deploy();
        const pool2Addr = pool2.address;
        console.log(`Pool raw contract 2 deployed at ${pool2Addr}`);

        const poolProxyContract = await ethers.getContractFactory("MoneyPoolV2", poolOwner);
        const mainPool = await poolProxyContract.deploy(["1pool","2pool"],[pool1Addr,pool2Addr]);
        const mainPoolAddr = mainPool.address;
        console.log(`Main pool deployed at ${mainPoolAddr}`);

        await pool1.connect(poolOwner).updateProxyAddress(mainPoolAddr);
        await pool2.connect(poolOwner).updateProxyAddress(mainPoolAddr);
        console.log("Proxy address initialized in pools")
        
        const onChainPool1Addr = await mainPool.getPoolAddress("1pool");
        expect (onChainPool1Addr).to.equal(pool1Addr);
        
        const onChainPool2Addr = await mainPool.getPoolAddress("2pool");
        expect (onChainPool2Addr).to.equal(pool2Addr);
    })
})