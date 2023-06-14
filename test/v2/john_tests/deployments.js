const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');
const fs = require("fs");
require('@nomiclabs/hardhat-web3');



describe ("Test Signature", function() {
    it ("Account Signature", async function() {
        let multi_sig = JSON.parse(fs.readFileSync("abi/v2/satis_core/MoneyPoolRaw.sol/MultiSig.json", { encoding: 'utf8' }));
        let raw = JSON.parse(fs.readFileSync("abi/v2/satis_core/MoneyPoolRaw.sol/MoneyPoolRaw.json", { encoding: 'utf8' }));
        // console.log(multi_sig_bytecode.bytecode);
        // console.log(raw_bytecode.bytecode);
        // console.log(raw_bytecode.abi);

        const signers = await ethers.getSigners();
        // console.log("Number of accounts: " + signers.length);

        const deployer = signers[0];
        // tokenOwnerAddress = tokenOwner['address'];
        // console.log("Token owner address: " + tokenOwnerAddress);

        ethers.contractFactory(multi_sig.abi, multi_sig.bytecode, deployer);

        // const tokenContract = await ethers.getContractFactory("Token", tokenOwner);
        // const token = await tokenContract.deploy();
        // console.log("Token contract deployed");

        // const tokenAddress = token.address;
        // console.log("Token address: " + tokenAddress);


        // const poolOwner = signers[1];
        // poolOwnerAddress = poolOwner['address'];
        // console.log("Money Pool owner address: " + poolOwnerAddress);

        // const poolRawContract1 = await ethers.getContractFactory("MoneyPoolRaw", poolOwner);
        // const pool1 = await poolRawContract1.deploy();
        // const pool1Addr = pool1.address;
        // console.log(`Pool raw contract 1 deployed at ${pool1Addr}`);

        // const poolRawContract2 = await ethers.getContractFactory("MoneyPoolRaw", poolOwner);
        // const pool2 = await poolRawContract2.deploy();
        // const pool2Addr = pool2.address;
        // console.log(`Pool raw contract 2 deployed at ${pool2Addr}`);

        // const poolProxyContract = await ethers.getContractFactory("MoneyPoolV2", poolOwner);
        // const mainPool = await poolProxyContract.deploy(["1pool","2pool"],[pool1Addr,pool2Addr]);
        // const mainPoolAddr = mainPool.address;
        // console.log(`Main pool deployed at ${mainPoolAddr}`);

        // await pool1.connect(poolOwner).updateProxyAddress(mainPoolAddr);
        // await pool2.connect(poolOwner).updateProxyAddress(mainPoolAddr);
        // console.log("Proxy address initialized in pools")

        // const user0 = signers[0];
        // const user1 = signers[1];
        // const user2 = signers[2];
        // console.log("User 0 address: " + user0['address']);
        // console.log("User 1 address: " + user1['address']);
        // console.log("User 2 address: " + user2['address']);

        // await token.connect(user0).transfer(user1['address'],100000000);
        // await token.connect(user0).transfer(user2['address'],100000000);
        // console.log("Transfer completed.")

        // await token.connect(user2).approve(pool2Addr,5000000);
        // console.log("Approval done.")

        // await mainPool.connect(user2).addFundWithAction(tokenAddress,2500000,4000000,'lockTest','2pool');
        // var balanceValue = await mainPool.connect(user2).getClientBalance(user2['address'],tokenAddress,"2pool");
        // var lockedValue = await mainPool.connect(user2).getClientLockBalance(user2['address'],tokenAddress,"2pool");
        // console.log(`Client free balance: ${balanceValue}`)
        // expect (balanceValue).to.equal(4000000);
        // expect (lockedValue).to.equal(2500000);


        // /*
        // let rawMessagePrefix = "\x19Ethereum Signed Message:\n";
        // let rawMessageInfo = user2Address+tokenAddress+"80";
        // let rawMessageLength = rawMessageInfo.length;
        // rawMessageLengthSTR = rawMessageLength.toString();
        // let rawMessageHash = await ethers.utils.solidityKeccak256(["string","string","string"],[rawMessagePrefix,rawMessageLengthSTR,rawMessageInfo]);
        // */
        // let user2AddressLow = user2['address'].toLowerCase();
        // let tokenAddressLow = tokenAddress.toLowerCase();
        // //let testHash = await ethers.utils.solidityKeccak256(["string","string","string"],["Hello","World",user2AddressLow]);
        // //let testHashByte = ethers.utils.arrayify(testHash);
        // let nonce = await mainPool.connect(user2).getClientNonce(user2['address'],'2pool');
        // let rawMessageHash = await ethers.utils.solidityKeccak256(["string","string","string","string","string","string","string"],["newlock:","1000000",";",nonce.toString(),user2['address'].toString(),tokenAddress.toString(),"1500000"]);
        // let rawMessageHashByte = ethers.utils.arrayify(rawMessageHash);
        // let contractReceiveHash = ethers.utils.hashMessage(rawMessageHashByte);
        // //let smartContractConvertAddress = await pool.connect(user2).testAddressConversion();
        // //let smartContractEncodedHash = await pool.connect(user2).testEncoding();
        // //console.log("Raw message info:");
        // //console.log(rawMessageInfo);
        // //console.log("1: original, 2: smart contract");
        // //console.log(user2AddressLow+" "+(typeof user2AddressLow));
        // //console.log(smartContractConvertAddress+" "+(typeof smartContractConvertAddress));
        // //expect (user2AddressLow).to.equal(smartContractConvertAddress);
        // //console.log("1: original, 2: smart contract");
        // //console.log(testHash);
        // //console.log(smartContractEncodedHash);
        // console.log("Raw message hash:");
        // console.log(rawMessageHash);
        // signature1 = await poolOwner.signMessage(rawMessageHashByte);
        // console.log("Signature:");
        // console.log(signature1);

        // let solidityRecoverReturn = await pool2.connect(user2).recoverSignature(contractReceiveHash,signature1);
        // let localRecoverReturn = ethers.utils.verifyMessage(rawMessageHashByte,signature1);
        // console.log("0: ideal, 1: localRecover, 2: contractRecover");
        // console.log(poolOwnerAddress);
        // console.log(localRecoverReturn);
        // console.log(solidityRecoverReturn);

        // /*
        // let solidityVRSReturn = await pool.connect(user2).recoverSignatureValues(signature1);
        // let localVRSReturn = ethers.utils.splitSignature(signature1);
        // console.log("v value: local, contract");
        // console.log(localVRSReturn.v+" "+solidityVRSReturn[2]);
        // console.log("r value: local, contract");
        // console.log(localVRSReturn.r+" "+solidityVRSReturn[0]);
        // console.log("s value: local, contract");
        // console.log(localVRSReturn.s+" "+solidityVRSReturn[1]);
        // */
        
        // await mainPool.connect(user2).verifyAndUnlockFund(signature1,tokenAddress,1500000,nonce,1000000,'2pool');
        // balanceValue = await mainPool.connect(user2).getClientBalance(user2['address'],tokenAddress,"2pool");
        // lockedValue = await mainPool.connect(user2).getClientLockBalance(user2['address'],tokenAddress,"2pool");
        // console.log(`Client free balance: ${balanceValue}`)
        // expect (balanceValue).to.equal(4000000);
        // expect (lockedValue).to.equal(1000000);


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