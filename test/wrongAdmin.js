const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');



describe("Check wrong admin", function () {
    it("Wrong admin", async function () {

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

        const user0 = signers[0];
        const user1 = signers[1];
        const user2 = signers[2];
        console.log("User 0 address: " + user0['address']);
        console.log("User 1 address: " + user1['address']);
        console.log("User 2 address: " + user2['address']);

        await token.connect(user0).transfer(user1['address'], 300);
        await token.connect(user0).transfer(user2['address'], 300);

        await token.connect(user2).approve(poolAddress, 200);
        await pool.connect(user2).addFund(tokenAddress, 200);
        await pool.connect(user2).lockFundWithAction(tokenAddress, 150, 'lockTest');
        balanceValue = await pool.connect(user2).viewFund(tokenAddress);
        expect(balanceValue[0]).to.equal(200);
        expect(balanceValue[1]).to.equal(150);

        await pool.connect(poolOwner).unlockFund(user2['address'], tokenAddress, 100);
        await pool.connect(user2).removeFund(tokenAddress, 130);
        balanceValue = await pool.connect(user2).viewFund(tokenAddress);
        expect(balanceValue[0]).to.equal(70);
        expect(balanceValue[1]).to.equal(50);

        await pool.connect(poolOwner).transferOwnership(user0['address']);
        await pool.connect(user1).unlockFund(user2['address'], tokenAddress, 30);
        await pool.connect(user2).removeFund(tokenAddress, 40);
        balanceValue = await pool.connect(user2).viewFund(tokenAddress);
        expect(balanceValue[0]).to.equal(30);
        expect(balanceValue[1]).to.equal(20);

    })
})