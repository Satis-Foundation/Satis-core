import { Provider } from "zksync-web3";
import * as ethers from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";

// load env file
import dotenv from "dotenv";
dotenv.config();

// load contract artifact. Make sure to compile first!
import * as queryArtifact from "../artifacts-zk/contracts/query.sol/QueryBlock.json";

const OWNER_PRIV_KEY = process.env.OWNER_PRIV_KEY || "";
const USER_PRIV_KEY = process.env.USER_PRIV_KEY || "";

if (!OWNER_PRIV_KEY || !USER_PRIV_KEY)
  throw "⛔️ Private key not detected! Add it to the .env file!";

// Address of the contract on zksync testnet
const queryContractAddress = "0x5f4dA089753b18728eFa2c5298780681C49bB52B";



// An example of a deploy script that will deploy and call a simple contract.
export default async function (hre: HardhatRuntimeEnvironment) {
  console.log(`Running query check script......`);

  // Initialize the provider.
  // @ts-ignore
  const provider = new Provider(hre.userConfig.networks?.zkSyncTestnet?.url);
  //const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  const signer = new ethers.Wallet(USER_PRIV_KEY, provider);

  // Initialise contract instance
  const queryContract = new ethers.Contract(
    queryContractAddress,
    queryArtifact.abi,
    signer
  );

  // Query
  const blockNo = await queryContract.getBlockNumber();
  const blockTimestamp = await queryContract.getBlockTimestamp();
  const blockHash = await queryContract.getBlockHash();
  const blockInfo = await queryContract.getBlockInfo();
  console.log(`Current zkSync block.number returns ${blockNo}`);
  console.log(`Current zkSync block.timestamp returns ${blockTimestamp}`);
  console.log(`Current zkSync block.hash returns ${blockHash}`);
  console.log(`Current zkSync block.info returns ${blockInfo}`);
}