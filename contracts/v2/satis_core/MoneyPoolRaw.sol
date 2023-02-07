// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/Address.sol";
import "../lib_and_interface/SafeMath.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";


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
    using SafeMath for uint256;

    mapping (address => mapping (address => int256)) public clientDepositRecord;
    mapping (address => uint256) public totalLockedAssets;
    mapping (address => mapping (address => uint256)) public instantWithdrawReserve;
    mapping (address => mapping (address => uint256)) public withdrawalQueue;
    mapping (address => uint256) public clientNonce;
    mapping (address => uint256) public satisTokenBalance;
    mapping (address => bool) public workerList;

    address public owner;
    address public proxy;
    address public sigmaProxy;

    event WorkerTakeLockedFund(address workerAddress, address tokenAddress, uint256 takeValue);
    event WorkerDumpBridgedFund(address workerAddress, address[] clientAddressList, address tokenAddress, uint256[] dumpValueList);
    event WorkerDumpInstantWithdrawFund(address workerAddress, address[] _clientAddressList, address _tokenAddress, uint256[] _instantWithdrawValueList);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not a worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy || msg.sender == sigmaProxy, "Please use proxy contract.");
        _;
    }

    // modifier enoughPoolBalance(address _tokenAddress, uint256[] memory _tokenValueList) {
    //     uint256 _sumValue;
    //     for (uint256 i = 0; i < _tokenValueList.length; i++) {
    //         _sumValue.add(_tokenValueList[i]);
    //     }
    //     require (
    //         _sumValue <= totalLockedAssets[_tokenAddress],
    //         "Not enough assets in pool"
    //     );
    //     _;
    // }

    modifier enoughInstantWithdrawReserve(address _clientAddress, address _tokenAddress, uint256 _tokenValue) {
        require (instantWithdrawReserve[_clientAddress][_tokenAddress] >= _tokenValue, "Insufficient token in instant withdrawal reserve");
        _;
    }

    modifier correctRebalanceValue(uint256[] memory _queueValueList, uint256 _totalDumpAmount, uint256 _rebalanceAmount) {
        uint256 _queueValue;
        for (uint256 i = 0; i < _queueValueList.length; i++) {
            _queueValue.add(_queueValueList[i]);
        }
        require (_totalDumpAmount - _rebalanceAmount == _queueValue);
        _;
    }

    modifier correctSignatureLength(bytes memory _targetSignature) {
        require (_targetSignature.length == 65, "Incorrect signature length");
        _;
    }

    /**
     * @dev Sets the value for {owner}, owner is also a worker.
     */
    constructor(address _initialProxyAddress, address _initialSigmaProxyAddress) {
        owner = msg.sender;
        workerList[owner] = true;
        proxy = _initialProxyAddress;
        sigmaProxy = _initialSigmaProxyAddress;
    }

    /**
     * @dev Returns client's withdraw nonce.
     */
    function getClientNonce(address _clientAddress) public view returns(uint256) {
        return clientNonce[_clientAddress];
    }

    /**
     * @dev Returns client's net deposit value on this pool (can be negative).
     */
    function getClientDepositRecord(address _clientAddress, address _tokenAddress) public view returns(int256) {
        return clientDepositRecord[_clientAddress][_tokenAddress];
    }

    /**
     * @dev Returns total liquidity available in this pool (excluded client's withdrawal reserves).
     */
    function getLiquidityAmountInPool(address _tokenAddress) public view returns(uint256) {
        return totalLockedAssets[_tokenAddress];
    }

    /**
     * @dev Returns total SATIS token in this pool for Sigma Mining.
     */
    function getSatisTokenAmountInPool(address _tokenAddress) public view returns(uint256) {
        return satisTokenBalance[_tokenAddress];
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
        owner = _newOwner;
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
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public isWorker {
        proxy = _newProxyAddress;
    }

    /**
     * @dev Update sigma mining proxy contract address.
     */
    function updateSigmaProxyAddress(address _newSigmaProxyAddress) public isWorker {
        sigmaProxy = _newSigmaProxyAddress;
    }

    /**
     * @dev Show pool owner.
     */
    function getPoolOwner() public view returns(address _admin) {
        _admin = owner;
    }

    /**
     * @dev Check if an address is a worker.
     */
    function verifyWorker(address _workerAddress) public view returns(bool _isWorker) {
        _isWorker = workerList[_workerAddress];
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _addValue, int256 _recordAddValue) external isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(_clientAddress, address(this), _addValue);
        clientDepositRecord[_clientAddress][_tokenAddress] += _recordAddValue;
        totalLockedAssets[_tokenAddress] = totalLockedAssets[_tokenAddress].add(_addValue);
        _isDone = true;
    }

    /**
     * @dev Internal function, recover signer from signature
     */
    function recoverSignature(bytes32 _targetHash, bytes memory _targetSignature) public pure correctSignatureLength(_targetSignature) returns(address) {
        bytes32 _r;
        bytes32 _s;
        uint8 _v;

        require (_targetSignature.length == 65, "Length of signature must be 65");

        assembly {
            /*
            First 32 bytes stores the length of the signature

            add(sig, 32) = pointer of sig + 32
            effectively, skips first 32 bytes of signature

            mload(p) loads next 32 bytes starting at the memory address p into memory
            */

            // first 32 bytes, after the length prefix
            _r := mload(add(_targetSignature, 32))
            // second 32 bytes
            _s := mload(add(_targetSignature, 64))
            // final byte (first byte of the next 32 bytes)
            _v := and(mload(add(_targetSignature, 65)), 255)
            //_v := byte(0, mload(add(_targetSignature, 96)))
        }

        require (_v == 0 || _v == 1 || _v == 27 || _v == 28, "Recover v value is fundamentally wrong");

        if (_v < 27) {
            _v += 27;
        }

        require (_v == 27 || _v == 28, "Recover v value error: Not 27 or 28");

        return ecrecover(_targetHash, _v, _r, _s);
    }

    /**
     * @dev Hashing message fro ecrevocer function
     */
    function hashingMessage(bytes32 _messageToBeHashed) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_messageToBeHashed));
    }


    /**
     * @dev Internal function, convert uint to string
     */
    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len;
        while (_i != 0) {
            k = k-1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }

    /**
     * @dev Internal function, convert address to string
     */
    function address2str(address _addr) internal pure returns(string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint(uint8(value[i + 12] >> 4))];
            str[3+i*2] = alphabet[uint(uint8(value[i + 12] & 0x0f))];
        }
        return string(str);
    }

    /**
     * @dev Worker unlock fund to instant withdrawal reserve.
     */
    function workerUnlockFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _tokenValueList) public isWorker returns(bool _isDone) {
        IERC20 unlockToken = IERC20(_tokenAddress);
        for (uint i = 0; i < _clientAddressList.length; i++) {
            unlockToken.safeTransfer(_clientAddressList[i], _tokenValueList[i]);
            instantWithdrawReserve[_clientAddressList[i]][_tokenAddress] = instantWithdrawReserve[_clientAddressList[i]][_tokenAddress].add(_tokenValueList[i]);
        }
        _isDone = true;
    }

    struct Str {
      string sender;
      string token;
      string withdraw;
      string tier;
      string nonce;
    }

    /**
     * @dev Verify signature, internal function
     */
    function verifySignature(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _nonce) internal view returns(bool _isDone) {
        require(clientNonce[_clientAddress] == _nonce, "Invalid nonce");
        bytes32 _matchHash;
        bytes32 _hashForRecover;
        address _recoveredAddress;
        Str memory str;
        str.sender = address2str(_clientAddress);
        str.token = address2str(_tokenAddress);
        str.withdraw = uint2str(_withdrawValue);
        str.tier = uint2str(_tier);
        str.nonce = uint2str(_nonce);
        _matchHash = keccak256(abi.encodePacked(str.nonce, str.sender, str.token, str.withdraw, str.tier));
        _hashForRecover = hashingMessage(_matchHash);
        _recoveredAddress = recoverSignature(_hashForRecover, _targetSignature);
        require (_recoveredAddress == owner, "Incorrect signature");
        _isDone = true;
    }

    /**
     * @dev Tier 1 withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _nonce) public isProxy returns(bool _isDone) {
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _tier, _nonce);
        require (_verification, "Signature verification for instant withdrawal fails");
        clientNonce[_clientAddress] = _nonce.add(1);

        instantWithdrawReserve[_clientAddress][_tokenAddress] = instantWithdrawReserve[_clientAddress][_tokenAddress].add(_withdrawValue);
        totalLockedAssets[_tokenAddress] = totalLockedAssets[_tokenAddress].sub(_withdrawValue);
        _isDone = true;
    }

    /**
     * @dev Tier 2 withdrawal
     */
    function verifyAndQueue(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _queueValue, uint256 _tier, uint256 _nonce) public isProxy returns(bool _isDone) {
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _queueValue, _tier, _nonce);
        require (_verification, "Signature verification for queuing fails");
        clientNonce[_clientAddress] = _nonce.add(1);

        withdrawalQueue[_clientAddress][_tokenAddress] = withdrawalQueue[_clientAddress][_tokenAddress].add(_queueValue);
        totalLockedAssets[_tokenAddress] = totalLockedAssets[_tokenAddress].sub(_queueValue);
        _isDone = true;
    }

    /**
     * @dev Verify signature for redeeming SATIS token in Sigma Mining
     */
    function verifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _tier, uint256 _nonce) external isProxy returns(bool _isDone) {
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _redeemValue, _tier, _nonce);
        require (_verification == true, "Signature verification fails");
        require (satisTokenBalance[_tokenAddress] >= _redeemValue, "Insifficient SATIS Tokens");
        clientNonce[_clientAddress] = _nonce.add(1);

        //Send redeemed token
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransfer(_clientAddress, _redeemValue);
        satisTokenBalance[_tokenAddress] = satisTokenBalance[_tokenAddress].sub(_redeemValue);
        _isDone = true;
    }

    /**
     * @dev Fund SATIS token to this contract
     */
    function fundSatisToken(address _tokenAddress, uint256 _fundingValue) external isWorker returns(bool _isDone) {
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransferFrom(msg.sender, address(this), _fundingValue);
        satisTokenBalance[_tokenAddress] = satisTokenBalance[_tokenAddress].add(_fundingValue);
        _isDone = true;
    }

    /**
     * @dev Workers take SATIS token from this contract
     */
    function workerTakeSaisToken(address _tokenAddress, uint256 _takingValue) external isWorker returns(bool _isDone) {
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransfer(msg.sender, _takingValue);
        satisTokenBalance[_tokenAddress] = satisTokenBalance[_tokenAddress].sub(_takingValue);
        _isDone = true;
    }

    /**
     * @dev Worker taking locked fund for bridging.
     */
    function workerTakeLockedFund(address _tokenAddress, uint256 _takeValue) external isWorker returns(bool _isDone) {
        IERC20 takeToken = IERC20(_tokenAddress);
        totalLockedAssets[_tokenAddress] = totalLockedAssets[_tokenAddress].sub(_takeValue);
        takeToken.safeTransfer(msg.sender, _takeValue);
        emit WorkerTakeLockedFund(msg.sender, _tokenAddress, _takeValue);
        _isDone = true;
    }

    /**
     * @dev Worker dumping crosschain fund from rebalancing.
     */
    function workerDumpRebalancedFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _queueValueList, uint256 _totalDumpAmount, uint256 _rebalanceAmount) external 
    isWorker correctRebalanceValue(_queueValueList, _totalDumpAmount, _rebalanceAmount) returns(bool _isDone) {
        require (_clientAddressList.length == _queueValueList.length, "Lists length not match");
        
        // Normal rebalancing
        IERC20 dumpToken = IERC20(_tokenAddress);
        dumpToken.safeTransferFrom(msg.sender, address(this), _totalDumpAmount);
        totalLockedAssets[_tokenAddress] = totalLockedAssets[_tokenAddress].add(_rebalanceAmount);

        // Send all fund to queued users
        if (_clientAddressList.length != 0) {
            for (uint256 i=0; i < _clientAddressList.length; i++) {
                //dumpToken.safeTransferFrom(msg.sender, address(this), _queueValueList[i]);
                dumpToken.safeTransfer(_clientAddressList[i], _queueValueList[i]);
                withdrawalQueue[_clientAddressList[i]][_tokenAddress] = withdrawalQueue[_clientAddressList[i]][_tokenAddress].sub(_queueValueList[i]);
            }
            emit WorkerDumpBridgedFund(msg.sender, _clientAddressList, _tokenAddress, _queueValueList);
        }

        _isDone = true;
    }

    /**
     * @dev Worker dumping fund for instant withdrawal.
     */
    function workerDumpInstantWithdrawalFund(address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _instantWithdrawValueList, uint256 _totalDumpAmount) external 
    isWorker correctRebalanceValue(_instantWithdrawValueList, _totalDumpAmount, 0) returns(bool _isDone) {
        IERC20 dumpToken = IERC20(_tokenAddress);
        dumpToken.safeTransferFrom(msg.sender, address(this), _totalDumpAmount);
        for (uint256 i=0; i < _clientAddressList.length; i++) {
            dumpToken.safeTransfer(_clientAddressList[i], _instantWithdrawValueList[i]);
            instantWithdrawReserve[_clientAddressList[i]][_tokenAddress] = instantWithdrawReserve[_clientAddressList[i]][_tokenAddress].sub(_instantWithdrawValueList[i]);
        }
        emit WorkerDumpInstantWithdrawFund(msg.sender, _clientAddressList, _tokenAddress, _instantWithdrawValueList);
        _isDone = true;
    }
}