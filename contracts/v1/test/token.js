const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');



describe ("Deploy Test Token", function() {

    it ("Number of minted tokens is consistent", async function() {

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

        const poolContract = await ethers.getContractFactory("moneyPoolL2", poolOwner);
        const pool = await poolContract.deploy();
        console.log("Pool contract deployed");

        const poolAddress = pool.address;
        console.log("Money Pool address: " + poolAddress);
        
        const tokenNumber = await token.totalSupply();
        const initialDistributedTokens = await token.balanceOf(tokenOwner['address']);
        expect (tokenNumber).to.equal(initialDistributedTokens);

    })
})