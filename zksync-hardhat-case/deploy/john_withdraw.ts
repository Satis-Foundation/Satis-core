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

import * as input from "../input.json";


const OWNER_PRIV_KEY = process.env.OWNER_PRIV_KEY || "";
const USER_PRIV_KEY = process.env.USER_PRIV_KEY || "";

if (!OWNER_PRIV_KEY || !USER_PRIV_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

const proxyContractAddress = "0xDc99107e8232766d632D674a743093648dAACa62";



// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script......`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  const signer = new ethers.Wallet(USER_PRIV_KEY, provider);

  const proxyContract = new ethers.Contract(
    proxyContractAddress,
    proxyArtifact.abi,
    signer
  );

  const withdrawTx = await proxyContract.verifyAndPartialWithdrawFund(input.withdrawal_hash, input.token_address, input.withdrawal_final, input.in_debt, input.tier, input.timeout_block_no, input.ticket_id, input.nonce, input.pool_name);
  await withdrawTx.wait();
  console.log(`Withdraw queue hash: ${withdrawTx.hash}`);

  // Add fund
  // const addValue = 448604706;
  // const approveTx = await zkc1.approve(rawPoolAddress, addValue);
  // await approveTx.wait();
  // const addTx = await proxyContract.addFundWithAction(zkc1Address, addValue, "meow", "test");
  // await addTx.wait();
  // console.log(`Add hash: ${addTx.hash}`);
}