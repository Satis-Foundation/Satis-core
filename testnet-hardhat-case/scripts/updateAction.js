const { ethers } = require("hardhat");
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



const isUpdateActionStr = process.env.IS_UPDATE_ACTION || "";
const isUpdateSigmaActionStr = process.env.IS_UPDATE_SIGMA_ACTION || "";
const isUpdateAction = +isUpdateActionStr;
const isUpdateSigmaAction = +isUpdateSigmaActionStr;
if (!isUpdateActionStr || !isUpdateSigmaActionStr) {
    throw new Error("Please set IS_UPDATE_ACTION and IS_UPDATE_SIGMA_ACTION in .env file");
}
if (!((isUpdateAction == 1 || isUpdateAction == 0) && (isUpdateSigmaAction == 1 || isUpdateSigmaAction == 0))) {
    throw "IS_UPDATE_ACTION and IS_UPDATE_SIGMA_ACTION should be 0 or 1!";
}

const actionContractAddress = process.env.NEW_ACTION_ADDR || "";
const sigmaActionContractAddress = process.env.NEW_SIGMA_ACTION_ADDR || "";
if (!actionContractAddress || !sigmaActionContractAddress) {
    throw new Error("Please set NEW_ACTION_ADDR and NEW_SIGMA_ACTION_ADDR in .env file");
}

const proxyAddr = process.env.PROXY_ADDR || "";
const sigmaProxyAddr = process.env.SIGMA_PROXY_ADDR || "";
if (!proxyAddr || !sigmaProxyAddr) {
    throw new Error("Please set PROXY_ADDR and SIGMA_PROXY_ADDR in .env file");
}



async function main() {

    const signers = await ethers.getSigners();
    const deployer = signers[0];

    const proxyInstance = await ethers.getContractFactory("MoneyPoolV2");
    const proxy = await proxyInstance.attach(proxyAddr);
    const sigmaProxyInstance = await ethers.getContractFactory("SigmaPoolV2");
    const sigmaProxy = await sigmaProxyInstance.attach(sigmaProxyAddr);

    if (isUpdateAction == 1) {
        // Set new action address to proxy
        const proxySetActionTX = await proxyContract.connect(owner).changeActionContract(actionContractAddress);
        await proxySetActionTX.wait();
        console.log(`Action address updated to ${actionContractAddress} in proxy`);
    }
    
    if (isUpdateSigmaAction == 1) {
        // Set new sigma action address to sigma proxy
        const sigmaProxySetActionTX = await sigmaProxyContract.connect(owner).changeSigmaActionContract(sigmaActionContractAddress);
        await sigmaProxySetActionTX.wait();
        console.log(`Sigma action address updated to ${sigmaActionContractAddress} in sigma proxy`);
    }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
