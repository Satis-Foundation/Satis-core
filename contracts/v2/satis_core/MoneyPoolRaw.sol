// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";
import "../lib_and_interface/VerifySig.sol";


/**
 * This contract is a simple money pool for deposit.
 * It supports transfer and withdrawal of assets (ETH and ERC20 tokens).
 *
 * This contract uses Openzeppelin's library for ERC20 tokens.
 * When deploying on certain L2s (such as Optimism), it might require slight modifications
 * of the original ERC20 token library, since some ETH functions might not be supported.
 */


contract MoneyPoolRaw {

    using SafeERC20 for IERC20;

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

    event WorkerTakeLockedFund(address workerAddress, address tokenAddress, uint256 takeValue);
    event WorkerDumpBridgedFund(address workerAddress, address[] clientAddressList, address tokenAddress, uint256[] dumpValueList);
    event WorkerDumpInstantWithdrawFund(address workerAddress, address[] _clientAddressList, address _tokenAddress, uint256[] _instantWithdrawValueList);

    event ChangeOwnership(address newOwner);
    event ChangeWorkers(bool isAdd, address[] changeList);
    event ChangeProxy(address newProxy);
    event ChangeSigmaProxy(address newSigmaProxy);

    modifier isOwner() {
        require (msg.sender == owner, "Not admin");
        _;
    }

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy || msg.sender == sigmaProxy, "Use proxy");
        _;
    }

    modifier sufficientRebalanceValue(uint256[] memory _queueValueList, uint256 _totalDumpAmount, uint256 _poolAmount) {
        require (_totalDumpAmount > 0 || _queueValueList.length > 0, "0 dump / 0 length");
        uint256 _queueValue;
        for (uint256 i = 0; i < _queueValueList.length; i++) {
            _queueValue += _queueValueList[i];
        }
        require (_queueValue <= _poolAmount + _totalDumpAmount, "Dump + pool < sum(queue)");
        _;
    }

    /**
     * @dev Sets the value for {owner}, owner is also a worker.
     */
    constructor(address _initialProxyAddress, address _initialSigmaProxyAddress) {
        require(_initialProxyAddress != address(0), "0 proxy addr");
        require(_initialSigmaProxyAddress != address(0), "0 sigma proxy addr");
        owner = msg.sender;
        workerList[owner] = true;
        proxy = _initialProxyAddress;
        sigmaProxy = _initialSigmaProxyAddress;
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
        require(_newOwner != address(0), "0 addr");
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
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public isWorker {
        require(_newProxyAddress != address(0), "0 addr");
        proxy = _newProxyAddress;
        emit ChangeProxy(_newProxyAddress);
    }

    /**
     * @dev Update sigma mining proxy contract address.
     */
    function updateSigmaProxyAddress(address _newSigmaProxyAddress) public isWorker {
        require(_newSigmaProxyAddress != address(0), "0 addr");
        sigmaProxy = _newSigmaProxyAddress;
        emit ChangeSigmaProxy(_newSigmaProxyAddress);
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _addValue) external isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(_clientAddress, address(this), _addValue);
        totalLockedAssets[_tokenAddress] += _addValue;
        _isDone = true;
    }

    /**
     * @dev Worker unlock fund to instant withdrawal reserve.
     */
    function workerUnlockFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _tokenValueList) public isWorker returns(bool _isDone) {
        for (uint i = 0; i < _clientAddressList.length; i++) {
            instantWithdrawReserve[_clientAddressList[i]][_tokenAddress] += _tokenValueList[i];
        }
        _isDone = true;
    }

    /**
     * @dev Verify signature, internal function
     */
    function verifySignature(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) internal view returns(bool _isDone) {
        require(_chainId == block.chainid, "Wrong chain ID");
        require(_poolAddress == address(this), "Wrong pool addr");
        require(clientNonce[_clientAddress] == _nonce, "Wrong nonce");
        address _recoveredAddress;
        _recoveredAddress = VerifySig.recoverAddress(_targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _tier, _chainId, _poolAddress, _nonce);
        require (_recoveredAddress == owner, "Wrong signature");
        _isDone = true;
    }

    /**
     * @dev Withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public isProxy returns(bool _isDone) {
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _tier, _chainId, _poolAddress, _nonce);
        require (_verification, "Verify sig fail");
        clientNonce[_clientAddress] = _nonce + 1;

        if (_tier == 2) {
            queueCount[_tokenAddress] += 1;
            withdrawalQueue[_clientAddress][_tokenAddress] += _withdrawValue;
        } else {
            instantWithdrawReserve[_clientAddress][_tokenAddress] += _withdrawValue;
        }

        _isDone = true;
    }

    /**
     * @dev Verify signature for redeeming SATIS token in Sigma Mining
     */
    function verifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) external isProxy returns(bool _isDone) {
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _redeemValue, _tier, _chainId, _poolAddress, _nonce);
        require (_verification == true, "Verify sig fail");
        require (satisTokenBalance[_tokenAddress] >= _redeemValue, "Insifficient SATIS Token");
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
        require(_takeValue <= totalLockedAssets[_tokenAddress], "Take > Lock");
        IERC20 takeToken = IERC20(_tokenAddress);
        totalLockedAssets[_tokenAddress] -= _takeValue;
        takeToken.safeTransfer(msg.sender, _takeValue);
        emit WorkerTakeLockedFund(msg.sender, _tokenAddress, _takeValue);
        _isDone = true;
    }

    /**
     * @dev Worker dumping crosschain fund from rebalancing.
     */
    function workerDumpRebalancedFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _queueValueList, uint256 _totalDumpAmount) external 
    isWorker sufficientRebalanceValue(_queueValueList, _totalDumpAmount, totalLockedAssets[_tokenAddress]) returns(bool _isDone) {
        require (_clientAddressList.length == _queueValueList.length, "List length not match");
        
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
            emit WorkerDumpBridgedFund(msg.sender, _clientAddressList, _tokenAddress, _queueValueList);
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
        emit WorkerDumpInstantWithdrawFund(msg.sender, _clientAddressList, _tokenAddress, _instantWithdrawValueList);
        _isDone = true;
    }
}