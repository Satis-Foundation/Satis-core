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
const isUpdateActionStr = process.env.IS_UPDATE_ACTION || "";
const isUpdateSigmaActionStr = process.env.IS_UPDATE_SIGMA_ACTION || "";
const isUpdateAction = +isUpdateActionStr;
const isUpdateSigmaAction = +isUpdateSigmaActionStr;

if (!OWNER_PRIV_KEY)
  throw "⛔️ Owner private key not detected! Add them to the .env file!";
if (!isUpdateActionStr && !isUpdateSigmaActionStr)
  throw "Please provide IS_UPDATE_ACTION or IS_UPDATE_SIGMA_ACTION in .env file!";
if (!((isUpdateAction == 1 || isUpdateAction == 0) && (isUpdateSigmaAction == 1 || isUpdateSigmaAction == 0)))
  throw "IS_UPDATE_ACTION and IS_UPDATE_SIGMA_ACTION should be 0 or 1!";

// Load contract addresses from .env
const actionContractAddress = process.env.NEW_ACTION_ADDR || "";
const sigmaActionContractAddress = process.env.NEW_SIGMA_ACTION_ADDR || "";
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

  // Initialise contract instance
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
