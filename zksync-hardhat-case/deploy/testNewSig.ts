import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const { keccak256 } = require("@ethersproject/keccak256");
const needle = require('needle');

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

const OWNER_PRIV_KEY = process.env.OWNER_PRIV_KEY || "";
const WORKER1_PRIV_KEY = process.env.WORKER1_PRIV_KEY || "";
const WORKER2_PRIV_KEY = process.env.WORKER2_PRIV_KEY || "";

if (!OWNER_PRIV_KEY || !WORKER1_PRIV_KEY || !WORKER2_PRIV_KEY)
  throw "⛔️ Private keys not detected! Add them to the .env file!";

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

// Load initiation var from .env

const poolName = process.env.POOL_NAME || "";
const addAmountStr = process.env.ADD_AMT || "";

const withdrawFinal = 1; // Just to queue and allow quote api to estimate without extra TX
const expBlockNo = 1; // Just large enough so not expired
const worker1PubKey = process.env.WORKER1_PUB_KEY || "";
const worker2PubKey = process.env.WORKER2_PUB_KEY || "";
const tier = 1;
const chainIdStr = process.env.CHAIN_ID || "";

if (!poolName) {
  throw "No Pool name! Add them to the .env file!";
}
if (!addAmountStr) {
  throw "No add amount! Add them to the .env file!";
}
if (!worker1PubKey || !worker2PubKey) {
  throw "No worker public key! Add them to the .env file!";
}
if (!chainIdStr) {
  throw "No chain id! Add them to the .env file!";
}

const addAmount = Number(addAmountStr);
const chainId = Number(chainIdStr);



// async function getBlockTime(network) {
//     const rpcUrl = "https://testnet.era.zksync.dev/";
//     const networkProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
//     var currentBlockNo = await networkProvider.getBlockNumber();
//     var currentBlock = await networkProvider.getBlock(currentBlockNo);
//     var oldBlock = await networkProvider.getBlock(currentBlockNo - 20);
//     var currentBlockTimestamp = currentBlock.timestamp;
//     var oldTenBlockTimestamp = oldBlock.timestamp;
//     var blockTime = (currentBlockTimestamp-oldTenBlockTimestamp)/20;
//     console.log(`Estimated block time in 20 blocks is ${blockTime}`)
//     return blockTime;
// }

// async function getExpiryBlockNo(network) {
//     const rpcUrl = "https://testnet.era.zksync.dev/";
//     const networkProvider = new ethers.providers.JsonRpcProvider(rpcUrl);
//     const currentBlockNo = await networkProvider.getBlockNumber();
//     const currentBlockTime = await getBlockTime(network);
//     var expiryTime = 60;
//     const expiryBlocks = Math.ceil(expiryTime / currentBlockTime);
//     console.log(`Current block number is ${currentBlockNo} on ${network}`);
//     console.log(`Target expiry block for ${network} is ${expiryBlocks} later`);
//     return expiryBlocks + currentBlockNo;
// }

// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script......`);


  async function withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address, exp_block_no) {

    const owner = new ethers.Wallet(OWNER_PRIV_KEY, provider);
  
    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const signature = await owner.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
  }


  async function getL1BatchTimestamp(batchNo) {
    const rpcUrl = "https://testnet.era.zksync.dev/";
    const postObj = JSON.stringify({"jsonrpc": "2.0", "id": 1, "method": "zks_getL1BatchDetails", "params": [batchNo]});
    const header = {"headers":{'Content-type':"application/json"}};
    const res = await needle("post",rpcUrl, postObj,header);
    const batchTimestamp = res.body.result.timestamp;
    console.log(`Batch timestamp for ${batchNo}: ${batchTimestamp}`);
    return batchTimestamp;
  }


  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  //const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const worker1 = new ethers.Wallet(WORKER1_PRIV_KEY, provider);
  const worker2 = new ethers.Wallet(WORKER2_PRIV_KEY, provider);

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


  // Current block number
  const currentBlockNo = await provider.getBlockNumber();
  console.log(`Zksync block number returned from provider: ${currentBlockNo}`);

  // Current batch number
  const currentBlockInfo = await provider.getBlockDetails(currentBlockNo);
  console.log(`Block info: ${Object.keys(currentBlockInfo)}`);
  //const currentBatchNo = currentBlockInfo.l1BatchNumber;
  const currentBatchNo = await provider.getL1BatchNumber();
  console.log(`Current batch no: ${currentBatchNo}`);
  const currentBatchTimestamp = await getL1BatchTimestamp(currentBatchNo);
  console.log(`Current batch timestamp: ${currentBatchTimestamp}`);

  // Calculate batch time
  const pastBatchTimestamp = await getL1BatchTimestamp(currentBatchNo-10);
  console.log(`Past 10 batch timestamp: ${pastBatchTimestamp}`);
  const batchTime = (currentBatchTimestamp - pastBatchTimestamp)/10;
  console.log(`Avergae batch time for 10 batches is ${batchTime}`);

  // Queue withdraw for workers --> can do estimation all the time without extra TX
  const worker1WithdrawNonce = await proxyContract.connect(worker1).getClientNonce(worker1PubKey, poolName);
  console.log(`Withdraw nonce for worker 1: ${worker1WithdrawNonce}`);

  const worker1Signature = await withdrawSignature(worker1WithdrawNonce, worker1PubKey, zkc1Address, withdrawFinal, tier, chainId, rawPoolAddress, currentBatchNo + 1);

//   const worker1WithdrawTx = await proxyContract.connect(worker1).verifyAndWithdrawFund(worker1Signature, zkc1Address, withdrawFinal, tier, currentBatchNo + 1, worker1WithdrawNonce, poolName);
//   await worker1WithdrawTx.wait();
//   console.log(`Worker 1 withdraw queue hash: ${worker1WithdrawTx.hash}`);

  const reserveValue = await rawPool.connect(worker1).getClientInstantWithdrawReserve([worker1PubKey, worker2PubKey],zkc1Address);
  //const reserveValue = await rawPool.instantWithdrawReserve(userPubKey, zkc1Address);
  console.log(`Reserved value for [worker1, worker2]: ${reserveValue}`);
}