// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library MultiSig {
    function recoverSignature(bytes32 _targetHash, bytes memory _targetSignature) internal pure returns(address) {
        require (_targetSignature.length == 65, "Incorrect signature length, length must be 65");
        
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

    struct Str {
      string sender;
      string token;
      string withdraw;
      string tier;
      string chainid;
      string pooladdr;
      string nonce;
    }

    /**
     * @dev Verify signature, internal function
     */
    function verifySignature(address _targetAddress, bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _tier, uint256 _chainId, address _poolAddress, uint256 _nonce) public pure returns(bool) {
        // require(_chainId == block.chainid, "Incorrect chain ID");
        // require(_poolAddress == address(this));
        // require(clientNonce[_clientAddress] == _nonce, "Invalid nonce");
        bytes32 _matchHash;
        bytes32 _hashForRecover;
        address _recoveredAddress;
        Str memory str;
        str.sender = address2str(_clientAddress);
        str.token = address2str(_tokenAddress);
        str.withdraw = uint2str(_withdrawValue);
        str.tier = uint2str(_tier);
        str.chainid = uint2str(_chainId);
        str.pooladdr = address2str(_poolAddress);
        str.nonce = uint2str(_nonce);
        _matchHash = keccak256(abi.encode(str.nonce, str.sender, str.token, str.withdraw, str.tier, str.chainid, str.pooladdr));
        _hashForRecover = hashingMessage(_matchHash);
        _recoveredAddress = recoverSignature(_hashForRecover, _targetSignature);
        return _recoveredAddress == _targetAddress;
    }
}