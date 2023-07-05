import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as actionArtifact from "../artifacts-zk/contracts/Action.sol/Action.json";
import * as sigmaActionArtifact from "../artifacts-zk/contracts/SigmaAction.sol/SigmaAction.json";
import * as rawPoolArtifact from "../artifacts-zk/contracts/MoneyPoolRaw.sol/MoneyPoolRaw.json";
import * as proxyArtifact from "../artifacts-zk/contracts/MoneyPoolProxy.sol/MoneyPoolV2.json";
import * as sigmaProxyArtifact from "../artifacts-zk/contracts/SigmaPoolProxy.sol/SigmaPoolV2.json";
import * as zkc1Artifact from "../artifacts-zk/contracts/C5.sol/TestTokenCZK.json";

// load wallet private key from env file
const OWNER_PRIV_KEY = process.env.OWNER_PRIVATE_KEY || "";
const newPoolAddr = process.env.NEW_POOL_ADDR_LIST || "";
const newPoolName = process.env.NEW_POOL_NAME_LIST || "";
const newPoolAddrList = newPoolAddr.split(",");
const newPoolNameList = newPoolName.split(",");

if (!OWNER_PRIV_KEY)
  throw "⛔️ Owner private key not detected! Add them to the .env file!";
if (!newPoolAddr || !newPoolName)
  throw "Please provide NEW_POOL_ADDR_LIST and NEW_POOL_NAME_LIST in .env file!";
if (newPoolNameList.length != newPoolAddrList.length)
  throw "NEW_POOL_ADDR_LIST and NEW_POOL_NAME_LIST length not match!";

// Load contract addresses from .env
const actionContractAddress = process.env.ACTION_ADDR || "";
const sigmaActionContractAddress = process.env.SIGMA_ACTION_ADDR || "";
const proxyContractAddress = process.env.PROXY_ADDR || "";
const sigmaProxyContractAddress = process.env.SIGMA_PROXY_ADDR || "";
const rawPoolAddress = process.env.RAW_POOL_ADDR || "";
const zkc1Address = process.env.USDC_ADDR || "";

if (!actionContractAddress || !sigmaActionContractAddress || !proxyContractAddress || !sigmaProxyContractAddress || !rawPoolAddress || !zkc1Address) {
  throw "Contract addresses not detected! Add them to the .env file!";
}

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script to update pool......`);

  // Initialise the provider
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const owner = new ethers.Wallet(OWNER_PRIV_KEY, provider);

8561b60f3612  // Initialise contract instance
  const actionContract = new ethers.Contract(
    actionContractAddress,
    actionArtifact.abi,
    provider
  );
  const sigmaActionContract = new ethers.Contract(
    sigmaActionContractAddress,
    sigmaActionArtifact.abi,
    provider
  );
  const rawPool = new ethers.Contract(
    rawPoolAddress,
    rawPoolArtifact.abi,
    provider
  );
  const zkc1 = new ethers.Contract(
    zkc1Address,
    zkc1Artifact.abi,
    provider
  );
  const proxyContract = new ethers.Contract(
    proxyContractAddress,
    proxyArtifact.abi,
    provider
  );
  const sigmaProxyContract = new ethers.Contract(
    sigmaProxyContractAddress,
    sigmaProxyArtifact.abi,
    provider
  );



  // Set new raw pool address to proxy
  const proxySetPoolTX = await proxyContract.connect(owner).changePool(newPoolNameList, newPoolAddrList);
  await proxySetPoolTX.wait();
  console.log(`Raw pool address updated to ${newPoolAddrList}, pool name updated to ${newPoolNameList} in proxy`);

  // Set new raw pool address to sigma proxy
  const sigmaProxySetPoolTX = await sigmaProxyContract.connect(owner).changeSigmaPool(newPoolNameList, newPoolAddrList);
  await sigmaProxySetPoolTX.wait();
  console.log(`Raw pool address updated to ${newPoolAddrList}, pool name updated to ${newPoolNameList} in sigma proxy`);

  // // Set new proxy address to raw pool
  // for (var i in newPoolAddrList) {
  //   var rawPoolSetProxyTX = await rawPool.connect(owner).updateProxyAddress(proxyContractAddress);
  //   await rawPoolSetProxyTX.wait();
  //   console.log(`Proxy address updated to ${proxyContractAddress} in raw pool ${newPoolNameList[i]} at ${newPoolAddrList[i]}`);
  // }

  // // Set new sigma proxy address to raw pool
  // for (var i in newPoolAddrList) {
  //   var rawPoolSetSigmaProxyTX = await rawPool.connect(owner).updateSigmaProxyAddress(sigmaProxyContractAddress);
  //   await rawPoolSetSigmaProxyTX.wait();
  //   console.log(`Sigma proxy address updated to ${sigmaProxyContractAddress} in raw pool ${newPoolNameList[i]} at ${newPoolAddrList[i]}`);
  // }
}
