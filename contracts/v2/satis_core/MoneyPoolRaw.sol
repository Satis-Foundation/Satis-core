// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/Address.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";
import "./MultiSig.sol";

/**
 * This contract is a simple money pool for deposit.
 * It supports transfer and withdrawal of assets (ETH and ERC20 tokens).
 *
 * This contract uses Openzeppelin's library for ERC20 tokens.
 * When deploying on certain L2s (such as Optimism), it might require slight modifications
 * of the original ERC20 token library, since some ETH functions might not be supported.
 */

 contract MoneyPoolWorker {
    using SafeERC20 for IERC20;
    
    mapping (address => mapping (address => int256)) public clientDepositRecord;
    mapping (address => uint256) public totalLockedAssets;
    mapping (address => mapping (address => uint256)) public instantWithdrawReserve;
    mapping (address => mapping (address => uint256)) public withdrawalQueue;
    mapping (address => uint256) public queueCount;
    mapping (address => uint256) public clientNonce;
    mapping (address => uint256) public satisTokenBalance;
    mapping (address => bool) public workerList;

    address public owner;
    address public proxy;
    address public sigmaProxy;

    constructor() {
        owner = msg.sender;
        workerList[owner] = true;
        proxy = address(0);
        sigmaProxy = address(0);
    }

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not a worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy || msg.sender == sigmaProxy, "Please use proxy contract.");
        _;
    }

    modifier sufficientRebalanceValue(uint256[] memory _queueValueList, uint256 _totalDumpAmount, uint256 _poolAmount) {
        require (_totalDumpAmount > 0 || _queueValueList.length > 0, "Zero dump value and zero queue list length");
        uint256 _queueValue;
        for (uint256 i = 0; i < _queueValueList.length; i++) {
            _queueValue += _queueValueList[i];
        }
        require (_queueValue <= _poolAmount + _totalDumpAmount, "Dump value + pool assets < queue value sum");
        _;
    }

    function addNonce(address _user) public returns(bool) {
        clientNonce[_user] = clientNonce[_user] + 1;
        return true;
    }

    /**
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public isWorker {
        require(_newProxyAddress != address(0), "Zero address for new proxy");
        proxy = _newProxyAddress;
    }

    /**
     * @dev Update sigma mining proxy contract address.
     */
    function updateSigmaProxyAddress(address _newSigmaProxyAddress) public isWorker {
        require(_newSigmaProxyAddress != address(0), "Zero address for new sigma proxy");
        sigmaProxy = _newSigmaProxyAddress;
    }

    /**
     * @dev Worker unlock fund to instant withdrawal reserve.
     */
    function workerUnlockFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _tokenValueList) public isWorker returns(bool _isDone) {
        for (uint i = 0; i < _clientAddressList.length; i++) {
            instantWithdrawReserve[_clientAddressList[i]][_tokenAddress] += _tokenValueList[i];
            int256 _recordWithdrawValue = int256(_tokenValueList[i]);
            clientDepositRecord[_clientAddressList[i]][_tokenAddress] -= _recordWithdrawValue;
        }
        _isDone = true;
    }

    /**
     * @dev Tier 1 withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public isProxy returns(bool _isDone) {
        bool _verification = MultiSig.verifySignature(owner, _targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _tier, _chainId, _poolAddress, _nonce);
        require (_verification, "Signature verification for instant withdrawal fails");
        clientNonce[_clientAddress] = _nonce + 1;

        instantWithdrawReserve[_clientAddress][_tokenAddress] += _withdrawValue;

        int256 _recordWithdrawValue = int256(_withdrawValue);
        clientDepositRecord[_clientAddress][_tokenAddress] -= _recordWithdrawValue;

        _isDone = true;
    }

    /**
     * @dev Tier 2 withdrawal
     */
    function verifyAndQueue(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _queueValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public isProxy returns(bool _isDone) {
        bool _verification = MultiSig.verifySignature(owner, _targetSignature, _clientAddress, _tokenAddress, _queueValue, _tier, _chainId, _poolAddress, _nonce);
        require (_verification, "Signature verification for queuing fails");
        clientNonce[_clientAddress] = _nonce + 1;
        queueCount[_tokenAddress] += 1;

        withdrawalQueue[_clientAddress][_tokenAddress] += _queueValue;

        int256 _recordQueueValue = int256(_queueValue);
        clientDepositRecord[_clientAddress][_tokenAddress] -= _recordQueueValue;

        _isDone = true;
    }

    /**
     * @dev Verify signature for redeeming SATIS token in Sigma Mining
     */
    function verifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) external isProxy returns(bool _isDone) {
        bool _verification = MultiSig.verifySignature(owner, _targetSignature, _clientAddress, _tokenAddress, _redeemValue, _tier, _chainId, _poolAddress, _nonce);
        require (_verification == true, "Signature verification fails");
        require (satisTokenBalance[_tokenAddress] >= _redeemValue, "Insifficient SATIS Tokens");
        clientNonce[_clientAddress] = _nonce + 1;

        //Send redeemed token
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransfer(_clientAddress, _redeemValue);
        satisTokenBalance[_tokenAddress] -= _redeemValue;
        _isDone = true;
    }

    /**
     * @dev Fund SATIS token to this contract
     */
    function fundSatisToken(address _tokenAddress, uint256 _fundingValue) external isWorker returns(bool _isDone) {
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransferFrom(msg.sender, address(this), _fundingValue);
        satisTokenBalance[_tokenAddress] += _fundingValue;
        _isDone = true;
    }

    /**
     * @dev Workers take SATIS token from this contract
     */
    function workerTakeSatisToken(address _tokenAddress, uint256 _takingValue) external isWorker returns(bool _isDone) {
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransfer(msg.sender, _takingValue);
        satisTokenBalance[_tokenAddress] -= _takingValue;
        _isDone = true;
    }

    /**
     * @dev Worker taking locked fund for bridging.
     */
    function workerTakeLockedFund(address _tokenAddress, uint256 _takeValue) external isWorker returns(bool _isDone) {
        require(_takeValue <= totalLockedAssets[_tokenAddress], "Taking more than the locked assets in contract");
        IERC20 takeToken = IERC20(_tokenAddress);
        totalLockedAssets[_tokenAddress] -= _takeValue;
        takeToken.safeTransfer(msg.sender, _takeValue);
        _isDone = true;
    }

    /**
     * @dev Worker dumping crosschain fund from rebalancing.
     */
    function workerDumpRebalancedFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _queueValueList, uint256 _totalDumpAmount) external 
    isWorker sufficientRebalanceValue(_queueValueList, _totalDumpAmount, totalLockedAssets[_tokenAddress]) returns(bool _isDone) {
        require (_clientAddressList.length == _queueValueList.length, "Lists length not match");
        
        // Normal rebalancing
        IERC20 dumpToken = IERC20(_tokenAddress);
        if (_totalDumpAmount > 0) {
            dumpToken.safeTransferFrom(msg.sender, address(this), _totalDumpAmount);
            totalLockedAssets[_tokenAddress] += _totalDumpAmount;
        }

        // Send all fund to queued users
        if (_clientAddressList.length != 0) {
            for (uint256 i=0; i < _clientAddressList.length; i++) {
                dumpToken.safeTransfer(_clientAddressList[i], _queueValueList[i]);
                totalLockedAssets[_tokenAddress] -= _queueValueList[i];
                withdrawalQueue[_clientAddressList[i]][_tokenAddress] -= _queueValueList[i];
            }
        }

        // Reset queue count
        if (_clientAddressList.length >= queueCount[_tokenAddress]) {
            queueCount[_tokenAddress] = 0;
        } else {
            queueCount[_tokenAddress] -= _clientAddressList.length;
        }

        _isDone = true;
    }

    /**
     * @dev Worker dumping fund for instant withdrawal.
     */
    function workerDumpInstantWithdrawalFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _instantWithdrawValueList, uint256 _totalDumpAmount) external 
    isWorker sufficientRebalanceValue(_instantWithdrawValueList, _totalDumpAmount, totalLockedAssets[_tokenAddress]) returns(bool _isDone) {
        IERC20 dumpToken = IERC20(_tokenAddress);
        if (_totalDumpAmount > 0) {
            dumpToken.safeTransferFrom(msg.sender, address(this), _totalDumpAmount);
            totalLockedAssets[_tokenAddress] += _totalDumpAmount;
        }
        for (uint256 i=0; i < _clientAddressList.length; i++) {
            dumpToken.safeTransfer(_clientAddressList[i], _instantWithdrawValueList[i]);
            totalLockedAssets[_tokenAddress] -= _instantWithdrawValueList[i];
            instantWithdrawReserve[_clientAddressList[i]][_tokenAddress] -= _instantWithdrawValueList[i];
        }
        _isDone = true;
    }
 }

contract MoneyPoolRaw {

    using SafeERC20 for IERC20;

    mapping (address => mapping (address => int256)) public clientDepositRecord;
    mapping (address => uint256) public totalLockedAssets;
    mapping (address => mapping (address => uint256)) public instantWithdrawReserve;
    mapping (address => mapping (address => uint256)) public withdrawalQueue;
    mapping (address => uint256) public queueCount;
    mapping (address => uint256) public clientNonce;
    mapping (address => uint256) public satisTokenBalance;
    mapping (address => bool) public workerList;

    address public owner;
    address public proxy;
    address public sigmaProxy;

    address workerContract;

    event WorkerTakeLockedFund(address workerAddress, address tokenAddress, uint256 takeValue);
    event WorkerDumpBridgedFund(address workerAddress, address[] clientAddressList, address tokenAddress, uint256[] dumpValueList);
    event WorkerDumpInstantWithdrawFund(address workerAddress, address[] _clientAddressList, address _tokenAddress, uint256[] _instantWithdrawValueList);
    event OwnerTakeProfit(address tokenAddress, uint256 takeProfitValue);

    event ChangeOwnership(address newOwner);
    event AddWorkers(address[] addWorkerList);
    event RemoveWorkers(address[] removeWorkerList);
    event ChangeProxy(address newProxy);
    event ChangeSigmaProxy(address newSigmaProxy);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy || msg.sender == sigmaProxy, "Please use proxy contract.");
        _;
    }

    /**
     * @dev Sets the value for {owner}, owner is also a worker.
     */
    constructor(address _initialProxyAddress, address _initialSigmaProxyAddress, address _workerContract) {
        require(_initialProxyAddress != address(0), "Zero address for proxy");
        require(_initialSigmaProxyAddress != address(0), "Zero address for sigma proxy");
        owner = msg.sender;
        workerList[owner] = true;
        proxy = _initialProxyAddress;
        sigmaProxy = _initialSigmaProxyAddress;
        workerContract = _workerContract;
    }

    /**
     * @dev Returns client's queued value.
     */
    function getClientQueueValue(address[] memory _clientAddressList, address _tokenAddress) public view returns(uint256[] memory) {
        uint256[] memory queueValueList = new uint256[](_clientAddressList.length);
        for (uint i = 0; i < _clientAddressList.length; i++) {
            queueValueList[i] = (withdrawalQueue[_clientAddressList[i]][_tokenAddress]);
        }
        return queueValueList;
    }

    /**
     * @dev Returns client's fast lane value.
     */
    function getClientInstantWithdrawReserve(address[] memory _clientAddressList, address _tokenAddress) public view returns(uint256[] memory) {
        uint256[] memory reserveValueList = new uint256[](_clientAddressList.length);
        for (uint i = 0; i < _clientAddressList.length; i++) {
            reserveValueList[i] = (instantWithdrawReserve[_clientAddressList[i]][_tokenAddress]);
        }
        return reserveValueList;
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnership(address _newOwner) public isOwner {
        require(_newOwner != address(0), "Zero address for new owner");
        workerList[owner] = false;
        owner = _newOwner;
        workerList[owner] = true;
        emit ChangeOwnership(_newOwner);
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
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("updateProxyAddress(address)", _newProxyAddress)
        );
        emit ChangeProxy(_newProxyAddress);
    }

    /**
     * @dev Update sigma mining proxy contract address.
     */
    function updateSigmaProxyAddress(address _newSigmaProxyAddress) public {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("updateSigmaProxyAddress(address)", _newSigmaProxyAddress)
        );
        emit ChangeSigmaProxy(_newSigmaProxyAddress);
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _addValue) external isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        int256 _recordAddValue = int256(_addValue);
        depositToken.safeTransferFrom(_clientAddress, address(this), _addValue);
        clientDepositRecord[_clientAddress][_tokenAddress] += _recordAddValue;
        totalLockedAssets[_tokenAddress] += _addValue;
        _isDone = true;
    }

    /**
     * @dev Worker unlock fund to instant withdrawal reserve.
     */
    function workerUnlockFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _tokenValueList) public returns(bool success) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("workerUnlockFund(address[], address, uint256[])", _clientAddressList, _tokenAddress, _tokenValueList)
        );
    }

    function addNonce() public returns(bool) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("addNonce(address)", msg.sender)
        );
        return abi.decode(data, (bool));
    }

    /**
     * @dev Tier 1 withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public returns(bool success) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("verifyAndWithdrawFund(bytes, address, address, uint256, uint256, uint256, address, uint256)", _targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _tier, _chainId, _poolAddress, _nonce)
        );
    }

    /**
     * @dev Tier 2 withdrawal
     */
    function verifyAndQueue(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _queueValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public returns(bool success) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("verifyAndQueue(bytes, address, address, uint256, uint256, uint256, address, uint256)", _targetSignature, _clientAddress, _tokenAddress, _queueValue, _tier, _chainId, _poolAddress, _nonce)
        );
    }

    /**
     * @dev Verify signature for redeeming SATIS token in Sigma Mining
     */
    function verifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) external returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("verifyAndRedeemToken(bytes, address, address, uint256, uint256, uint256, address, uint256)", _targetSignature, _clientAddress, _tokenAddress, _redeemValue, _tier, _chainId, _poolAddress, _nonce)
        );
    }

    /**
     * @dev Fund SATIS token to this contract
     */
    function fundSatisToken(address _tokenAddress, uint256 _fundingValue) external returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("fundSatisToken(address, uint256)", _tokenAddress, _fundingValue)
        );
    }

    /**
     * @dev Workers take SATIS token from this contract
     */
    function workerTakeSatisToken(address _tokenAddress, uint256 _takingValue) external  returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("workerTakeSatisToken(address, uint256)", _tokenAddress, _takingValue)
        );
    }

    /**
     * @dev Worker taking locked fund for bridging.
     */
    function workerTakeLockedFund(address _tokenAddress, uint256 _takeValue) external returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("workerTakeLockedFund(address, uint256)", _tokenAddress, _takeValue)
        );
    }

    /**
     * @dev Worker dumping crosschain fund from rebalancing.
     */
    function workerDumpRebalancedFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _queueValueList, uint256 _totalDumpAmount) external returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("workerDumpRebalancedFund(address[], address, uint256[], uint256)", _clientAddressList, _tokenAddress, _queueValueList, _totalDumpAmount)
        );
    }

    /**
     * @dev Worker dumping fund for instant withdrawal.
     */
    function workerDumpInstantWithdrawalFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _instantWithdrawValueList, uint256 _totalDumpAmount) external returns(bool _isDone) {
        (bool success, bytes memory data) = workerContract.delegatecall(
            abi.encodeWithSignature("workerDumpInstantWithdrawalFund(address[], address, uint256[], uint256)", _clientAddressList, _tokenAddress, _instantWithdrawValueList, _totalDumpAmount)
        );
    }

    /**
     * @dev Owner taking profits (charged withdrawal fees).
     */
    function ownerTakeProfit(address _tokenAddress, uint256 _takeProfitValue) external isOwner returns(bool _isDone) {
        require(_takeProfitValue <= totalLockedAssets[_tokenAddress], "Not enough balance to take");
        IERC20 profitToken = IERC20(_tokenAddress);
        profitToken.safeTransfer(msg.sender, _takeProfitValue);
        totalLockedAssets[_tokenAddress] -= _takeProfitValue;
        emit OwnerTakeProfit(_tokenAddress, _takeProfitValue);
        _isDone = true;
    }
}

