const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');
require('@nomiclabs/hardhat-web3');



describe("Test Signature", function () {
    it("Account Signature", async function () {

        const signers = await ethers.getSigners();
        console.log("Number of accounts: " + signers.length);


        const tokenOwner = signers[0];
        tokenOwnerAddress = await tokenOwner.getAddress();
        console.log("Token owner address: " + tokenOwnerAddress);

        const tokenContract = await ethers.getContractFactory("Token", tokenOwner);
        const token = await tokenContract.deploy();
        console.log("Token contract deployed");

        const tokenAddress = token.address;
        console.log("Token address: " + tokenAddress);


        const poolOwner = signers[1];
        poolOwnerAddress = await poolOwner.getAddress();
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
        user2Address = user2['address'];

        await token.connect(user0).transfer(user1['address'], 100);
        await token.connect(user0).transfer(user2['address'], 100);

        await token.connect(user2).approve(poolAddress, 100);
        await pool.connect(user2).addFund(tokenAddress, 100);
        await pool.connect(user2).lockFundWithAction(tokenAddress, 90, 'lockTest');
        balanceValue = await pool.connect(user2).viewFund(tokenAddress);
        expect(balanceValue[0]).to.equal(100);
        expect(balanceValue[1]).to.equal(90);


        /*
        let rawMessagePrefix = "\x19Ethereum Signed Message:\n";
        let rawMessageInfo = user2Address+tokenAddress+"80";
        let rawMessageLength = rawMessageInfo.length;
        rawMessageLengthSTR = rawMessageLength.toString();
        let rawMessageHash = await ethers.utils.solidityKeccak256(["string","string","string"],[rawMessagePrefix,rawMessageLengthSTR,rawMessageInfo]);
        */
        let user2AddressLow = user2Address.toLowerCase();
        let tokenAddressLow = tokenAddress.toLowerCase();
        //let testHash = await ethers.utils.solidityKeccak256(["string","string","string"],["Hello","World",user2AddressLow]);
        //let testHashByte = ethers.utils.arrayify(testHash);
        let rawMessageHash = await ethers.utils.solidityKeccak256(["string", "string", "string"], [user2AddressLow, tokenAddressLow, "80"]);
        let rawMessageHashByte = ethers.utils.arrayify(rawMessageHash);
        let contractReceiveHash = ethers.utils.hashMessage(rawMessageHashByte);
        //let smartContractConvertAddress = await pool.connect(user2).testAddressConversion();
        //let smartContractEncodedHash = await pool.connect(user2).testEncoding();
        //console.log("Raw message info:");
        //console.log(rawMessageInfo);
        //console.log("1: original, 2: smart contract");
        //console.log(user2AddressLow+" "+(typeof user2AddressLow));
        //console.log(smartContractConvertAddress+" "+(typeof smartContractConvertAddress));
        //expect (user2AddressLow).to.equal(smartContractConvertAddress);
        //console.log("1: original, 2: smart contract");
        //console.log(testHash);
        //console.log(smartContractEncodedHash);
        console.log("Raw message hash:");
        console.log(rawMessageHash);
        signature1 = await poolOwner.signMessage(rawMessageHashByte);
        console.log("Signature:");
        console.log(signature1);

        let solidityRecoverReturn = await pool.connect(user2).recoverSignature(contractReceiveHash, signature1);
        let localRecoverReturn = ethers.utils.verifyMessage(rawMessageHashByte, signature1);
        console.log("0: ideal, 1: localRecover, 2: contractRecover");
        console.log(poolOwnerAddress);
        console.log(localRecoverReturn);
        console.log(solidityRecoverReturn);

        /*
        let solidityVRSReturn = await pool.connect(user2).recoverSignatureValues(signature1);
        let localVRSReturn = ethers.utils.splitSignature(signature1);
        console.log("v value: local, contract");
        console.log(localVRSReturn.v+" "+solidityVRSReturn[2]);
        console.log("r value: local, contract");
        console.log(localVRSReturn.r+" "+solidityVRSReturn[0]);
        console.log("s value: local, contract");
        console.log(localVRSReturn.s+" "+solidityVRSReturn[1]);
        */

        await pool.connect(user2).verifyAndRemoveFund(rawMessageHashByte, signature1, tokenAddress, 80);
        balanceValue = await pool.connect(user2).viewFund(tokenAddress);
        expect(balanceValue[0]).to.equal(20);
        expect(balanceValue[1]).to.equal(10);


        /*
        account_0_address = await web3.eth.personal.newAccount('123123');
        account_1_address = await web3.eth.personal.newAccount('234234');
        console.log(account_0_address);
        console.log(account_1_address);

        console.log(await web3.eth.getAccounts());
        */

        /* const signers = await ethers.getSigners();
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
        expect (tokenNumber).to.equal(initialDistributedTokens); */

    })
})