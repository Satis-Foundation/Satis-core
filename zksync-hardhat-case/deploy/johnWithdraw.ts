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

const OWNER_PRIV_KEY = process.env.OWNER_PRIV_KEY || "";
const USER_PRIV_KEY = process.env.USER_PRIV_KEY || "";

if (!OWNER_PRIV_KEY || !USER_PRIV_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const actionContractAddress = "0x40573B24591B8B470675971758c9C6C2C65e47EB";
const sigmaActionContractAddress = "0xDf78A1ddCAfCc84b5490BAC0AB1846a6B1572419";
const proxyContractAddress = "0xDc99107e8232766d632D674a743093648dAACa62";
const sigmaProxyContractAddress = "0xD4dc846f9717b1b481D71F4eaEdB1888972c17e6";
const rawPoolAddress = "0x0A41E531abc8d74E850DFdF750d50bD58a1E3913";
//const zkc1Address = "0x863e396Ac520bD845af42BA7ad8929f328B3fb61";
const zkc1Address = "0x0faF6df7054946141266420b43783387A78d82A9";

//const signature = "0x3e71dcb267011ba231b891e418287920d1d11712d897343e9783caf519ebeb9060730c2a783ff8396ca20fc0c66819771fc4ca26ecb6d91d15cd8fd250c2512c1b";
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

  const withdrawTx = await proxyContract.verifyAndWithdrawFund(signature, zkc1Address, withdrawFinal, tier, chainId, rawPoolAddress, withdrawNonce, "test");
  await withdrawTx.wait();
  console.log(`Withdraw queue hash: ${withdrawTx.hash}`);
}