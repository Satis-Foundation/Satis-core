// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/IMoneyPoolRaw.sol";

/**
 * This contract is a simple money pool for deposit.
 * It supports transfer and withdrawal of assets (ETH and ERC20 tokens).
 * (In most of the Layer 2 implementations, wrapped Ether is used instead).
 *
 * This contract uses Openzeppelin's library for ERC20 tokens.
 * When deploying on certain L2s (such as Optimism), it requires a slight modification
 * of the original ERC20 token library, since some OVMs do not support ETH functions.
 */

// import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
// import '@openzeppelin/contracts/math/SafeMath.sol';

contract MoneyPoolV2 {

    address public owner;
    mapping (string => address) public poolAddressList;

    /**
     * Events that will be triggered when assets are deposited.
     * The log files will record the sender, recipient and transaction data.
     */
    event ChangeOwnership(address newAdminAddress);
    event ChangePoolAddress(address[] newlyAddedPoolAddressList);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    /**
     * @dev Sets the value for {owner}
     */
    constructor(string[] memory _poolNameList, address[] memory _poolAddressList) {
        require(_poolNameList.length == _poolAddressList.length, "Lists' length is different");
        owner = msg.sender;
        for(uint256 i=0; i < _poolAddressList.length; i++) {
            poolAddressList[_poolNameList[i]] = _poolAddressList[i];
        }
    }

    /**
     * @dev Get client's nonce in a pool.
     */
    function getClientNonce(address _clientAddress, string memory _poolName) external view returns(uint256 clientNonce) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        clientNonce = poolContract.getClientNonce(_clientAddress);
    }

    /**
     * @dev Get client's balance in a pool.
     */
    function getClientBalance(address _clientAddress, address _tokenAddress, string memory _poolName) external view returns(uint256 clientBalance) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        clientBalance = poolContract.getClientBalance(_clientAddress, _tokenAddress);
    }

    /**
     * @dev Get client's locked balance in a pool.
     */
    function getClientLockBalance(address _clientAddress, address _tokenAddress, string memory _poolName) external view returns(uint256 clientLockBalance) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        clientLockBalance = poolContract.getClientLockBalance(_clientAddress, _tokenAddress);
    }

    /**
     * @dev Get the particular pool's owner.
     */
    function getPoolOwner(string memory _poolName) external view returns(address poolOwner) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        poolOwner = poolContract.getPoolOwner();
    }

    /**
     * @dev Get a pool's address with its name.
     */
    function getPoolAddress(string memory _poolName) public view returns(address _poolAddress) {
        _poolAddress = poolAddressList[_poolName];
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnership(address _newOwner) external isOwner {
        owner = _newOwner;
        emit ChangeOwnership(owner);
    }

    /**
     * @dev Append and overwrite pool address list. Set address to 0x0 for deleting pool.
     */
    function changePool(string[] memory _newPoolNameList, address[] memory _newPoolAddressList) external {
        require(_newPoolNameList.length == _newPoolAddressList.length, "Lists' length is different");
        for(uint256 i=0; i < _newPoolAddressList.length; i++) {
            poolAddressList[_newPoolNameList[i]] = _newPoolAddressList[i];
        }
        emit ChangePoolAddress(_newPoolAddressList);
    }

    /**
     * @dev Transfers fund to this contract
     */
    function addFund(address _tokenAddress, uint256 _tokenValue, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        _isDone = poolContract.addFund(msg.sender, _tokenAddress, _tokenValue);
    }

    /**
     * @dev Locks fund within this contract to support trading positoins with optional trading instructions.
     */
    function lockFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        _isDone = poolContract.lockFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function addFundWithAction(address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        bool _addDone = poolContract.addFund(msg.sender, _tokenAddress, _addValue);
        bool _lockDone = poolContract.lockFundWithAction(msg.sender, _tokenAddress, _lockValue, _data);
        _isDone = _addDone && _lockDone;
    }

    /**
     * @dev Remove fund from this contract.
     */
    function removeFund(address _tokenAddress, uint256 _tokenValue, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        _isDone = poolContract.removeFund(msg.sender, _tokenAddress, _tokenValue);
    }

    /**
     * @dev Verify signature to unlock fund
     */
    function verifyAndUnlockFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        _isDone = poolContract.verifyAndUnlockFund(_targetSignature, msg.sender, _tokenAddress, _unlockValue, _nonce, _newLockValue);
    }

    /**
     * @dev Verify signature to unlock and remove fund in 1 step
     */
    function verifyAndRemoveFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        _isDone = poolContract.verifyAndRemoveFund(_targetSignature, msg.sender, _tokenAddress, _unlockValue, _withdrawValue, _nonce, _newLockValue);
    }
}