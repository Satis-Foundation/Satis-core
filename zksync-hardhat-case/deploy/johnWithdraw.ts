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
import * as proxyArtifact from "../../abi/v2/satis_core/MoneyPoolProxy.sol/MoneyPoolV2.json";
import * as sigmaProxyArtifact from "../artifacts-zk/contracts/SigmaPoolProxy.sol/SigmaPoolV2.json";
import * as zkc1Artifact from "../artifacts-zk/contracts/C5.sol/TestTokenCZK.json";

const OWNER_PRIV_KEY = process.env.OWNER_PRIV_KEY || "";
const USER_PRIV_KEY = process.env.USER_PRIV_KEY || "";

if (!OWNER_PRIV_KEY || !USER_PRIV_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const actionContractAddress = "0x7a81B74660e4321Ba4805efE82CB3f357C9ecF2C";
const sigmaActionContractAddress = "";
const proxyContractAddress = "0xFC075Af2F9eE894166E5c2E7d793689254Ce7ac7";
const sigmaProxyContractAddress = "";
const rawPoolAddress = "0x506783B08aAE7d24EE264e17E73d9db18969Ab74";
//const zkc1Address = "0x863e396Ac520bD845af42BA7ad8929f328B3fb61";
const zkc1Address = "0x0faF6df7054946141266420b43783387A78d82A9";

const signature = "0x35fc0d08bdaf42fe78635ccf25ab64a2e907feb6d33e330c96edb708a3f44a2c4d5790b8090333b34d409739e3700beec51b30360bea4bbc903fff7495127ac91b";
const userPubKey = "0xc4adcf8814a1da13522716a23331ce4d48a1414d";
const withdrawFinal = 49534902;
const tier = 1;
const chainId = 280;



// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running script......`);


  async function withdrawSignature(nonce, client_address, token_address, withdraw_final, tier, chain_id, pool_address) {

    const owner = new ethers.Wallet(OWNER_PRIV_KEY, provider);
  
    const abiCoder = new ethers.utils.AbiCoder();
    const encodeHash = keccak256(abiCoder.encode([ "string", "string", "string", "string", "string", "string", "string" ], [ nonce.toString(), client_address.toLowerCase(), token_address.toLowerCase(), withdraw_final.toString(), tier.toString(), chain_id.toString(), pool_address.toLowerCase() ]));
    const byteMsg = ethers.utils.arrayify(encodeHash);
    const signature = await owner.signMessage(byteMsg);
    
    console.log(`Signature: ${signature}`);
    return signature;
  }


  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  //const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = new ethers.Wallet(USER_PRIV_KEY, provider);

  // Initialise contract instance
  const actionContract = new ethers.Contract(
    actionContractAddress,
    actionArtifact.abi,
    signer
  );
  const sigmaActionContract = new ethers.Contract(
    sigmaActionContractAddress,
    sigmaActionArtifact.abi,
    signer
  );
  const rawPool = new ethers.Contract(
    rawPoolAddress,
    rawPoolArtifact.abi,
    signer
  );
  const zkc1 = new ethers.Contract(
    zkc1Address,
    zkc1Artifact.abi,
    signer
  );
  const proxyContract = new ethers.Contract(
    proxyContractAddress,
    proxyArtifact.abi,
    signer
  );

//   // Set Proxy address to Action
//   const setProxyToActionTx = await actionContract.updateProxyAddress(proxyContractAddress);
//   await setProxyToActionTx.wait();
//   console.log(`Set Proxy address to Action hash: ${setProxyToActionTx.hash}`);

//   // Set Sigma Proxy address to Sigma Action
//   const setSigmaProxyToSigmaActionTx = await sigmaActionContract.updateProxyAddress(sigmaProxyContractAddress);
//   await setSigmaProxyToSigmaActionTx.wait();
//   console.log(`Set Sigma Proxy address to Sigma Action hash: ${setSigmaProxyToSigmaActionTx.hash}`);

//   // Set addresses to Raw Pool
//   const setProxyToRawPoolTx = await rawPool.updateProxyAddress(proxyContractAddress);
//   await setProxyToRawPoolTx.wait();
//   console.log(`Set Proxy to Raw Pool hash: ${setProxyToRawPoolTx.hash}`);
//   const setSigmaProxyToRawPoolTx = await rawPool.updateSigmaProxyAddress(sigmaProxyContractAddress);
//   await setSigmaProxyToRawPoolTx.wait();
//   console.log(`Set Sigma Proxy to Raw Pool hash: ${setSigmaProxyToRawPoolTx.hash}`);
//   console.log();

  // Withdraw fund
  const withdrawNonce = await proxyContract.getClientNonce(userPubKey, "test");
  console.log(`Withdraw nonce: ${withdrawNonce}`);

  const signature = await withdrawSignature(withdrawNonce, userPubKey, zkc1Address, withdrawFinal, tier, 280, rawPoolAddress);

  const reserveValue = await rawPool.getClientInstantWithdrawReserve([userPubKey],zkc1Address);
  //const reserveValue = await rawPool.instantWithdrawReserve(userPubKey, zkc1Address);
  console.log(`Reserve value: ${reserveValue}`);

  // const withdrawTx = await proxyContract.verifyAndWithdrawFund(signature, zkc1Address, withdrawFinal, tier, chainId, rawPoolAddress, withdrawNonce, "test");
  const withdrawTx = await proxyContract.verifyAndPartialWithdrawFund(signature, zkc1Address, withdrawFinal, tier, withdrawNonce, "satis-v2");
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