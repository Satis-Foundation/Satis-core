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
    event ChangeWorkers(bool isAdd, address[] changeList);

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
        require(_actionContractAddress != address(0), "0 addr action contract");
        require(_poolNameList.length == _poolAddressList.length, "List length inconsistent");
        owner = msg.sender;
        workerList[owner] = true;
        for(uint256 i=0; i < _poolAddressList.length; i++) {
            poolAddressList[_poolNameList[i]] = _poolAddressList[i];
        }
        actionContractAddress = _actionContractAddress;
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnershipMoneyPoolProxy(address _newOwner) external isOwner {
        require(_newOwner != address(0), "0 addr");
        workerList[owner] = false;
        owner = _newOwner;
        workerList[owner] = true;
        emit ChangeOwnership(owner);
    }

    /**
     * @dev Add workers to this contract.
     */
    function addWorkers(address[] memory _addWorkerList) external isOwner {
        for(uint256 i=0; i < _addWorkerList.length; i++) {
            workerList[_addWorkerList[i]] = true;
        }
        emit ChangeWorkers(true, _addWorkerList);
    }

    /**
     * @dev Remove workers from this contract.
     */
    function removeWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            workerList[_removeWorkerList[i]] = false;
        }
        emit ChangeWorkers(false, _removeWorkerList);
    }

    /**
     * @dev Append and overwrite pool address list. Set address to 0x0 for deleting pool.
     */
    function changePool(string[] memory _newPoolNameList, address[] memory _newPoolAddressList) external isWorker {
        require(_newPoolNameList.length == _newPoolAddressList.length, "List length inconsistent");
        for(uint256 i=0; i < _newPoolAddressList.length; i++) {
            poolAddressList[_newPoolNameList[i]] = _newPoolAddressList[i];
        }
        emit ChangePoolAddress(_newPoolAddressList);
    }

    /**
     * @dev Change action contract address for new event output format.
     */
    function changeActionContract(address _newActionContractAddress) external isWorker {
        require(_newActionContractAddress != address(0), "0 addr");
        actionContractAddress = _newActionContractAddress;
    }

    /**
     * @dev Transfers fund to the pool contract
     */
    function addFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        bool _addDone = false;
        if (_tokenValue > 0) {
            IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
            _addDone = poolContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue);
        } else {
            _addDone = true;
        }
        IAction actionContract = IAction(actionContractAddress);
        bool _eventDone = actionContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
        _isDone = _addDone && _eventDone;
    }

    /**
     * @dev Withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        bool _withdrawDone = poolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _withdrawValue, _tier, _chainId, _poolAddress, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        bool _eventDone = actionContract.queueWithdraw(msg.sender, _tokenAddress, _withdrawValue, _tier);
        _isDone = _withdrawDone && _eventDone;
    }
}