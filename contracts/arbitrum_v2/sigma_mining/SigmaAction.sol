// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * A separate contract for event emission
 * In case there is a need to upgrade event format
 */

contract SigmaAction {

    address public owner;
    address public proxy;

    event TransferIn(address clientAddress, address tokenAddress, uint transactionValue, string data);
    event Queue(string ticketId, address clientAddress, address tokenAddress, uint queueValue);
    event Withdraw(string ticketId, address clientAddress, address tokenAddress, uint withdrawValue, uint inDebtValue);
    event RedeemToken(string ticketId, address clientAddress, address tokenAddress, uint transactionValue);
    event ChangeOwnership(address newOwner);
    event ChangeSigmaProxy(address newSigmaProxy);

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy, "Please use proxy contract.");
        _;
    }


    constructor(address _initialProxyAddress) {
        require(_initialProxyAddress != address(0), "Zero address for sigma proxy");
        owner = msg.sender;
        proxy = _initialProxyAddress;
    }

    /**
     * @dev Transfer ownership of this contract
     */
    function transferOwnership(address _newOwner) public isOwner {
        require(_newOwner != address(0), "Zero address for new sigma action owner");
        owner = _newOwner;
        emit ChangeOwnership(_newOwner);
    }

    /**
     * @dev Reset proxy contract address
     */
    function updateProxyAddress(address _newProxyAddress) public isOwner {
        require(_newProxyAddress != address(0), "Zero address for new sigma proxy");
        proxy = _newProxyAddress;
        emit ChangeSigmaProxy(_newProxyAddress);
    }

    /**
     * @dev Emit transfer in event on chain
     */
    function sigmaAddFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) public isProxy returns(bool _isDone) {
        emit TransferIn(_clientAddress, _tokenAddress, _tokenValue, _data);
        _isDone = true;
    }

    /**
     * @dev Emit queue event on chain
     */
    function sigmaQueueWithdraw(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _tokenValue) public isProxy returns(bool _isDone) {
        emit Queue(_ticketId, _clientAddress, _tokenAddress, _tokenValue);
        _isDone = true;
    }

    /**
     * @dev Emit withdraw event on chain
     */
    function sigmaWithdrawFund(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _inDebtValue) public isProxy returns(bool _isDone) {
        emit Withdraw(_ticketId, _clientAddress, _tokenAddress, _withdrawValue, _inDebtValue);
        _isDone = true;
    }

    /**
     * @dev Fund SATIS token
    function sigmaFundSatisToken(address _funderAddress, address _tokenAddress, uint256 _fundingValue) public isProxy returns(bool _isDone) {
        emit TransferIn(_funderAddress, _tokenAddress, _fundingValue);
        _isDone = true;
    }
    */

    /**
     * @dev Redeem mined token
     */
    function sigmaVerifyAndRedeemToken(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _redeemValue) public isProxy returns(bool _isDone) {
        emit RedeemToken(_ticketId, _clientAddress, _tokenAddress, _redeemValue);
        _isDone = true;
    }
}