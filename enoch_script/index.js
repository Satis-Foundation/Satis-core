const { ethers } = require("ethers");
require('dotenv').config();

const { action_abi } = require("./abi/action_abi");
const { multisig_abi } = require("./abi/multisig_abi");
const { proxy_abi } = require("./abi/proxy_abi");
const { raw_pool_abi } = require("./abi/raw_pool_abi");
const { sigma_action_abi } = require("./abi/sigma_action_abi");
const { sigma_proxy_abi } = require("./abi/sigma_proxy_abi");
const { token_abi } = require("./abi/token_abi");

const { action_bytecode } = require("./bytecode/action_bytecode");
const { multisig_bytecode } = require("./bytecode/multisig_bytecode");
const { proxy_bytecode } = require("./bytecode/proxy_bytecode");
const { raw_pool_bytecode } = require("./bytecode/raw_pool_bytecode");
const { sigma_action_bytecode } = require("./bytecode/sigma_action_bytecode");
const { sigma_proxy_bytecode } = require("./bytecode/sigma_proxy_bytecode");
const { token_bytecode } = require("./bytecode/token_bytecode");





async function withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address) {
    const deployerPrivKey = process.env.DEPLOYER_PRIV_KEY;
    const abiCoder = new ethers.utils.AbiCoder();
    
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const owner = new ethers.Wallet(deployerPrivKey);
    const signature = await owner.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
}



