// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/IMoneyPoolRaw.sol";
import "../lib_and_interface/IAction.sol";

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
    address public actionContractAddress;
    mapping (string => address) public poolAddressList;
    mapping (address => bool) public workerList;

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

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not a worker");
        _;
    }

    /**
     * @dev Sets the value for {owner}, {workerList} and {poolList}
     */
    constructor(string[] memory _poolNameList, address[] memory _poolAddressList, address _actionContractAddress) {
        require(_poolNameList.length == _poolAddressList.length, "Lists' length is different");
        owner = msg.sender;
        workerList[owner] = true;
        for(uint256 i=0; i < _poolAddressList.length; i++) {
            poolAddressList[_poolNameList[i]] = _poolAddressList[i];
        }
        actionContractAddress = _actionContractAddress;
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
    function getClientDepositRecord(address _clientAddress, address _tokenAddress, string memory _poolName) external view returns(uint256 clientDepositRecord) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        clientDepositRecord = poolContract.getClientDepositRecord(_clientAddress, _tokenAddress);
    }

    /**
     * @dev Get client's locked balance in a pool.
     */
    function getLiquidityAmountInPool(address _tokenAddress, string memory _poolName) external view returns(uint256 liquidityInPool) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        liquidityInPool = poolContract.getLiquidityAmountInPool(_tokenAddress);
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
     * @dev Check if an address is a worker.
     */
    function verifyWorker(address _workerAddress) public view returns(bool _isWorker) {
        _isWorker = workerList[_workerAddress];
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
    function transferOwnershipMoneyPoolProxy(address _newOwner) external isOwner {
        owner = _newOwner;
        emit ChangeOwnership(owner);
    }

    /**
     * @dev Add workers to this contract.
     */
    function addWorkers(address[] memory _addWorkerList) external isOwner {
        for(uint256 i=0; i < _addWorkerList.length; i++) {
            workerList[_addWorkerList[i]] = true;
        }
    }

    /**
     * @dev Remove workers from this contract.
     */
    function removeWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            workerList[_removeWorkerList[i]] = false;
        }
    }

    /**
     * @dev Append and overwrite pool address list. Set address to 0x0 for deleting pool.
     */
    function changePool(string[] memory _newPoolNameList, address[] memory _newPoolAddressList) external isWorker {
        require(_newPoolNameList.length == _newPoolAddressList.length, "Lists' length is different");
        for(uint256 i=0; i < _newPoolAddressList.length; i++) {
            poolAddressList[_newPoolNameList[i]] = _newPoolAddressList[i];
        }
        emit ChangePoolAddress(_newPoolAddressList);
    }

    /**
     * @dev Change action contract address for new event output format.
     */
    function changeActionContract(address _newActionContractAddress) external isWorker {
        actionContractAddress = _newActionContractAddress;
    }

    /**
     * @dev Transfers fund to the pool contract
     */
    function addFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        bool _addDone = poolContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue, int256(_tokenValue));
        IAction actionContract = IAction(actionContractAddress);
        bool _eventDone = actionContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
        _isDone = _addDone && _eventDone;
    }

    /**
     * @dev Verify signature to withdraw fund instantly
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _withdrawValue, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        bool _withdrawDone = poolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _withdrawValue, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        bool _eventDone = actionContract.withdrawFund(msg.sender, _tokenAddress, _withdrawValue);
        _isDone = _withdrawDone && _eventDone;
    }

    /**
     * @dev Verify signature to unlock and remove fund in 1 step
     */
    function verifyAndQueue(bytes memory _targetSignature, address _tokenAddress, uint256 _queueValue, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        bool _queueDone = poolContract.verifyAndQueue(_targetSignature, msg.sender, _tokenAddress, _queueValue, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        bool _eventDone = actionContract.queueWithdraw(msg.sender, _tokenAddress, _queueValue);
        _isDone = _queueDone && _eventDone;
    }
}