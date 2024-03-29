import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
const { keccak256 } = require("@ethersproject/keccak256");

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
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";

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

const withdrawFinal = 0;
const in_debt = 1; // Just to queue and allow quote api to estimate without extra TX
const expBlockNo = 9999999999; // Just large enough so not expired
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



// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script for SATIS Pools initiation......`);


  async function withdrawSignature(nonce, client_address, token_address, withdraw_final, in_debt, tier, chain_id, pool_address, exp_block_no, ticket_id) {

    const owner = new ethers.Wallet(OWNER_PRIV_KEY, provider);
    const worker2 = new ethers.Wallet(WORKER2_PRIV_KEY, provider);
  
    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), in_debt.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase(), exp_block_no.toString(), ticket_id.toLowerCase() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const signature = await worker2.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
  }


  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  //const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const owner = new ethers.Wallet(OWNER_PRIV_KEY, provider);
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



  // Test withdraw
  // const ownerWithdrawNonce = await proxyContract.connect(owner).getClientNonce(owner.address, poolName);
  // console.log(`Withdraw nonce for owner: ${ownerWithdrawNonce}`);
  // console.log(`Owner address: ${owner.address}`);
  // const ownerSignature = await withdrawSignature(0, owner.address, zkc1Address, 19, 0, 3, 280, "0xE821d4D804B1Cfd3211e01e3cf5115c3B7cD9335", 122481, "a937cbb3-d85e-46d8-8af6-b11ffe45b1c8");
  // console.log(`Owner signature: ${ownerSignature}`);
  // const ownerWithdrawTx = await proxyContract.connect(owner).verifyAndPartialWithdrawFund(ownerSignature, zkc1Address, 19, 0, 3, expBlockNo, "a937cbb3-d85e-46d8-8af6-b11ffe45b1c8", ownerWithdrawNonce, poolName);
  // await ownerWithdrawTx.wait();
  // console.log(`Owner withdraw queue hash: ${ownerWithdrawTx.hash}`);

  // Queue withdraw for workers --> can do estimation all the time without extra TX
  const worker1WithdrawNonce = await proxyContract.connect(worker1).getClientNonce(worker1PubKey, poolName);
  console.log(`Withdraw nonce for worker 1: ${worker1WithdrawNonce}`);
  const worker2WithdrawNonce = await proxyContract.connect(worker2).getClientNonce(worker2PubKey, poolName);
  console.log(`Withdraw nonce for worker 2: ${worker2WithdrawNonce}`);

  var worker1TicketId = "worker1-test";
  var worker2TicketId = "worker2-test";
  const worker1Signature = await withdrawSignature(worker1WithdrawNonce, worker1PubKey, zkc1Address, withdrawFinal, in_debt, tier, chainId, rawPoolAddress, expBlockNo, worker1TicketId);
  const worker2Signature = await withdrawSignature(worker2WithdrawNonce, worker2PubKey, zkc1Address, withdrawFinal, in_debt, tier, chainId, rawPoolAddress, expBlockNo, worker2TicketId);


  const worker1WithdrawTx = await proxyContract.connect(worker1).verifyAndWithdrawFund(worker1Signature, zkc1Address, withdrawFinal, in_debt, tier, expBlockNo, worker1TicketId, worker1WithdrawNonce, poolName);
  await worker1WithdrawTx.wait();
  console.log(`Worker 1 withdraw queue hash: ${worker1WithdrawTx.hash}`);
  const worker2WithdrawTx = await proxyContract.connect(worker2).verifyAndWithdrawFund(worker2Signature, zkc1Address, withdrawFinal, in_debt, tier, expBlockNo, worker2TicketId, worker2WithdrawNonce, poolName);
  await worker2WithdrawTx.wait();
  console.log(`Worker 2 withdraw queue hash: ${worker2WithdrawTx.hash}`);

  const reserveValue = await rawPool.connect(worker1).getInstantWithdrawReserve([worker1TicketId, worker2TicketId],zkc1Address);
  //const reserveValue = await rawPool.instantWithdrawReserve(userPubKey, zkc1Address);
  console.log(`Reserved value for [worker1, worker2]: ${reserveValue}`);

  // Add fund for 5 USDC
  const approveTx = await zkc1.connect(worker1).approve(rawPoolAddress, addAmount);
  await approveTx.wait();
  const addTx = await proxyContract.connect(worker1).addFundWithAction(zkc1Address, addAmount, "meow", poolName);
  await addTx.wait();
  console.log(`Add hash: ${addTx.hash}`);
  console.log(`${addAmount/1e6} USDC is added through proxy to ${rawPoolAddress}`);
}