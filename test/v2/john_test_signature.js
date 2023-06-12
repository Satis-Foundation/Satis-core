const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getContractAddress } = require('@ethersproject/address');
require('@nomiclabs/hardhat-web3');



describe ("Test Signature", function() {
    it ("Account Signature", async function() {

        const signers = await ethers.getSigners();
        console.log("Number of accounts: " + signers.length);

        const token_owner = signers[0];
        const pool_owner = signers[1];
        
        const token_contract = await ethers.getContractFactory("FiatTokenV1", token_owner);
        const token = await token_contract.deploy();
        console.log("Token contract deployed");

        const multi_sig_contract = await ethers.getContractFactory("MultiSig", pool_owner);
        const multi_sig = await multi_sig_contract.deploy();
        console.log(`MultiSig contract deployed at ${multi_sig.address}`);

        const action_contract = await ethers.getContractFactory("Action", pool_owner);
        const action = await action_contract.deploy(pool_owner.address);
        console.log(`Action contract deployed at ${action.address}`);

        const raw_contract = await ethers.getContractFactory("contracts/v2/satis_core/MoneyPoolRaw.sol:MoneyPoolRaw", {
            libraries: {
              MultiSig: multi_sig.address,
            },
        }, pool_owner);
        const pool = await raw_contract.deploy(action.address, action.address, {gasLimit: 1e7 });
        console.log(`Pool raw contract 1 deployed at ${pool.address}`);

        const proxy_contract = await ethers.getContractFactory("contracts/v2/satis_core/MoneyPoolProxy.sol:MoneyPoolV2", pool_owner);
        const proxy = await proxy_contract.deploy([], [], action.address);
        console.log(`Action contract deployed at ${proxy.address}`);

        // verifySignature(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce)
    })
}).timeout(1000000);