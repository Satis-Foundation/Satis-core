const { ethers } = require("hardhat");
const { keccak256 } = require("@ethersproject/keccak256");

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

    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), in_debt.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString(), ticket_id.toLowerCase() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const signature = await owner.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
}



async function main() {

    const signers = await ethers.getSigners();
    const deployer = signers[0];
    const worker1 = signers[1];
    const worker2 = signers[2];

    // Deploy fake token
    const tokenInstance = await ethers.getContractFactory("contracts/v2/satis_core/token.sol:TestTokenCZK", deployer);
    const token = await tokenInstance.deploy();
    await token.deployed();
    console.log(`Fake token deployed at ${token.address}`);
    console.log();

    // Deploy Action contract
    const actionInstance = await ethers.getContractFactory("Action", deployer);
    //const actionInstance = await ethers.getContractFactory(action_abi, action_bytecode, deployer);
    const action = await actionInstance.deploy(deployer.address);
    await action.deployed();
    console.log(`Action contract deployed at ${action.address}`);
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
    const proxy = await proxyInstance.deploy(["satis-v2"], [rawPool.address], action.address);
    await proxy.deployed();
    console.log(`Proxy contract deployed at ${proxy.address}`);
    console.log();

    // Update Proxy address to Action and Raw Pool
    var updateAddrTx = await action.connect(deployer).updateProxyAddress(proxy.address);
    await updateAddrTx.wait();
    console.log(`Proxy address is updated in Action`);
    updateAddrTx = await rawPool.connect(deployer).updateProxyAddress(proxy.address);
    await updateAddrTx.wait();
    console.log(`Proxy address is updated in Raw Pool`);
    console.log();

    // Whitelist workers
    var whitelistTx = await rawPool.connect(deployer).addWorkers([worker1.address]);
    await whitelistTx.wait();
    console.log(`Raw pool whitelisting done`);
    whitelistTx = await proxy.connect(deployer).addWorkers([worker1.address]);
    await whitelistTx.wait();
    console.log(`Proxy whitelisting done`);

    // Fund token to worker 1 and 2
    var fundTokenTx = await token.connect(deployer).transfer(worker1.address, "1000000");
    await fundTokenTx.wait();
    console.log(`Funded 1 USDC to worker 1`);
    fundTokenTx = await token.connect(deployer).transfer(worker2.address, "1000000");
    await fundTokenTx.wait();
    console.log(`Funded 1 USDC to worker 2`);
    console.log();

    // Add fund
    var approveTx = await token.connect(worker1).approve(rawPool.address, "1000000");
    await approveTx.wait();
    console.log(`Approve hash: ${approveTx.hash}`);
    var addFundTx = await proxy.connect(worker1).addFundWithAction(token.address, "800000", "meow", "satis-v2");
    await addFundTx.wait();
    console.log(`Add fund hash: ${addFundTx.hash}`);
    console.log();

    // Withdraw fund
    // Tier 1
    console.log(`Tier 1 withdraw test:`);
    var nonce = await rawPool.clientNonce(worker2.address);
    var client_address = worker2.address;
    var token_address = token.address;
    var withdraw_final = 200000;
    var in_debt = 300;
    var tier = 1;
    const chain_id = 31337;
    var pool_address = rawPool.address;
    var exp_block_no = 100000;
    var ticket_id = "test1";
    console.log(`Signing withdraw signature:`)
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id);
    const tier1WithdrawTx = await proxy.connect(worker2).verifyAndWithdrawFund(signature, token_address, withdraw_final, in_debt, tier, exp_block_no, ticket_id, nonce, "satis-v2");
    await tier1WithdrawTx.wait();
    console.log(`Tier 1 withdraw hash: ${tier1WithdrawTx.hash}`);
    var liquidityInPool = await rawPool.totalLockedAssets(token.address);
    console.log(`Liquidity in pool: ${liquidityInPool}`);
    var inDebt = await rawPool.instantWithdrawReserve(ticket_id, token.address);
    console.log(`In debt: ${inDebt}`);
    nonce = await rawPool.clientNonce(worker2.address);
    console.log(`Worker 2 updated nonce: ${nonce}`);
    console.log();

    // Tier 2
    // console.log(`Tier 2 withdraw test:`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // withdraw_final = 1000;
    // tier = 2;
    // signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address);
    // const tier2WithdrawTx = await proxy.connect(worker2).verifyAndQueue(signature, token_address, withdraw_final, tier, nonce, "satis-v2");
    // await tier2WithdrawTx.wait();
    // console.log(`Tier 2 withdraw hash: ${tier2WithdrawTx.hash}`);
    // var worker2QueuedValue = await rawPool.connect(worker2).withdrawalQueue(worker2.address, token.address);
    // console.log(`Worker 2 queued value: ${worker2QueuedValue}`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // console.log(`Worker 2 updated nonce: ${nonce}`);
    // console.log();

    // Tier 3
    console.log(`Tier 3 withdraw test:`);
    nonce = await rawPool.clientNonce(worker2.address);
    withdraw_final = 150000;
    in_debt = 0;
    tier = 3;
    ticket_id = "test2";
    signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id);
    const tier3WithdrawTx = await proxy.connect(worker2).verifyAndPartialWithdrawFund(signature, token_address, withdraw_final, in_debt, tier, exp_block_no, ticket_id, nonce, "satis-v2");
    await tier3WithdrawTx.wait();
    console.log(`Tier 3 withdraw hash: ${tier3WithdrawTx.hash}`);
    liquidityInPool = await rawPool.totalLockedAssets(token.address);
    console.log(`Liquidity in pool: ${liquidityInPool}`);
    nonce = await rawPool.clientNonce(worker2.address);
    console.log(`Worker 2 updated nonce: ${nonce}`);
    console.log();

    console.log();
    console.log(`Following tier 3 bridging must fail`);
    console.log();
    // Tier 3 Bridge debt
    console.log(`Tier 3 withdraw debt test:`);
    nonce = await rawPool.clientNonce(worker2.address);
    withdraw_final = 1000;
    in_debt = 2000;
    tier = 3;
    ticket_id = "test3";
    console.log(`Signing withdraw signature:`)
    var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id);
    const tier3WithdrawBridgeTx = await proxy.connect(worker2).verifyAndPartialWithdrawFund(signature, token_address, withdraw_final, in_debt, tier, exp_block_no, ticket_id, nonce, "satis-v2");
    await tier3WithdrawBridgeTx.wait();
    console.log(`Tier 3 withdraw hash: ${tier3WithdrawBridgeTx.hash}`);
    liquidityInPool = await rawPool.totalLockedAssets(token.address);
    console.log(`Liquidity in pool: ${liquidityInPool}`);
    nonce = await rawPool.clientNonce(worker2.address);
    console.log(`Worker 2 updated nonce: ${nonce}`);
    console.log();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });