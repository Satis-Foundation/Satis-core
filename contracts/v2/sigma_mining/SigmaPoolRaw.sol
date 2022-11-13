// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/Address.sol";
import "../lib_and_interface/SafeMath.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";

contract SigmaPoolRaw {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) public clientSigmaBalance;
    mapping (address => mapping (address => uint256)) public clientSigmaLockBalance;
    mapping (address => uint256) public clientSigmaNonce;
    mapping (address => uint256) public satisTokenBalance;
    mapping (address => bool) public sigmaWorkerList;

    address public sigmaOwner;
    address public sigmaProxy;

    event TransferIn(address clientAddress, address tokenAddress, uint transactionValue);
    event TransferOut(address clientAddress, address tokenAddress, uint transactionValue);
    event Lock(address clientAddress, address tokenAddress, uint transactionValue, string transactionData);
    event Unlock(address clientAddress, address tokenAddress, uint transactionValue);
    event WorkerTakeLockedFund(address clientAddress, address tokenAddress, uint transactionValue);
    event RedeemToken(address clientAddress, address tokenAddress, uint transactionValue);

    modifier isOwner() {
        require (msg.sender == sigmaOwner, "Not an admin");
        _;
    }

    modifier isWorker() {
        require (sigmaWorkerList[msg.sender] == true, "Not a worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == sigmaProxy, "Please use sigma mining's proxy contract.");
        _;
    }

    modifier enoughMobileBalance(address _clientAddress, address _tokenAddress, uint256 _tokenValue) {
        require (
            _tokenValue <= clientSigmaBalance[_clientAddress][_tokenAddress].sub(clientSigmaLockBalance[_clientAddress][_tokenAddress]),
            "Not enough mobile assets"
        );
        _;
    }

    modifier correctSignatureLength(bytes memory _targetSignature) {
        require (_targetSignature.length == 65, "Incorrect signature length");
        _;
    }


    constructor() {
        sigmaOwner = msg.sender;
        sigmaWorkerList[sigmaOwner] = true;
    }

    function getClientSigmaNonce(address _clientAddress) public view returns(uint256) {
        return clientSigmaNonce[_clientAddress];
    }

    function getClientSigmaBalance(address _clientAddress, address _tokenAddress) public view returns(uint256) {
        return clientSigmaBalance[_clientAddress][_tokenAddress];
    }

    function getClientSigmaLockBalance(address _clientAddress, address _tokenAddress) public view returns(uint256) {
        return clientSigmaLockBalance[_clientAddress][_tokenAddress];
    }

    function getSatisTokenAmountInContract(address _tokenAddress) public view returns(uint256) {
        return satisTokenBalance[_tokenAddress];
    }

    function transferSigmaOwnership(address _newOwner) public isOwner {
        sigmaOwner = _newOwner;
    }

    function addSigmaWorkers(address[] memory _addWorkerList) external isOwner {
        for(uint256 i=0; i < _addWorkerList.length; i++) {
            sigmaWorkerList[_addWorkerList[i]] = true;
        }
    }

    function removeSigmaWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            sigmaWorkerList[_removeWorkerList[i]] = false;
        }
    }

    function updateSigmaProxyAddress(address _newProxyAddress) public isWorker {
        sigmaProxy = _newProxyAddress;
    }

    function getSigmaPoolOwner() public view returns(address _admin) {
        _admin = sigmaOwner;
    }

    function checkSigmaWorker(address _checkAddress) public view returns(bool _isWorker) {
        _isWorker = sigmaWorkerList[_checkAddress];
    }

    function sigmaAddFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(_clientAddress, address(this), _tokenValue);
        clientSigmaBalance[_clientAddress][_tokenAddress] = clientSigmaBalance[_clientAddress][_tokenAddress].add(_tokenValue);
        emit TransferIn(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    function sigmaLockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) public isProxy enoughMobileBalance(_clientAddress, _tokenAddress, _tokenValue) returns(bool _isDone) {
        clientSigmaLockBalance[_clientAddress][_tokenAddress] = clientSigmaLockBalance[_clientAddress][_tokenAddress].add(_tokenValue);
        emit Lock(_clientAddress, _tokenAddress, _tokenValue, _data);
        _isDone = true;
    }

    function sigmaAddFundWithAction(address _clientAddress, address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data) external isProxy returns(bool _isDone) {
        sigmaAddFund(_clientAddress, _tokenAddress, _addValue);
        sigmaLockFundWithAction(_clientAddress, _tokenAddress, _lockValue, _data);
        _isDone = true;
    }

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

    function hashingMessage(bytes32 _messageToBeHashed) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32",_messageToBeHashed));
    }

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

    function sigmaRemoveFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy enoughMobileBalance(_clientAddress, _tokenAddress, _tokenValue) returns(bool _isDone) {
        IERC20 withdrawToken = IERC20(_tokenAddress);
        withdrawToken.safeTransfer(_clientAddress, _tokenValue);
        clientSigmaBalance[_clientAddress][_tokenAddress] = clientSigmaBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        emit TransferOut(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    function sigmaUnlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isWorker returns(bool _isDone) {
        clientSigmaLockBalance[_clientAddress][_tokenAddress] = clientSigmaLockBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        emit Unlock(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    struct Str {
      string sender;
      string token;
      string unlock;
      string nonce;
      string newLock;
    }

    function sigmaVerify(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue) internal returns(bool _isDone) {
        require(clientSigmaNonce[_clientAddress] == _nonce, "Invalid nonce");
        bytes32 _matchHash;
        bytes32 _hashForRecover;
        address _recoveredAddress;
        Str memory str;
        str.sender = address2str(_clientAddress);
        str.token = address2str(_tokenAddress);
        str.unlock = uint2str(_unlockValue);
        str.nonce = uint2str(_nonce);
        str.newLock = uint2str(_newLockValue);
        _matchHash = keccak256(abi.encodePacked("newlock:", str.newLock, ";", str.nonce, str.sender, str.token, str.unlock));
        // require (_targetHash == _matchHash, "Incorrect hash");
        _hashForRecover = hashingMessage(_matchHash);
        _recoveredAddress = recoverSignature(_hashForRecover, _targetSignature);
        require (_recoveredAddress == sigmaOwner, "Incorrect signature");
        clientSigmaNonce[_clientAddress] = _nonce.add(1);
        _isDone = true;
    }

    function sigmaVerifyAndUnlockFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue) public isProxy returns(bool _isDone) {
        bool _isVerified = sigmaVerify(_targetSignature, _clientAddress, _tokenAddress, _unlockValue, _nonce, _newLockValue);
        require (_isVerified == true, "Incorrect signature");

        // unlockFund
        uint256 oldLock = clientSigmaLockBalance[_clientAddress][_tokenAddress];
        uint256 _diff;
        if (_newLockValue >= oldLock) {
          _diff = _newLockValue.sub(oldLock);
          clientSigmaBalance[_clientAddress][_tokenAddress] = clientSigmaBalance[_clientAddress][_tokenAddress].add(_diff);
        } else {
          _diff = oldLock.sub(_newLockValue);
          clientSigmaBalance[_clientAddress][_tokenAddress] = clientSigmaBalance[_clientAddress][_tokenAddress].sub(_diff);
        }
        // clientBalance[msg.sender][_tokenAddress] = clientBalance[msg.sender][_tokenAddress].add(diff);
        clientSigmaLockBalance[_clientAddress][_tokenAddress] = _newLockValue;
        clientSigmaLockBalance[_clientAddress][_tokenAddress] = clientSigmaLockBalance[_clientAddress][_tokenAddress].sub(_unlockValue);
        emit Unlock(_clientAddress, _tokenAddress, _unlockValue);
        _isDone = true;
    }

    function sigmaVerifyAndRemoveFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue) external isProxy returns(bool _isDone) {
        sigmaVerifyAndUnlockFund(_targetSignature, _clientAddress, _tokenAddress, _unlockValue, _nonce, _newLockValue);
        sigmaRemoveFund(_clientAddress, _tokenAddress, _withdrawValue);
        _isDone = true;
    }

    function sigmaFundSatisToken(address _tokenAddress, uint256 _fundingValue) public returns(bool _isDone) {
        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransferFrom(msg.sender, address(this), _fundingValue);
        satisTokenBalance[_tokenAddress] = satisTokenBalance[_tokenAddress].add(_fundingValue);
        emit TransferIn(msg.sender, _tokenAddress, _fundingValue);
        _isDone = true;
    }

    function sigmaVerifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _nonce) external isProxy returns(bool _isDone) {
        bool _isVerified = sigmaVerify(_targetSignature, _clientAddress, _tokenAddress, _redeemValue, _nonce, _redeemValue);
        require (_isVerified == true, "Incorrect signature");
        require (satisTokenBalance[_tokenAddress] >= _redeemValue, "Insifficient SATIS Tokens");

        IERC20 satisToken = IERC20(_tokenAddress);
        satisToken.safeTransfer(_clientAddress, _redeemValue);
        satisTokenBalance[_tokenAddress] = satisTokenBalance[_tokenAddress].sub(_redeemValue);
        emit RedeemToken(_clientAddress, _tokenAddress, _redeemValue);
        _isDone = true;
    }

    function workerTakeSigmaLockedFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isWorker returns(bool _isDone) {
        IERC20 takeToken = IERC20(_tokenAddress);
        clientSigmaLockBalance[_clientAddress][_tokenAddress] = clientSigmaLockBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        clientSigmaBalance[_clientAddress][_tokenAddress] = clientSigmaBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        takeToken.safeTransfer(msg.sender, _tokenValue);
        emit WorkerTakeLockedFund(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }
}