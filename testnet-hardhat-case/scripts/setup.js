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



const usdcAddress = "0xd35CCeEAD182dcee0F148EbaC9447DA2c4D449c4";
const proxyAddr = "0x89D1CC8D3f4Cc0b3De9D7f287B6269364f5fe598";
const rawPoolAddr = "0x27E9e0843Fc6Ba954298328Bedc9791A0992f860";
const multiSigAddr = "0x9be5ABf84D4a439ef82bA72e690370db9a52667A";



async function withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address, exp_block_no) {
    
    const signers = await ethers.getSigners();
    const owner = signers[0];

    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString() ]));
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

    const proxyInstance = await ethers.getContractFactory("MoneyPoolV2");
    const proxy = await proxyInstance.attach(proxyAddr);
    const tokenInstance = await ethers.getContractFactory("contracts/v2/satis_core/token.sol:TestTokenCZK");
    const token = await tokenInstance.attach(usdcAddress);
    const rawPoolInstance = await ethers.getContractFactory("MoneyPoolRaw",{
            libraries: {
                MultiSig: multiSigAddr,
            },
        });
    const rawPool = await rawPoolInstance.attach(rawPoolAddr);

    // Add fund
    var approveTx = await token.connect(worker1).approve(rawPool.address, "100000000");
    await approveTx.wait();
    console.log(`Approve hash: ${approveTx.hash}`);
    var addFundTx = await proxy.connect(worker1).addFundWithAction(token.address, "100000000", "meow", "satis-v2");
    await addFundTx.wait();
    console.log(`Add fund hash: ${addFundTx.hash}`);
    console.log();

    // Withdraw fund
    // Tier 1
    // console.log(`Tier 1 withdraw test:`);
    // var nonce = await rawPool.clientNonce(worker2.address);
    // var client_address = worker2.address;
    // const token_address = usdcAddress;
    // var withdraw_final = 1;
    // var tier = 1;
    // const chain_id = 5;
    // const exp_block_no = 100000000;
    // var pool_address = rawPool.address;
    // console.log(`Signing withdraw signature:`)
    // var signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address, exp_block_no);
    // const tier1WithdrawTx = await proxy.connect(worker2).verifyAndWithdrawFund(signature, token_address, withdraw_final, tier, exp_block_no, nonce, "satis-v2");
    // await tier1WithdrawTx.wait();
    // console.log(`Tier 1 withdraw hash: ${tier1WithdrawTx.hash}`);
    // var worker2ReservedValue = await rawPool.connect(worker2).instantWithdrawReserve(worker2.address, token.address);
    // console.log(`Worker 2 reserved value: ${worker2ReservedValue}`);
    // nonce = await rawPool.clientNonce(worker2.address);
    // console.log(`Worker 2 updated nonce: ${nonce}`);
    // console.log();

    // // Tier 2
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
    // console.log(`Tier 3 withdraw test:`);
    // nonce = await rawPool.clientNonce(worker1.address);
    // withdraw_final = 1;
    // tier = 3;
    // client_address = worker1.address;
    // signature = await withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address, exp_block_no);
    // const tier3WithdrawTx = await proxy.connect(worker1).verifyAndPartialWithdrawFund(signature, token_address, withdraw_final, tier, exp_block_no, nonce, "satis-v2");
    // await tier3WithdrawTx.wait();
    // console.log(`Tier 3 withdraw hash: ${tier3WithdrawTx.hash}`);
    // worker1ReservedValue = await rawPool.instantWithdrawReserve(worker1.address, token.address);
    // console.log(`Worker 1 reserved value: ${worker1ReservedValue}`);
    // nonce = await rawPool.clientNonce(worker1.address);
    // console.log(`Worker 1 updated nonce: ${nonce}`);
    // console.log();

    // contractOwner = await proxy.connect(worker1).getPoolOwner("satis-v2");
    // console.log(`Owner: ${contractOwner}`);
    // console.log();

    // worker1ReservedValue = await rawPool.instantWithdrawReserve(worker1.address, token.address);
    // console.log(`Worker 1 reserved value: ${worker1ReservedValue}`);
    // worker2ReservedValue = await rawPool.instantWithdrawReserve(worker2.address, token.address);
    // console.log(`Worker 2 reserved value: ${worker2ReservedValue}`);

    // console.log(`Basic test done`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });