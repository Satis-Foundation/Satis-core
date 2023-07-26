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



const newPoolAddr = process.env.NEW_POOL_ADDR_LIST || "";
const newPoolName = process.env.NEW_POOL_NAME_LIST || "";
if (!newPoolAddr || !newPoolName) {
    throw new Error("Please set NEW_POOL_ADDR_LIST and NEW_POOL_NAME_LIST in .env file");
}
const newPoolAddrList = newPoolAddr.split(",");
const newPoolNameList = newPoolName.split(",");
if (newPoolAddrList.length !== newPoolNameList.length) {
    throw new Error("NEW_POOL_ADDR_LIST and NEW_POOL_NAME_LIST length not equal");
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

    const proxyUpdatePoolTx = await proxy.connect(deployer).changePool(newPoolNameList, newPoolAddrList);
    await proxyUpdatePoolTx.wait();
    console.log(`Raw pool address updated to ${newPoolAddrList}, pool name updated to ${newPoolNameList} in proxy`);

    const sigmaProxyUpdatePoolTX = await sigmaProxy.connect(deployer).changePool(newPoolNameList, newPoolAddrList);
    await sigmaProxyUpdatePoolTX.wait();
    console.log(`Raw pool address updated to ${newPoolAddrList}, pool name updated to ${newPoolNameList} in sigma proxy`);


    // for (i in newPoolAddrList) {
    //     var rawPoolInstance = await ethers.getContractFactory("MoneyPoolRaw");
    //     var rawPool = await rawPoolInstance.attach(newPoolAddrList[i]);
    //     var rawPoolUpdateProxyTx = await rawPool.connect(deployer).updateProxyAddress(proxyAddr);
    //     await rawPoolUpdateProxyTx.wait();
    //     console.log(`Proxy address updated to ${proxyAddr} in raw pool ${newPoolNameList[i]} at ${newPoolAddrList[i]}`);
    //     var rawPoolUpdateSigmaProxyTX = await rawPool.connect(deployer).updateSigmaProxyAddress(sigmaProxyAddr);
    //     await rawPoolUpdateSigmaProxyTX.wait();
    //     console.log(`Sigma proxy address updated to ${sigmaProxyAddr} in raw pool ${newPoolNameList[i]} at ${newPoolAddrList[i]}`);
    // }
}



main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });