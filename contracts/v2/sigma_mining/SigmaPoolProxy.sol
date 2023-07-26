// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/IMoneyPoolRaw.sol";
import "../lib_and_interface/ISigmaAction.sol";

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

contract SigmaPoolV2 {

    address public sigmaOwner;
    address public sigmaActionContractAddress;
    mapping (string => address) public sigmaPoolAddressList;
    mapping (address => bool) public sigmaProxyWorkerList;

    /**
     * Events that will be triggered when assets are deposited.
     * The log files will record the sender, recipient and transaction data.
     */
    event ChangeOwnership(address newAdminAddress);
    event ChangePoolAddress(address[] newlyAddedPoolAddressList);
    event AddWorkers(address[] addWorkerList);
    event RemoveWorkers(address[] removeWorkerList);

    modifier isOwner() {
        require (msg.sender == sigmaOwner, "Not an admin");
        _;
    }

    modifier isWorker() {
        require (sigmaProxyWorkerList[msg.sender] == true, "Not a worker");
        _;
    }

    /**
     * @dev Sets the value for {owner}
     */
    constructor(string[] memory _sigmaPoolNameList, address[] memory _sigmaPoolAddressList, address _sigmaActionContractAddress) {
        require(_sigmaActionContractAddress != address(0), "Zero address for sigma action contract");
        require(_sigmaPoolNameList.length == _sigmaPoolAddressList.length, "Lists' length is different");
        sigmaOwner = msg.sender;
        sigmaProxyWorkerList[sigmaOwner] = true;
        for(uint256 i=0; i < _sigmaPoolAddressList.length; i++) {
            sigmaPoolAddressList[_sigmaPoolNameList[i]] = _sigmaPoolAddressList[i];
        }
        sigmaActionContractAddress = _sigmaActionContractAddress;
    }

    /**
     * @dev Get client's nonce in a pool.
     */
    function getClientSigmaNonce(address _clientAddress, string memory _poolName) external view returns(uint256 clientSigmaNonce) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        clientSigmaNonce = sigmaPoolContract.clientNonce(_clientAddress);
    }

    /**
     * @dev Get client's locked balance in a pool.
     */
    function getLiquidityAmountInPool(address _tokenAddress, string memory _poolName) external view returns(uint256 liquidityInPool) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        liquidityInPool = sigmaPoolContract.totalLockedAssets(_tokenAddress);
    }

    /**
     * @dev Get contract's storage of SATIS tokens.
     */
    function getSatisTokenAmountInContract(address _tokenAddress, string memory _poolName) public view returns(uint256 satisTokenInPool) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        satisTokenInPool = sigmaPoolContract.satisTokenBalance(_tokenAddress);
    }

    /**
     * @dev Get the particular pool's owner.
     */
    function getSigmaPoolOwner(string memory _poolName) external view returns(address sigmaPoolOwner) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        sigmaPoolOwner = sigmaPoolContract.owner();
    }

    /**
     * @dev Get a pool's address with its name.
     */
    function getSigmaPoolAddress(string memory _poolName) public view returns(address _sigmaPoolAddress) {
        _sigmaPoolAddress = sigmaPoolAddressList[_poolName];
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnershipSigmaPoolProxy(address _newOwner) external isOwner {
        require(_newOwner != address(0), "Zero address for new sigma owner");
        sigmaProxyWorkerList[sigmaOwner] = false;
        sigmaOwner = _newOwner;
        sigmaProxyWorkerList[sigmaOwner] = true;
        emit ChangeOwnership(sigmaOwner);
    }

    /**
     * @dev Add workers to this contract.
     */
    function addWorkers(address[] memory _addWorkerList) external isOwner {
        for(uint256 i=0; i < _addWorkerList.length; i++) {
            sigmaProxyWorkerList[_addWorkerList[i]] = true;
        }
        emit AddWorkers(_addWorkerList);
    }

    /**
     * @dev Remove workers from this contract.
     */
    function removeWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            sigmaProxyWorkerList[_removeWorkerList[i]] = false;
        }
        emit RemoveWorkers(_removeWorkerList);
    }

    function verifySigmaProxyWorker(address _workerAddress) external view returns(bool _isWorker) {
        _isWorker = sigmaProxyWorkerList[_workerAddress];
    }

    /**
     * @dev Append and overwrite pool address list. Set address to 0x0 for deleting pool.
     */
    function changeSigmaPool(string[] memory _newPoolNameList, address[] memory _newPoolAddressList) external isWorker {
        require(_newPoolNameList.length == _newPoolAddressList.length, "Lists' length is different");
        for(uint256 i=0; i < _newPoolAddressList.length; i++) {
            sigmaPoolAddressList[_newPoolNameList[i]] = _newPoolAddressList[i];
        }
        emit ChangePoolAddress(_newPoolAddressList);
    }

    /**
     * @dev Change sigma event emission contract
     */
    function changeSigmaActionContract(address _newActionContractAddress) external isWorker {
        require(_newActionContractAddress != address(0), "Zero address for new sigma action contract");
        sigmaActionContractAddress = _newActionContractAddress;
    }

    /**
     * @dev Locks fund within this contract to support trading positoins with optional trading instructions.
     */
    function sigmaAddFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _addDone = sigmaPoolContract.addFundWithAction(msg.sender, _tokenAddress, _tokenValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaAddFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
        _isDone = _addDone && _eventDone;
    }

    /**
     * @dev Tier 1 withdrawal
     */
    function sigmaVerifyAndWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 1, "Wrong function called for withdraw tier");
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _withdrawDone = sigmaPoolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _withdrawValue, _tier, block.chainid, sigmaPoolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaWithdrawFund(_ticketId, msg.sender, _tokenAddress, _withdrawValue);
        _isDone = _withdrawDone && _eventDone;
    }

    /**
     * @dev Tier 2 withdrawal
     */
    function sigmaVerifyAndQueue(bytes memory _targetSignature, address _tokenAddress, uint256 _queueValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 2, "Wrong function called for withdraw tier");
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _queueDone = sigmaPoolContract.verifyAndQueue(_targetSignature, msg.sender, _tokenAddress, _queueValue, _tier, block.chainid, sigmaPoolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaQueueWithdraw(_ticketId, msg.sender, _tokenAddress, _queueValue);
        _isDone = _queueDone && _eventDone;
    }

    /**
     * @dev Tier 3 withdrawal
     */
    function sigmaVerifyAndPartialWithdrawFund(bytes memory _targetSignature, address _tokenAddress, uint256 _partialWithdrawValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(_tier == 3, "Wrong function called for withdraw tier");
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _withdrawDone = sigmaPoolContract.verifyAndWithdrawFund(_targetSignature, msg.sender, _tokenAddress, _partialWithdrawValue, _tier, block.chainid, sigmaPoolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaWithdrawFund(_ticketId, msg.sender, _tokenAddress, _partialWithdrawValue);
        _isDone = _withdrawDone && _eventDone;
    }

    /**
     * @dev Verify signature to redeem SATIS tokens
     */
    function sigmaVerifyAndRedeemToken(bytes memory _targetSignature, address _tokenAddress, uint256 _redeemValue, uint256 _tier, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        IMoneyPoolRaw sigmaPoolContract = IMoneyPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _redeemDone = sigmaPoolContract.verifyAndRedeemToken(_targetSignature, msg.sender, _tokenAddress, _redeemValue, _tier, block.chainid, sigmaPoolAddressList[_poolName], _expBlockNo, _ticketId, _nonce);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaVerifyAndRedeemToken(msg.sender, _tokenAddress, _redeemValue);
        _isDone = _redeemDone && _eventDone;
    }
}