import { Wallet, utils } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load wallet private key from env file
const PRIVATE_KEY = process.env.OWNER_PRIV_KEY || "";

if (!PRIVATE_KEY)
  throw "⛔️ Deployer private key or pool name not detected! Add them to the .env file!";

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running deploy script for the Satis Pool contracts`);

  // Initialize the wallet.
  const wallet = new Wallet(PRIVATE_KEY);

  // Create deployer object and load the artifact of the contract you want to deploy.
  const deployer = new Deployer(hre, wallet);
  const queryArtifact = await deployer.loadArtifact("QueryBlock");

  // Deploy Query Block Contract
  const deploymentFeeQuery = await deployer.estimateDeployFee(queryArtifact, []);
  var parsedFee = ethers.utils.formatEther(deploymentFeeQuery.toString());
  console.log(`Estimated deployment fee for Raw Pool: ${parsedFee} ETH`);
  const query = await deployer.deploy(queryArtifact, []);
  console.log(`${queryArtifact.contractName} was deployed to ${query.address}`);
  console.log();

  // Try to get current block number
  const blockNumber = await query.getBlockNumber();
  console.log(`Current zkSync block.number returns ${blockNumber}`);

  // Try to get current block timestamp
  const blockTimestamp = await query.getBlockTimestamp();
  console.log(`Current zkSync block.timestamp returns ${blockTimestamp}`);

  // Try to get current block hash
  const blockHash = await query.getBlockHash();
  console.log(`Current zkSync block.hash returns ${blockHash}`);

  // Try to get block info
  const blockInfo = await query.getBlockInfo();
  console.log(`Current zkSync block.info returns ${blockInfo}`);
}
