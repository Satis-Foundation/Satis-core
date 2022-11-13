// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/Address.sol";
import "../lib_and_interface/SafeMath.sol";
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

contract MoneyPoolRaw {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) public clientBalance;
    mapping (address => mapping (address => uint256)) public clientLockBalance;
    mapping (address => uint256) public clientNonce;
    mapping (address => bool) public workerList;

    address public owner;
    address public proxy;

    /**
     * Events that will be triggered when assets are deposited.
     * The log files will record the sender, recipient and transaction data.
     */
    event TransferIn(address clientAddress, address tokenAddress, uint transactionValue);
    event TransferOut(address clientAddress, address tokenAddress, uint transactionValue);
    event Lock(address clientAddress, address tokenAddress, uint transactionValue, string transactionData);
    event Unlock(address clientAddress, address tokenAddress, uint transactionValue);
    event WorkerTakeLockedFund(address clientAddress, address tokenAddress, uint transactionValue);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isWorker() {
        require (workerList[msg.sender] == true, "Not a worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy, "Please use proxy contract.");
        _;
    }

    modifier enoughMobileBalance(address _clientAddress, address _tokenAddress, uint256 _tokenValue) {
        require (
            _tokenValue <= clientBalance[_clientAddress][_tokenAddress].sub(clientLockBalance[_clientAddress][_tokenAddress]),
            "Not enough mobile assets"
        );
        _;
    }

    modifier correctSignatureLength(bytes memory _targetSignature) {
        require (_targetSignature.length == 65, "Incorrect signature length");
        _;
    }

    /**
     * @dev Sets the value for {owner}, owner is also a worker.
     */
    constructor() {
        owner = msg.sender;
        workerList[owner] = true;
    }

    function getClientNonce(address _clientAddress) public view returns(uint256) {
      return clientNonce[_clientAddress];
    }

    function getClientBalance(address _clientAddress, address _tokenAddress) public view returns(uint256) {
      return clientBalance[_clientAddress][_tokenAddress];
    }

    function getClientLockBalance(address _clientAddress, address _tokenAddress) public view returns(uint256) {
      return clientLockBalance[_clientAddress][_tokenAddress];
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
    function addWorkers(address[] memory _newWorkerList) public isOwner {
        for(uint256 i=0; i < _newWorkerList.length; i++) {
            workerList[_newWorkerList[i]] = true;
        }
    }

    /**
     * @dev Remove workers from this contract. (Yet to implement)
     */

    /**
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public isWorker {
        proxy = _newProxyAddress;
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
    function checkWorker(address _checkAddress) public view returns(bool _isWorker) {
        _isWorker = workerList[_checkAddress];
    }

    /**
     * @dev Transfers fund to this contract
     */
    function addFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(_clientAddress, address(this), _tokenValue);
        clientBalance[_clientAddress][_tokenAddress] = clientBalance[_clientAddress][_tokenAddress].add(_tokenValue);
        emit TransferIn(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Locks fund within this contract to support trading positoins with optional trading instructions.
     */
    function lockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) public isProxy enoughMobileBalance(_clientAddress, _tokenAddress, _tokenValue) returns(bool _isDone) {
        clientLockBalance[_clientAddress][_tokenAddress] = clientLockBalance[_clientAddress][_tokenAddress].add(_tokenValue);
        emit Lock(_clientAddress, _tokenAddress, _tokenValue, _data);
        _isDone = true;
    }

    /**
     * @dev Transfers and lock fund within this contract to support trading positions with optional trading instructions.
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data) external isProxy returns(bool _isDone) {
        addFund(_clientAddress, _tokenAddress, _addValue);
        lockFundWithAction(_clientAddress, _tokenAddress, _lockValue, _data);
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
     * @dev Remove fund from this contract.
     */
    function removeFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy enoughMobileBalance(_clientAddress, _tokenAddress, _tokenValue) returns(bool _isDone) {
        IERC20 withdrawToken = IERC20(_tokenAddress);
        withdrawToken.safeTransfer(_clientAddress, _tokenValue);
        clientBalance[_clientAddress][_tokenAddress] = clientBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        emit TransferOut(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Unlock fund after settlements.
     */
    function unlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isWorker returns(bool _isDone) {
        clientLockBalance[_clientAddress][_tokenAddress] = clientLockBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
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

    /**
     * @dev Verify signature to unlock fund
     */
    function verifyAndUnlockFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue) public isProxy returns(bool _isDone) {
        require(clientNonce[_clientAddress] == _nonce, "Invalid nonce");
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
        require (_recoveredAddress == owner, "Incorrect signature");
        clientNonce[_clientAddress] = _nonce.add(1);

        // unlockFund
        uint256 oldLock = clientLockBalance[_clientAddress][_tokenAddress];
        uint256 _diff;
        if (_newLockValue >= oldLock) {
          _diff = _newLockValue.sub(oldLock);
          clientBalance[_clientAddress][_tokenAddress] = clientBalance[_clientAddress][_tokenAddress].add(_diff);
        } else {
          _diff = oldLock.sub(_newLockValue);
          clientBalance[_clientAddress][_tokenAddress] = clientBalance[_clientAddress][_tokenAddress].sub(_diff);
        }
        // clientBalance[msg.sender][_tokenAddress] = clientBalance[msg.sender][_tokenAddress].add(diff);
        clientLockBalance[_clientAddress][_tokenAddress] = _newLockValue;
        clientLockBalance[_clientAddress][_tokenAddress] = clientLockBalance[_clientAddress][_tokenAddress].sub(_unlockValue);
        emit Unlock(_clientAddress, _tokenAddress, _unlockValue);
        _isDone = true;
    }

    /**
     * @dev Verify signature to unlock and remove fund in 1 step
     */
    function verifyAndRemoveFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue) public isProxy returns(bool _isDone) {
        verifyAndUnlockFund(_targetSignature, _clientAddress, _tokenAddress, _unlockValue, _nonce, _newLockValue);
        removeFund(_clientAddress, _tokenAddress, _withdrawValue);
        _isDone = true;
    }

    /**
     * @dev Worker taking locked fund.
     */
    function workerTakeLockedFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isWorker returns(bool _isDone) {
        IERC20 takeToken = IERC20(_tokenAddress);
        clientLockBalance[_clientAddress][_tokenAddress] = clientLockBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        clientBalance[_clientAddress][_tokenAddress] = clientBalance[_clientAddress][_tokenAddress].sub(_tokenValue);
        takeToken.safeTransfer(msg.sender, _tokenValue);
        emit WorkerTakeLockedFund(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }
}