// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/ISigmaPoolRaw.sol";

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
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        clientSigmaNonce = sigmaPoolContract.getClientSigmaNonce(_clientAddress);
    }

    /**
     * @dev Get client's balance in a pool.
     */
    function getClientSigmaBalance(address _clientAddress, address _tokenAddress, string memory _poolName) external view returns(uint256 clientSigmaBalance) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        clientSigmaBalance = sigmaPoolContract.getClientSigmaBalance(_clientAddress, _tokenAddress);
    }

    /**
     * @dev Get client's locked balance in a pool.
     */
    function getClientSigmaLockBalance(address _clientAddress, address _tokenAddress, string memory _poolName) external view returns(uint256 clientSigmaLockBalance) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        clientSigmaLockBalance = sigmaPoolContract.getClientSigmaLockBalance(_clientAddress, _tokenAddress);
    }

    /**
     * @dev Get contract's storage of SATIS tokens.
     */
    function getSatisTokenAmountInContract(address _tokenAddress, string memory _poolName) external view returns(uint256 satisTokenAmount) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        satisTokenAmount = sigmaPoolContract.getSatisTokenAmountInContract(_tokenAddress);
    }

    /**
     * @dev Get the particular pool's owner.
     */
    function getSigmaPoolOwner(string memory _poolName) external view returns(address sigmaPoolOwner) {
        require(poolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        sigmaPoolOwner = sigmaPoolContract.getSigmaPoolOwner();
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
        sigmaActionContractAddress = _newActionContractAddress;
    }

    /**
     * @dev Transfers fund to this contract
     */
    function sigmaAddFund(address _tokenAddress, uint256 _tokenValue, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _addDone = sigmaPoolContract.sigmaAddFund(msg.sender, _tokenAddress, _tokenValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaAddFund(msg.sender, _tokenAddress, _tokenValue);
        _isDone = _addDone && _eventDone;
    }

    /**
     * @dev Locks fund within this contract to support trading positoins with optional trading instructions.
     */
    function sigmaLockFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _lockDone = sigmaPoolContract.sigmaLockFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaLockFundWithAction(msg.sender, _tokenAddress, _tokenValue, _data);
        _isDone = _lockDone && _eventDone;
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function sigmaAddFundWithAction(address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmPoolAddressList[_poolName]);
        bool _addDone = sigmaPoolContract.sigmaAddFund(msg.sender, _tokenAddress, _addValue);
        bool _lockDone = sigmaPoolContract.sigmaLockFundWithAction(msg.sender, _tokenAddress, _lockValue, _data);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _addEvent = sigmaActionContract.sigmaAddFund(msg.sender, _tokenAddress, _addValue);
        bool _lockEvent = sigmaActionContract.sigmaLockFundWithAction(msg.sender, _tokenAddress, _lockValue, _data);
        _isDone = _addDone && _lockDone && _addEvent && _lockEvent;
    }

    /**
     * @dev Remove fund from this contract.
     */
    function sigmaRemoveFund(address _tokenAddress, uint256 _tokenValue, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _removeDone = sigmaPoolContract.sigmaRemoveFund(msg.sender, _tokenAddress, _tokenValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaRemoveFund(msg.sender, _tokenAddress, _tokenValue);
        _isDone = _removeDone && _eventDone;
    }

    /**
     * @dev Verify signature to unlock fund
     */
    function sigmaVerifyAndUnlockFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _unlockDone = sigmaPoolContract.sigmaVerifyAndUnlockFund(_targetSignature, msg.sender, _tokenAddress, _unlockValue, _nonce, _newLockValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaUnlockFund(msg.sender, _tokenAddress, _unlockValue);
        _isDone = _unlockDone && _eventDone;
    }

    /**
     * @dev Verify signature to unlock and remove fund in 1 step
     */
    function sigmaVerifyAndRemoveFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _verifyAndRemoveDone = sigmaPoolContract.sigmaVerifyAndRemoveFund(_targetSignature, msg.sender, _tokenAddress, _unlockValue, _withdrawValue, _nonce, _newLockValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _unlockEvent = sigmaActionContract.sigmaUnlockFund(msg.sender, _tokenAddress, _unlockValue);
        bool _removeEvent = sigmaActionContract.sigmaRemoveFund(msg.sender, _tokenAddress, _withdrawValue);
        _isDone = _verifyAndRemoveDone && _unlockEvent && _removeEvent;
    }

    /**
     * @dev Verify signature to redeem SATIS tokens
     */
    function sigmaVerifyAndRedeemToken(bytes memory _targetSignature, address _tokenAddress, uint256 _redeemValue, uint256 _nonce, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _redeemDone = sigmaPoolContract.sigmaVerifyAndRedeemToken(_targetSignature, msg.sender, _tokenAddress, _redeemValue, _nonce);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaVerifyAndRedeemToken(msg.sender, _tokenAddress, _redeemValue);
        _isDone = _redeemDone && _eventDone;
    }

    /**
     * @dev Anyone can help to fund this contract with SATIS tokens
     */
    function sigmaFundSatisToken(address _tokenAddress, uint256 _fundingValue, string memory _poolName) external returns(bool _isDone) {
        require(sigmaPoolAddressList[_poolName] != address(0), "No such pool");
        ISigmaPoolRaw sigmaPoolContract = ISigmaPoolRaw(sigmaPoolAddressList[_poolName]);
        bool _fundingDone = sigmaPoolContract.sigmaFundSatisToken(_tokenAddress, _fundingValue);
        ISigmaAction sigmaActionContract = ISigmaAction(sigmaActionContractAddress);
        bool _eventDone = sigmaActionContract.sigmaFundSatisToken(msg.sender, _tokenAddress, _fundingValue);
        _isDone = _fundingDone && _eventDone;
    }
}