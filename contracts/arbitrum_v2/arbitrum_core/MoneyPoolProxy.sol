// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/IMoneyPoolRaw.sol";
import "../lib_and_interface/IAction.sol";
import "../lib_and_interface/ISwapProxy.sol";
import "../lib_and_interface/Address.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";

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

    using SafeERC20 for IERC20;

    address public owner;
    address public actionContractAddress;
    address public swapProxyAddress;
    mapping (address => bool) public enabledCurrency;
    mapping (string => address) public poolAddressList;
    mapping (address => bool) public swapControllerList;
    mapping (address => bool) public workerList;

    /**
     * Events that will be triggered when assets are deposited.
     * The log files will record the sender, recipient and transaction data.
     */
    event ChangeOwnership(address newAdminAddress);
    event ChangePoolAddress(address[] newlyAddedPoolAddressList);
    event AddWorkers(address[] addWorkerList);
    event RemoveWorkers(address[] removeWorkerList);
    event ChangeSwapControllers(address[] changeControllerList, bool isAdd);
    event ChangeReceiveCurrency(address[] changeCurrencyList, bool isAdd);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isSwapController() {
        require (swapControllerList[msg.sender] == true, "Not an admin or worker");
        _;
    }

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not a worker");
        _;
    }

    /**
     * @dev Sets the value for {owner}, {workerList} and {poolList}
     */
    constructor(address[] memory _currencyList, string[] memory _poolNameList, address[] memory _poolAddressList, address _actionContractAddress, address _swapProxyAddress) {
        require(_currencyList.length > 0, "Enable at least one currency");
        require(_actionContractAddress != address(0), "Zero address for action contract");
        require(_poolNameList.length == _poolAddressList.length, "Lists' length is different");
        owner = msg.sender;
        workerList[owner] = true;
        for(uint256 i=0; i < _poolAddressList.length; i++) {
            poolAddressList[_poolNameList[i]] = _poolAddressList[i];
        }
        actionContractAddress = _actionContractAddress;
        swapProxyAddress = _swapProxyAddress;
        for(uint256 i=0; i < _currencyList.length; i++) {
            enabledCurrency[_currencyList[i]] = true;
        }
    }

    /**
     * @dev Get client's nonce in a pool.
     */
    function getClientNonce(address _clientAddress, string memory _poolName) external view returns(uint256 clientNonce) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        clientNonce = poolContract.clientNonce(_clientAddress);
    }

    /**
     * @dev Get client's locked balance in a pool.
     */
    function getLiquidityAmountInPool(address _tokenAddress, string memory _poolName) external view returns(uint256 liquidityInPool) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        liquidityInPool = poolContract.totalLockedAssets(_tokenAddress);
    }

    /**
     * @dev Get the particular pool's owner.
     */
    function getPoolOwner(string memory _poolName) external view returns(address poolOwner) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        poolOwner = poolContract.owner();
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnershipMoneyPoolProxy(address _newOwner) external isOwner {
        require(_newOwner != address(0), "Zero address for new owner");
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
        emit AddWorkers(_addWorkerList);
    }

    /**
     * @dev Remove workers from this contract.
     */
    function removeWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            workerList[_removeWorkerList[i]] = false;
        }
        emit RemoveWorkers(_removeWorkerList);
    }

    /**
     * @dev Add swap controller to this contract.
     */
    function addSwapController(address[] memory _addSwapControllerList) external isOwner {
        for(uint256 i=0; i < _addSwapControllerList.length; i++) {
            swapControllerList[_addSwapControllerList[i]] = true;
        }
        emit ChangeSwapControllers(_addSwapControllerList, true);
    }

    /**
     * @dev Remove swap controller from this contract.
     */
    function removeSwapController(address[] memory _removeSwapControllerList) external isOwner {
        for(uint256 i=0; i < _removeSwapControllerList.length; i++) {
            swapControllerList[_removeSwapControllerList[i]] = false;
        }
        emit ChangeSwapControllers(_removeSwapControllerList, false);
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
        require(_newActionContractAddress != address(0), "Zero address for new action contract");
        actionContractAddress = _newActionContractAddress;
    }

    /**
     * @dev Change swap router address.
     */
    function changeSwapProxy(address _newSwapProxyAddress) external isWorker {
        require(_newSwapProxyAddress != address(0), "Zero address for new swap router");
        swapProxyAddress = _newSwapProxyAddress;
    }

    /**
     * @dev Add receive currency type.
     */
    function addCurrency(address[] memory _currencyList) external isSwapController {
        for(uint256 i=0; i < _currencyList.length; i++) {
            enabledCurrency[_currencyList[i]] = true;
        }
        emit ChangeReceiveCurrency(_currencyList, true);
    }

    /**
     * @dev Remove receive currency type.
     */
    function removeCurrency(address[] memory _currencyList) external isSwapController {
        for(uint256 i=0; i < _currencyList.length; i++) {
            enabledCurrency[_currencyList[i]] = false;
        }
        emit ChangeReceiveCurrency(_currencyList, false);
    }

    /**
     * @dev Transfers fund to the pool contract
     */
    function addFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        bool _addDone = false;
        if (_tokenValue > 0) {
            IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
            _addDone = poolContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue, false);
        } else {
            _addDone = true;
        }
        bool _eventDone = addFundEvent(msg.sender, _tokenAddress, _tokenValue, _data);
        _isDone = _addDone && _eventDone;
    }

    /**
     * @dev Swap fund then add fund
     */
    function swapFundWithAction(address _tokenIn, address _tokenSwap, uint256 _tokenInAmount, uint24 _poolFee, uint256 _minAmountSwap, uint160 _sqrtPriceLimitX96, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        require(enabledCurrency[_tokenSwap] == true, "Currency not supported");
        ISwapProxy swapProxy = ISwapProxy(swapProxyAddress);
        uint256 _tokenOutAmount = swapProxy.swap(msg.sender, _tokenIn, _tokenSwap, _tokenInAmount, _poolFee, _minAmountSwap, _sqrtPriceLimitX96);
        // address(this) wil be swap receiver, send token to raw pool
        IERC20 tokenSwap = IERC20(_tokenSwap);
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        tokenSwap.safeTransfer(poolAddressList[_poolName], _tokenOutAmount);
        bool _addDone = poolContract.addFundWithAction(msg.sender, _tokenSwap, _tokenOutAmount, true);
        bool _eventDone = addFundEvent(msg.sender, _tokenSwap, _tokenInAmount, _data);
        _isDone = _addDone && _eventDone;
    }

    /**
     * Internal function for add fund event, prevent stack too deep.
     */
    function addFundEvent(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) internal returns(bool _isDone) {
        IAction actionContract = IAction(actionContractAddress);
        _isDone = actionContract.addFundWithAction(_clientAddress, _tokenAddress, _tokenValue, _data);
    }

    /**
     * @dev Tier 1 withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _withdrawValue, uint256 _inDebtValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 1, "Wrong function called for withdraw tier");
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        poolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _withdrawValue, _inDebtValue, _tier, block.chainid, poolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        actionContract.withdrawFund(_ticketId, msg.sender, _tokenAddress, _withdrawValue, _inDebtValue);
        _isDone = true;
    }

    /**
     * @dev Tier 2 withdrawal
     */
    function verifyAndQueue(bytes memory _targetSignature, address _tokenAddress, uint256 _queueValue, uint256 _inDebtValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 2, "Wrong function called for withdraw tier");
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        poolContract.verifyAndQueue(_targetSignature, msg.sender, _tokenAddress, _queueValue, _inDebtValue, _tier, block.chainid, poolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        actionContract.queueWithdraw(_ticketId, msg.sender, _tokenAddress, _queueValue);
        _isDone = true;
    }

    /**
     * @dev Tier 3 withdrawal
     */
    function verifyAndPartialWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _partialWithdrawValue, uint256 _inDebtValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 3, "Wrong function called for withdraw tier");
        require(poolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw poolContract = IMoneyPoolRaw(poolAddressList[_poolName]);
        poolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _partialWithdrawValue, _inDebtValue, _tier, block.chainid, poolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        IAction actionContract = IAction(actionContractAddress);
        actionContract.withdrawFund(_ticketId, msg.sender, _tokenAddress, _partialWithdrawValue, _inDebtValue);
        _isDone = true;
    }
}