async function main() {

    // Load necessary var
    const deployerPrivKey = process.env.DEPLOYER_PRIV_KEY;
    const rpcUrl = "https://rpc.ankr.com/eth_goerli";
    const chain_id = 5;

    // Connect to provider and deployer
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const deployer = new ethers.Wallet(deployerPrivKey, provider);
    console.log(`Start basic test`);
    console.log();

    // Deploy Token
    const tokenFactory = new ethers.ContractFactory(token_abi, token_bytecode, deployer);
    const token = await tokenFactory.deploy();
    await token.deployed();
    console.log(`Token contract deployed at ${token.address}`);
    console.log();

    // Deploy Action
    const actionFactory = new ethers.ContractFactory(action_abi, action_bytecode, deployer);
    const action = await actionFactory.deploy(deployer.address);
    await action.deployed();
    console.log(`Action contract deployed at ${action.address}`);
    console.log();

    // Deploy Multisig library
    const multisigFactory = new ethers.ContractFactory(multisig_abi, multisig_bytecode);
    const multisigLib = await multisigFactory.deploy();
    await multisigLib.deployed();
    console.log(`Multisig library deployed at ${multisigLib.address}`);
    console.log();

    // Deploy Money Pool Raw
    const rawPoolFactory = new ethers.ContractFactory(raw_pool_abi, raw_pool_bytecode, deployer);
    const rawPool = await rawPoolFactory.deploy(deployer.address, deployer.address);
    await rawPool.deployed();
    console.log(`Raw Pool contract deployed at ${rawPool.address}`);
    console.log();

    // Deploy Money Pool Proxy
    const proxyFactory = new ethers.ContractFactory(proxy_abi, proxy_bytecode, deployer);
    const proxy = await proxyFactory.deploy(["satis-v2"], [rawPool.address], action.address);
    await proxy.deployed();
    console.log(`Proxy contract deployed at ${proxy.address}`);
    console.log();

    // Update proxy address
    var updateTx = await rawPool.connect(deployer).updateProxyAddress(proxy.address);
    await updateTx.wait();
    updateTx = await action.connect(deployer).updateProxyAddress(proxy.address);
    await updateTx.wait();
    console.log(`Proxy contract address updated at Action and Raw Pool`);
    console.log();

    // Create user and fund token
    const userPrivKey = process.env.USER_PRIV_KEY;
    const user = new ethers.Wallet(userPrivKey, provider);
    var transferTx = await token.connect(deployer).transfer(user.address, 1000000000000);
    await transferTx.wait();
    var userTokenBalance = await token.connect(user).balanceOf(user.address);
    console.log(`User token balance is ${userTokenBalance}`);
    console.log();

    // User add fund
    const addFundTx = await proxy.connect(user).addFundWithAction(token.address, 1000000, "meow", "satis-v2");
    await addFundTx.wait()
    console.log(`Add fund hash: ${addFundTx}`);
    var contractBalance = await rawPool.connect(user).totalLockedAssets(token.address);
    console.log(`Contract token balance: ${contractBalance}`);
    console.log();

    // User withdraw fund
    // Tier 1
    console.log(`Test tier 1 withdraw`);
    var nonce = await rawPool.clientNonce(user.address);
    var client_address = user.address;
    var token_address = token.address;
    var withdraw_final = 2000;
    var tier = 1;
    var pool_address = rawPool.address;
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    const tier1WithdrawTx = await proxy.connect(user).verifyAndWithdrawFund(signature, token_address, withdraw_final, tier, chain_id, pool_address, "satis-v2");
    await tier1WithdrawTx.wait();
    console.log(`Tier 1 withdraw hash: ${tier1WithdrawTx}`);
    var userReservedBalance = await rawPool.connect(user).instantWithdrawReserve(user.address, token.address);
    console.log(`User reserved balance: ${userReservedBalance}`);
    console.log();

    // Tier 2
    console.log(`Test tier 2 withdraw`);
    nonce = await rawPool.clientNonce(user.address);
    withdraw_final = 1500;
    tier = 2;
    signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    const tier2WithdrawTx = await proxy.connect(user).verifyAndQueue(signature, token_address, withdraw_final, tier, chain_id, pool_address, "satis-v2");
    await tier2WithdrawTx.wait();
    console.log(`Tier 2 withdraw hash: ${tier2WithdrawTx}`);
    var userQueuedBalance = await rawPool.connect(user).withdrawalQueue(user.address, token.address);
    console.log(`User queued balance: ${userQueuedBalance}`);
    var queueNo = await rawPool.connect(user).queueCount(token.address);
    console.log(`Queue count: ${queueNo}`);
    console.log();

    // Tier 3
    console.log(`Test tier 3 withdraw`);
    nonce = await rawPool.clientNonce(user.address);
    withdraw_final = 800;
    tier = 3;
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    const tier3WithdrawTx = await proxy.connect(user).verifyAndPartialWithdrawFund(signature, token_address, withdraw_final, tier, chain_id, pool_address, "satis-v2");
    await tier3WithdrawTx.wait();
    console.log(`Tier 3 withdraw hash: ${tier3WithdrawTx}`);
    userReservedBalance = await rawPool.connect(user).instantWithdrawReserve(user.address, token.address);
    console.log(`User reserved balance: ${userReservedBalance}`);
    console.log();

    // Add worker
    const workerPrivKey = process.env.WORKER_PRIV_KEY;
    const worker = new ethers.Wallet(workerPrivKey, provider);
    const addWorkerTx = await rawPool.connect(deployer).addWorkers([worker.address]);
    await addWorkerTx.wait();
    console.log(`Worker added`);
    console.log()

    // Worker take fund
    const takeFundTx = await rawPool.connect(worker).workerTakeLockedFund(token.address, 10000);
    await takeFundTx.wait();
    var workerBalance = await token.connect(worker).balanceOf(worker.address);
    console.log(`Worker token balance after take: ${workerBalance}`);
    console.log()

    // Worker dump fund
    // Tier 1 and 3
    const dumpTier1FundTx = await rawPool.connect(worker).workerDumpInstantWithdrawalFund([user.address], token.address, [900], 0);
    await dumpTier1FundTx.wait();
    userReservedBalance = await rawPool.connect(user).instantWithdrawReserve(user.address, token.address);
    console.log(`User reserved balance: ${userReservedBalance}`);
    console.log();

    // Tier 2
    const dumpTier2FundTx = await rawPool.connect(worker).workerDumpRebalancedFund([user.address], token.address, [500], 100);
    await dumpTier2FundTx.wait();
    userQueuedBalance = await rawPool.connect(user).withdrawalQueue(user.address, token.address);
    console.log(`User queued balance: ${userQueuedBalance}`);
    queueNo = await rawPool.connect(user).queueCount(token.address);
    console.log(`Queue count: ${queueNo}`);
    console.log();

    console.log(`Basic test done`);
    process.exit(0);
}



main();