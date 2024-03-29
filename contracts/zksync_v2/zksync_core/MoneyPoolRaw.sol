// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/Address.sol";
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

    mapping (address => uint256) public totalLockedAssets;
    mapping (string => mapping (address => uint256)) public instantWithdrawReserve;
    mapping (address => uint256) public clientNonce;
    mapping (address => uint256) public satisTokenBalance;
    mapping (address => bool) public workerList;

    address public owner;
    address public signatureWorker;
    address public proxy;
    address public sigmaProxy;

    event WorkerTakeLockedFund(address workerAddress, address tokenAddress, uint256 takeValue);
    event WorkerDumpBridgedFund(address workerAddress, address[] clientAddressList, address tokenAddress, uint256[] dumpValueList);
    event WorkerDumpInstantWithdrawFund(address workerAddress, address[] _clientAddressList, address _tokenAddress, uint256[] _instantWithdrawValueList);
    event OwnerTakeProfit(address tokenAddress, uint256 takeProfitValue);

    event ChangeOwnership(address newOwner);
    event AddRemoveWorkers(address[] modifyAddrList, uint8 isAdd);
    event ChangeSignatureWorker(address newSignatureWorker);
    event ChangeProxy(address newProxy);
    event ChangeSigmaProxy(address newSigmaProxy);

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

    modifier sufficientRebalanceValue(uint256[] memory _queueValueList, uint256 _totalDumpAmount, uint256 _poolAmount) {
        require (_totalDumpAmount > 0 || _queueValueList.length > 0, "Zero dump value and zero queue list length");
        uint256 _queueValue;
        for (uint256 i = 0; i < _queueValueList.length; i++) {
            _queueValue += _queueValueList[i];
        }
        require (_queueValue <= _poolAmount + _totalDumpAmount, "Dump value + pool assets < queue value sum");
        _;
    }

    modifier correctSignatureLength(bytes memory _targetSignature) {
        require (_targetSignature.length == 65, "Incorrect signature length, length must be 65");
        _;
    }

    /**
     * @dev Sets the value for {owner}, owner is also a worker.
     */
    constructor(address _initialProxyAddress, address _initialSigmaProxyAddress, address _signatureWorker) {
        require(_initialProxyAddress != address(0), "Zero address for proxy");
        require(_initialSigmaProxyAddress != address(0), "Zero address for sigma proxy");
        owner = msg.sender;
        signatureWorker = _signatureWorker;
        proxy = _initialProxyAddress;
        sigmaProxy = _initialSigmaProxyAddress;
    }

    /**
     * @dev In debt cross-chain amount.
     */
    function getInstantWithdrawReserve(string[] memory _ticketIdList, address _tokenAddress) public view returns(uint256[] memory) {
        uint256[] memory reserveValueList = new uint256[](_ticketIdList.length);
        for (uint i = 0; i < _ticketIdList.length; i++) {
            reserveValueList[i] = (instantWithdrawReserve[_ticketIdList[i]][_tokenAddress]);
        }
        return reserveValueList;
    }

    /**
     * @dev Transfer the ownership of this contract.
     */
    function transferOwnership(address _newOwner) public isOwner {
        require(_newOwner != address(0), "Zero address for new owner");
        owner = _newOwner;
        emit ChangeOwnership(_newOwner);
    }

    /**
     * @dev Change to new signature worker.
     */
    function changeSignatureWorker(address _newSignatureWorker) public isOwner {
        require(_newSignatureWorker != address(0), "Zero address for new signature worker");
        signatureWorker = _newSignatureWorker;
        emit ChangeSignatureWorker(_newSignatureWorker);
    }

    /**
     * @dev Add workers to this contract.
     */
    function addWorkers(address[] memory _addWorkerList) external isOwner {
        for(uint256 i=0; i < _addWorkerList.length; i++) {
            workerList[_addWorkerList[i]] = true;
        }
        emit AddRemoveWorkers(_addWorkerList, 1);
    }

    /**
     * @dev Remove workers from this contract.
     */
    function removeWorkers(address[] memory _removeWorkerList) external isOwner {
        for(uint256 i=0; i < _removeWorkerList.length; i++) {
            workerList[_removeWorkerList[i]] = false;
        }
        emit AddRemoveWorkers(_removeWorkerList, 0);
    }

    /**
     * @dev Update proxy contract address.
     */
    function updateProxyAddress(address _newProxyAddress) public isOwner {
        require(_newProxyAddress != address(0), "Zero address for new proxy");
        proxy = _newProxyAddress;
        emit ChangeProxy(_newProxyAddress);
    }

    /**
     * @dev Update sigma mining proxy contract address.
     */
    function updateSigmaProxyAddress(address _newSigmaProxyAddress) public isOwner {
        require(_newSigmaProxyAddress != address(0), "Zero address for new sigma proxy");
        sigmaProxy = _newSigmaProxyAddress;
        emit ChangeSigmaProxy(_newSigmaProxyAddress);
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
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _addValue) external isProxy returns(bool _isDone) {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(_clientAddress, address(this), _addValue);
        totalLockedAssets[_tokenAddress] += _addValue;
        _isDone = true;
    }

    /**
     * @dev Internal function, recover signer from signature
     */
    function recoverSignature(bytes32 _targetHash, bytes memory _targetSignature) public pure correctSignatureLength(_targetSignature) returns(address) {
        bytes32 _r;
        bytes32 _s;
        uint8 _v;

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
    function workerUnlockFund(string[] memory _ticketIdList, address _tokenAddress, uint256[] memory _unlockValueList) public isWorker returns(bool _isDone) {
        for (uint i = 0; i < _ticketIdList.length; i++) {
            instantWithdrawReserve[_ticketIdList[i]][_tokenAddress] -= _unlockValueList[i];
        }
        _isDone = true;
    }

    struct Str {
      string sender;
      string token;
      string withdraw;
      string indebt;
      string tier;
      string chainid;
      string pooladdr;
      string expblockno;
      string ticketid;
      string nonce;
    }

    /**
     * @dev Verify signature, internal function
     */
    function verifySignature(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _inDebtValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce) internal view returns(bool _isDone) {
        require(_chainId == block.chainid, "Incorrect chain ID");
        require(_poolAddress == address(this), "Incorrect pool address");
        require(clientNonce[_clientAddress] == _nonce, "Invalid nonce");
        bytes32 _hashForRecover;
        Str memory str;
        str.sender = address2str(_clientAddress);
        str.token = address2str(_tokenAddress);
        str.withdraw = uint2str(_withdrawValue);
        str.indebt = uint2str(_inDebtValue);
        str.tier = uint2str(_tier);
        str.chainid = uint2str(_chainId);
        str.pooladdr = address2str(_poolAddress);
        str.expblockno = uint2str(_expBlockNo);
        str.ticketid = _ticketId;
        str.nonce = uint2str(_nonce);
        _hashForRecover = hashingMessage(keccak256(abi.encode(str.nonce, str.sender, str.token, str.withdraw, str.indebt, str.tier, str.chainid, str.pooladdr, str.expblockno, str.ticketid)));
        require (recoverSignature(_hashForRecover, _targetSignature) == signatureWorker, "Incorrect signature");
        _isDone = true;
    }

    /**
     * @dev Tier 1 and 3 withdrawal
     */
    function verifyAndWithdrawFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _inDebtValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce) public isProxy returns(bool _isDone) {
        require (_expBlockNo >= block.number, "Expired signature");
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _withdrawValue, _inDebtValue, _tier, _chainId, _poolAddress, _expBlockNo, _ticketId, _nonce);
        require (_verification, "Signature verification for instant withdrawal fails");
        clientNonce[_clientAddress] = _nonce + 1;

        // Check if native liquidity is enough for tier 3, and queue for tier 1
        IERC20 token = IERC20(_tokenAddress);
        require(_withdrawValue <= totalLockedAssets[_tokenAddress], "Native withdraw failed");
        if (_tier == 3) {
            require(_inDebtValue == 0, "No in-debt value allowed for tier 3 withdraw");
            token.safeTransfer(_clientAddress, _withdrawValue);
            totalLockedAssets[_tokenAddress] -= _withdrawValue;
        } else if (_tier == 1) {
            require(_inDebtValue > 0 || _withdrawValue > 0, "Total withdraw amount is 0");
            if (_withdrawValue > 0) {
                token.safeTransfer(_clientAddress, _withdrawValue);
                totalLockedAssets[_tokenAddress] -= _withdrawValue;
            }
            if (_inDebtValue > 0) {
                instantWithdrawReserve[_ticketId][_tokenAddress] += _inDebtValue;
            }
        } else {
            revert("Invalid tier");
        }

        _isDone = true;
    }

    /**
     * @dev Verify signature for redeeming SATIS token in Sigma Mining
     */
    function verifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _inDebtValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _expBlockNo, string memory _ticketId, uint256 _nonce) external isProxy returns(bool _isDone) {
        require (_expBlockNo >= block.number, "Expired signature");
        require (_inDebtValue == 0, "No in-debt value allowed for redeeming SATIS token");
        bool _verification = verifySignature(_targetSignature, _clientAddress, _tokenAddress, _redeemValue, _inDebtValue, _tier, _chainId, _poolAddress, _expBlockNo, _ticketId, _nonce);
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
        emit WorkerTakeLockedFund(msg.sender, _tokenAddress, _takeValue);
        _isDone = true;
    }

    /**
     * @dev Worker dumping fund for instant withdrawal.
     */
    function workerDumpInstantWithdrawalFund(string[] memory _ticketIdList, address[] memory _clientAddressList, address _tokenAddress, uint256[] memory _instantWithdrawValueList, uint256 _totalDumpAmount) external 
    isWorker sufficientRebalanceValue(_instantWithdrawValueList, _totalDumpAmount, totalLockedAssets[_tokenAddress]) returns(bool _isDone) {
        IERC20 dumpToken = IERC20(_tokenAddress);
        if (_totalDumpAmount > 0) {
            dumpToken.safeTransferFrom(msg.sender, address(this), _totalDumpAmount);
            totalLockedAssets[_tokenAddress] += _totalDumpAmount;
        }
        for (uint256 i=0; i < _clientAddressList.length; i++) {
            dumpToken.safeTransfer(_clientAddressList[i], _instantWithdrawValueList[i]);
            totalLockedAssets[_tokenAddress] -= _instantWithdrawValueList[i];
            instantWithdrawReserve[_ticketIdList[i]][_tokenAddress] -= _instantWithdrawValueList[i];
        }
        emit WorkerDumpInstantWithdrawFund(msg.sender, _clientAddressList, _tokenAddress, _instantWithdrawValueList);
        _isDone = true;
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