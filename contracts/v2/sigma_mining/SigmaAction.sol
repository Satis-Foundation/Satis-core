// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * A separate contract for event emission
 * In case there is a need to upgrade event format
 */

contract SigmaAction {

    address public owner;
    address public proxy;

    event TransferIn(address clientAddress, address tokenAddress, uint transactionValue);
    event TransferOut(address clientAddress, address tokenAddress, uint transactionValue);
    event Lock(address clientAddress, address tokenAddress, uint transactionValue, string transactionData);
    event Unlock(address clientAddress, address tokenAddress, uint transactionValue);
    event RedeemToken(address clientAddress, address tokenAddress, uint transactionValue);


    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy, "Please use proxy contract.");
        _;
    }


    constructor(address _initialProxyAddress) {
        owner = msg.sender;
        proxy = _initialProxyAddress;
    }

    /**
     * @dev Transfer ownership of this contract
     */
    function transferOwnership(address _newOwner) public isOwner {
        owner = _newOwner;
    }

    /**
     * @dev Reset proxy contract address
     */
    function updateProxyAddress(address _newProxyAddress) public isOwner {
        proxy = _newProxyAddress;
    }

    /**
     * @dev Emit add fund event on chain
     */
    function sigmaAddFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        emit TransferIn(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Emit lock fund event on chain
     */
    function sigmaLockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) public isProxy returns(bool _isDone) {
        emit Lock(_clientAddress, _tokenAddress, _tokenValue, _data);
        _isDone = true;
    }

    /**
     * @dev Emit unlock fund event on chain
     */
    function sigmaUnlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        emit Unlock(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Emit remove fund event on chain
     */
    function sigmaRemoveFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        emit TransferOut(_clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Fund SATIS token
     */
    function sigmaFundSatisToken(address _funderAddress, address _tokenAddress, uint256 _fundingValue) public isProxy returns(bool _isDone) {
        emit TransferIn(_funderAddress, _tokenAddress, _fundingValue);
        _isDone = true;
    }

    /**
     * @dev Redeem mined token
     */
    function sigmaVerifyAndRedeemToken(address _clientAddress, address _tokenAddress, uint256 _redeemValue) public isProxy returns(bool _isDone) {
        emit RedeemToken(_clientAddress, _tokenAddress, _redeemValue);
        _isDone = true;
    }
}