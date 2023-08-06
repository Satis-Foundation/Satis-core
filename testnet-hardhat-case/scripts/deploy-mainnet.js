const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");
require('dotenv').config();

const { action_abi } = require("../abi/action_abi");
const { multisig_abi } = require("../abi/multisig_abi");
const { proxy_abi } = require("../abi/proxy_abi");
const { raw_pool_abi } = require("../abi/raw_pool_abi");
const { sigma_action_abi } = require("../abi/sigma_action_abi");
const { sigma_proxy_abi } = require("../abi/sigma_proxy_abi");
const { token_abi } = require("../abi/token_abi");

const { action_bytecode } = require("../bytecode/action_bytecode");
const { multisig_bytecode } = require("../bytecode/multisig_bytecode");
const { proxy_bytecode } = require("../bytecode/proxy_bytecode");
const { raw_pool_bytecode } = require("../bytecode/raw_pool_bytecode");
const { sigma_action_bytecode } = require("../bytecode/sigma_action_bytecode");
const { sigma_proxy_bytecode } = require("../bytecode/sigma_proxy_bytecode");
const { token_bytecode } = require("../bytecode/token_bytecode");
const { ConsoleLogger } = require("ts-generator/dist/logger");





async function withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id) {

    const signers = await ethers.getSigners();
    const owner = signers[0];
    const worker2 = signers[2];

    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), in_debt.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString(), ticket_id.toLowerCase() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const signature = await worker2.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
}



async function main() {

    // Goerli
    //const chain_id = 5;
    //const tokenAddress="0x5d089486f3Ad4ca8Cd5A2c1E7ECFaF7294A74dd1";
    const chain_id = process.env.CHAIN_ID;
    const tokenAddress = process.env.TOKEN_ADDRESS;
    const poolName = process.env.POOL_NAME;

    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const worker1 = signers[1];
    const worker2 = signers[2];

    // // Deploy fake token
    // const tokenInstance = await ethers.getContractFactory("TestTokenCZK", deployer);
    // const token = await tokenInstance.deploy();
    // await token.deployed();
    // console.log(`Fake token deployed at ${token.address}`);
    // console.log();

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
    const rawPool = await rawPoolInstance.deploy(deployer.address, deployer.address, worker2.address);
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

    // Whitelist workers
    var whitelistTx = await rawPool.connect(deployer).addWorkers([worker1.address, worker2.address]);
    await whitelistTx.wait();
    console.log(`Raw pool whitelisting done`);
    whitelistTx = await proxy.connect(deployer).addWorkers([worker1.address, worker2.address]);
    await whitelistTx.wait();
    console.log(`Proxy whitelisting done`);
    console.log();

    // // Fund token to worker 1 and 2
    // var fundTokenTx = await token.connect(deployer).transfer(worker1.address, "1000000");
    // await fundTokenTx.wait();
    // console.log(`Funded 1 USDC to worker 1`);
    // fundTokenTx = await token.connect(deployer).transfer(worker2.address, "1000000");
    // await fundTokenTx.wait();
    // console.log(`Funded 1 USDC to worker 2`);
    // console.log();

    // // Add fund
    // var approveTx = await token.connect(worker1).approve(rawPool.address, "1000000");
    // await approveTx.wait();
    // console.log(`Approve hash: ${approveTx.hash}`);
    // var addFundTx = await proxy.connect(worker1).addFundWithAction(token.address, "500000", "meow", "satis-v2");
    // await addFundTx.wait();
    // console.log(`Add fund hash: ${addFundTx.hash}`);
    // console.log();

    // Get signature worker address
    const sigWorkerAddr = await rawPool.connect(worker1).signatureWorker();
    console.log(`Signature worker address: ${sigWorkerAddr}`);

    // Withdraw estimation setup (worker 1)
    console.log(`Withdraw estimation setup (worker 1):`);
    var nonce = await rawPool.clientNonce(worker1.address);
    var client_address = worker1.address;
    var token_address = tokenAddress;
    var withdraw_final = 0;
    var in_debt = 1;
    var tier = 1;
    var pool_address = rawPool.address;
    var exp_block_no = 100000000;
    var ticket_id = "worker1-test";
    console.log(`Signing withdraw signature:`)
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id);
    var tier1WithdrawTx = await proxy.connect(worker1).verifyAndWithdrawFund(signature, token_address, withdraw_final, in_debt, tier, exp_block_no, ticket_id, nonce, poolName);
    await tier1WithdrawTx.wait();
    console.log(`Worker 1 tier 1 withdraw hash: ${tier1WithdrawTx.hash}`);
    var worker2ReservedValue = await rawPool.connect(worker1).instantWithdrawReserve("worker1-test", tokenAddress);
    console.log(`Worker 1 reserved value: ${worker2ReservedValue}`);
    nonce = await rawPool.clientNonce(worker1.address);
    console.log(`Worker 1 updated nonce: ${nonce}`);
    console.log();

    // Withdraw estimation setup (worker 2)
    console.log(`Withdraw estimation setup (worker 2):`);
    var nonce = await rawPool.clientNonce(worker2.address);
    var client_address = worker2.address;
    var token_address = tokenAddress;
    var withdraw_final = 0;
    var in_debt = 1;
    var tier = 1;
    var pool_address = rawPool.address;
    ticket_id = "worker2-test";
    console.log(`Signing withdraw signature:`)
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id);
    var tier1WithdrawTx = await proxy.connect(worker2).verifyAndWithdrawFund(signature, token_address, withdraw_final, in_debt, tier, exp_block_no, ticket_id, nonce, poolName);
    await tier1WithdrawTx.wait();
    console.log(`Worker 2 tier 1 withdraw hash: ${tier1WithdrawTx.hash}`);
    var worker2ReservedValue = await rawPool.connect(worker2).instantWithdrawReserve("worker2-test", tokenAddress);
    console.log(`Worker 2 reserved value: ${worker2ReservedValue}`);
    nonce = await rawPool.clientNonce(worker2.address);
    console.log(`Worker 2 updated nonce: ${nonce}`);
    console.log();

    // // Tier 2
    // console.log(`Tier 2 withdraw test:`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // withdraw_final = 1000;
    // tier = 2;
    // signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    // const tier2WithdrawTx = await proxy.connect(worker2).verifyAndQueue(signature, token_address, withdraw_final, tier, chain_id, pool_address, nonce, "satis-v2");
    // await tier2WithdrawTx.wait();
    // console.log(`Tier 2 withdraw hash: ${tier2WithdrawTx.hash}`);
    // var worker2QueuedValue = await rawPool.connect(worker2).withdrawalQueue(worker2.address, token.address);
    // console.log(`Worker 2 queued value: ${worker2QueuedValue}`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // console.log(`Worker 2 updated nonce: ${nonce}`);
    // console.log();

    // // Tier 3
    // console.log(`Tier 3 withdraw test:`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // withdraw_final = 800;
    // tier = 3;
    // signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    // const tier3WithdrawTx = await proxy.connect(worker2).verifyAndPartialWithdrawFund(signature, token_address, withdraw_final, tier, chain_id, pool_address, nonce, "satis-v2");
    // await tier3WithdrawTx.wait();
    // console.log(`Tier 3 withdraw hash: ${tier3WithdrawTx.hash}`);
    // worker2ReservedValue = await rawPool.instantWithdrawReserve(worker2.address, token.address);
    // console.log(`Worker 2 reserved value: ${worker2ReservedValue}`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // console.log(`Worker 2 updated nonce: ${nonce}`);
    // console.log();

    // console.log(`Basic test done`);

    console.log(`Initialization done`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });