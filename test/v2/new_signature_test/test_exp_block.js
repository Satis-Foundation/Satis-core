const { expect } = require("chai");
const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");


describe ("Test New Signature", function() {
    it ("Add Expiry Block Number in Signature", async function() {

        const signers = await ethers.getSigners();
        const deployer = signers[0];
        const user = signers[1];
        const poolName = "satis-v2";

        async function withdrawSignature(signer, nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address, exp_block_no) {
            const abiCoder = new ethers.utils.AbiCoder();
            const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString() ]));
            const byteMsg = ethers.utils.arrayify(encodeHash);
            const signature = await signer.signMessage(byteMsg);
            console.log(`Signature: ${signature}`);
            return signature;
        }

        // Deploy Action contract
        const actionInstance = await ethers.getContractFactory("Action", deployer);
        //const actionInstance = await ethers.getContractFactory(action_abi, action_bytecode, deployer);
        const action = await actionInstance.deploy(deployer.address);
        await action.deployed();
        console.log(`Action contract deployed at ${action.address}`);
        console.log()

        // Deploy Sigma Action contract
        const sigmaActionInstance = await ethers.getContractFactory("SigmaAction", deployer);
        const sigmaAction = await sigmaActionInstance.deploy(deployer.address);
        await sigmaAction.deployed();
        console.log(`Sigma Action contract deployed at ${sigmaAction.address}`);
        console.log()

        // Deploy MultiSig contract
        const multiSigInstance = await ethers.getContractFactory("MultiSig", deployer);
        //const multiSigInstance = await ethers.getContractFactory(multisig_abi, multisig_bytecode,deployer);
        const multiSig = await multiSigInstance.deploy();
        await multiSig.deployed();
        console.log(`MultiSig library deployed at ${multiSig.address}`);
        console.log();

        // Deploy Raw Money Pool
        const rawPoolInstance = await ethers.getContractFactory("MoneyPoolRaw", {
        //const rawPoolInstance = await ethers.getContractFactory(raw_pool_abi, raw_pool_bytecode, {
            libraries: {
                MultiSig: multiSig.address,
            },
        }, deployer);
        const rawPool = await rawPoolInstance.deploy(deployer.address, deployer.address);
        await rawPool.deployed();
        console.log(`Money Pool Raw deployed at ${rawPool.address}`);
        console.log();

        // Deploy Money Pool Proxy
        const proxyInstance = await ethers.getContractFactory("MoneyPoolV2", deployer);
        const proxy = await proxyInstance.deploy([poolName], [rawPool.address], action.address);
        await proxy.deployed();
        console.log(`Proxy contract deployed at ${proxy.address}`);
        console.log();

        // Deploy Sigma Proxy
        const sigmaProxyInstance = await ethers.getContractFactory("SigmaPoolV2", deployer);
        const sigmaProxy = await sigmaProxyInstance.deploy([poolName], [rawPool.address], sigmaAction.address);
        await sigmaProxy.deployed();
        console.log(`Sigma Proxy contract deployed at ${sigmaProxy.address}`);
        console.log();

        // Update Proxy address to Action and Raw Pool
        var updateAddrTx = await action.connect(deployer).updateProxyAddress(proxy.address);
        await updateAddrTx.wait();
        console.log(`Proxy address is updated in Action`);
        updateAddrTx = await rawPool.connect(deployer).updateProxyAddress(proxy.address);
        await updateAddrTx.wait();
        console.log(`Proxy address is updated in Raw Pool`);
        console.log();

        // Update Sigma Proxy address to Sigma Action and Raw Pool
        updateAddrTx = await sigmaAction.connect(deployer).updateProxyAddress(sigmaProxy.address);
        await updateAddrTx.wait();
        console.log(`Sigma Proxy address is updated in Sigma Action`);
        updateAddrTx = await rawPool.connect(deployer).updateSigmaProxyAddress(sigmaProxy.address);
        await updateAddrTx.wait();
        console.log(`Sigma Proxy address is updated in Raw Pool`);
        console.log();

        // Deploy Test Token
        const tokenInstance = await ethers.getContractFactory("contracts/v2/token/token.sol:TestTokenCZK", deployer);
        const token = await tokenInstance.deploy();
        await token.deployed();
        console.log(`Test Token deployed at ${token.address}`);
        console.log();

        // Add fund to Raw Pool
        var approveTx = await token.connect(deployer).approve(rawPool.address, "10000000");
        await approveTx.wait();
        console.log(`Test Token approved to Raw Pool`);
        var addFundTx = await proxy.connect(deployer).addFundWithAction(token.address, "10000000", "meow", poolName);
        await addFundTx.wait();
        console.log(`Test Token added to Raw Pool`);
        var contractBalance = await rawPool.totalLockedAssets(token.address);
        console.log(`Current contract balance: ${contractBalance}`);
        expect(Number(contractBalance)).to.equal(10000000);

        // Withdraw from Raw Pool (valid block number)
        var blockNo = await ethers.provider.getBlockNumber();
        console.log(`Current block number: ${blockNo}`);
        var nonce = await rawPool.clientNonce(user.address);
        console.log(`Current nonce: ${nonce}`);
        var expBlockNo = blockNo + 50;
        var signature = await withdrawSignature(deployer, nonce, user.address, token.address, "100", "1", "31337", rawPool.address, expBlockNo);
        var withdrawTx = await proxy.connect(user).verifyAndWithdrawFund(signature, token.address, 100, 1, expBlockNo, nonce, poolName);
        await withdrawTx.wait();
        console.log(`Withdraw TX done`);
        var userReserveBalance = await rawPool.instantWithdrawReserve(user.address, token.address);
        expect(Number(userReserveBalance)).to.equal(100);
        console.log(`Client reserved balance: ${userReserveBalance}, withdraw passed with valid block number`);

        // Withdraw from Raw Pool (invalid block number)
        blockNo = await ethers.provider.getBlockNumber();
        console.log(`Current block number: ${blockNo}`);
        nonce = await rawPool.clientNonce(user.address);
        console.log(`Current nonce: ${nonce}`);
        expBlockNo = blockNo - 1;
        signature = await withdrawSignature(deployer, nonce, user.address, token.address, "200", "1", "31337", rawPool.address, expBlockNo);
        withdrawTx = await proxy.connect(user).verifyAndWithdrawFund(signature, token.address, 200, 1, expBlockNo, nonce, poolName);
        await withdrawTx.wait();
        console.log(`Withdraw TX done (should be failed)`);
        userReserveBalance = rawPool.instantWithdrawReserve(user.address, token.address);
        expect(Number(userReserveBalance)).to.equal(300);
    });
});