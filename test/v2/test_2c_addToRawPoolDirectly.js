const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');



describe ("Add to raw pool", function() {
    it ("Check balance value", async function() {

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

        const user0 = signers[0];
        const user1 = signers[1];
        const user2 = signers[2];
        console.log("User 0 address: " + user0['address']);
        console.log("User 1 address: " + user1['address']);
        console.log("User 2 address: " + user2['address']);

        await token.connect(user0).transfer(user1['address'],1000000);
        await token.connect(user0).transfer(user2['address'],1000000);
        console.log("Transfer completed.")

        await token.connect(user0).approve(pool1Addr,5000000);
        console.log("Approval done.")
        await pool1.connect(user0).addFund(user0['address'],tokenAddress,2000000);
        console.log("Add fund done")
        var balanceValue = await mainPool.connect(user0).getClientBalance(user0['address'],tokenAddress,"3pool");
        console.log(`Client balance on contract is: ${balanceValue}`)
        expect (balanceValue).to.equal(2000000);

    })
})