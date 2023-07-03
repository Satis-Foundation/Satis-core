import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.OWNER_PRIVATE_KEY || "";
const poolName = process.env.POOL_NAME || "";

if (!PRIVATE_KEY)
  throw "⛔️ Deployer private key or pool name not detected! Add them to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Satis Pool contracts`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const rawPoolArtifact = await deployer.loadArtifact("MoneyPoolRaw");
  const proxyArtifact = await deployer.loadArtifact("MoneyPoolV2");
  const actionArtifact = await deployer.loadArtifact("Action");
  const sigmaProxyArtifact = await deployer.loadArtifact("SigmaPoolV2");
  const sigmaActionArtifact = await deployer.loadArtifact("SigmaAction");

  // Pubkey as dummy address
  const dummyAddress = "0xc4adcF8814a1da13522716A23331Ce4d48A1414d";
  var deployGasCount = 0;

  // Deploy Raw Pool
  const deploymentFeeRawPool = await deployer.estimateDeployFee(rawPoolArtifact, [dummyAddress, dummyAddress]);
  var parsedFee = ethers.utils.formatEther(deploymentFeeRawPool.toString());
  console.log(`Estimated deployment fee for Raw Pool: ${parsedFee} ETH`);
  deployGasCount += Number(parsedFee);
  const rawPool = await deployer.deploy(rawPoolArtifact, [dummyAddress, dummyAddress]);
  const rawPoolAddress = rawPool.address;
  console.log(`${rawPoolArtifact.contractName} was deployed to ${rawPoolAddress}`);
  console.log();

  // Deploy Action
  const deploymentFeeAction = await deployer.estimateDeployFee(actionArtifact, [dummyAddress]);
  parsedFee = ethers.utils.formatEther(deploymentFeeAction.toString());
  console.log(`Estimated deployment fee for Action: ${parsedFee} ETH`);
  deployGasCount += Number(parsedFee);
  const actionContract = await deployer.deploy(actionArtifact, [dummyAddress]);
  const actionContractAddress = actionContract.address;
  console.log(`${actionArtifact.contractName} was deployed to ${actionContractAddress}`);
  console.log();

  // Deploy Sigma Action
  const deploymentFeeSigmaAction = await deployer.estimateDeployFee(sigmaActionArtifact, [dummyAddress]);
  parsedFee = ethers.utils.formatEther(deploymentFeeSigmaAction.toString());
  console.log(`Estimated deployment fee for Sigma Action: ${parsedFee} ETH`);
  deployGasCount += Number(parsedFee);
  const sigmaActionContract = await deployer.deploy(sigmaActionArtifact, [dummyAddress]);
  const sigmaActionContractAddress = sigmaActionContract.address;
  console.log(`${sigmaActionArtifact.contractName} was deployed to ${sigmaActionContractAddress}`);
  console.log();

  // Deploy Proxy
  const deploymentFeeProxy = await deployer.estimateDeployFee(proxyArtifact, [[poolName], [rawPoolAddress], actionContractAddress]);
  parsedFee = ethers.utils.formatEther(deploymentFeeProxy.toString());
  console.log(`Estimated deployment fee for Proxy: ${parsedFee} ETH`);
  deployGasCount += Number(parsedFee);
  const proxyContract = await deployer.deploy(proxyArtifact, [[poolName], [rawPoolAddress], actionContractAddress]);
  const proxyContractAddress = proxyContract.address;
  console.log(`${proxyArtifact.contractName} was deployed to ${proxyContractAddress}`);
  console.log();

  // Deploy Sigma Proxy
  const deploymentFeeSigmaProxy = await deployer.estimateDeployFee(sigmaProxyArtifact, [[poolName], [rawPoolAddress], sigmaActionContractAddress]);
  parsedFee = ethers.utils.formatEther(deploymentFeeSigmaProxy.toString());
  console.log(`Estimated deployment fee for Sigma Proxy: ${parsedFee} ETH`);
  deployGasCount += Number(parsedFee);
  const sigmaProxyContract = await deployer.deploy(sigmaProxyArtifact, [[poolName], [rawPoolAddress], sigmaActionContractAddress]);
  const sigmaProxyContractAddress = sigmaProxyContract.address;
  console.log(`${sigmaProxyArtifact.contractName} was deployed to ${sigmaProxyContractAddress}`);
  console.log();

  // Set Proxy address to Action
  const setProxyToActionTx = await actionContract.updateProxyAddress(proxyContractAddress);
  await setProxyToActionTx.wait();
  console.log(`Set Proxy address to Action hash: ${setProxyToActionTx.hash}`);

  // Set Sigma Proxy address to Sigma Action
  const setSigmaProxyToSigmaActionTx = await sigmaActionContract.updateProxyAddress(sigmaProxyContractAddress);
  await setSigmaProxyToSigmaActionTx.wait();
  console.log(`Set Sigma Proxy address to Sigma Action hash: ${setSigmaProxyToSigmaActionTx.hash}`);

  // Set addresses to Raw Pool
  const setProxyToRawPoolTx = await rawPool.updateProxyAddress(proxyContractAddress);
  await setProxyToRawPoolTx.wait();
  console.log(`Set Proxy to Raw Pool hash: ${setProxyToRawPoolTx.hash}`);
  const setSigmaProxyToRawPoolTx = await rawPool.updateSigmaProxyAddress(sigmaProxyContractAddress);
  await setSigmaProxyToRawPoolTx.wait();
  console.log(`Set Sigma Proxy to Raw Pool hash: ${setSigmaProxyToRawPoolTx.hash}`);
  console.log();

  // Whitelist workers
  const worker1Pubkey = process.env.WORKER_PUBKEY_1;
  const worker2Pubkey = process.env.WORKER_PUBKEY_2;
  var whitelistTx = await rawPool.addWorkers([worker1Pubkey, worker2Pubkey]);
  await whitelistTx.wait();
  console.log(`Whitelisted workers in raw pool`);
  whitelistTx = await proxyContract.addWorkers([worker1Pubkey, worker2Pubkey]);
  await whitelistTx.wait();
  console.log(`Whitelisted workers in raw proxy`);
  whitelistTx = await sigmaProxyContract.addWorkers([worker1Pubkey, worker2Pubkey]);
  await whitelistTx.wait();
  console.log(`Whitelisted workers in sigma proxy`);
  console.log();

  console.log(`Total gas used in deployment: ${deployGasCount} ETH`);
}
