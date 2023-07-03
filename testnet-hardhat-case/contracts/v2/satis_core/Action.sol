// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * A separate contract for event emission
 * In case there is a need to upgrade event format
 */

contract Action {

    address public owner;
    address public proxy;

    event TransferIn(address clientAddress, address tokenAddress, uint transactionValue, string data);
    event Queue(address clientAddress, address tokenAddress, uint queueValue, uint tier);
    event ChangeOwnership(address newOwner);
    event ChangeProxy(address newProxy);



    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxy, "Please use proxy contract.");
        _;
    }



    constructor(address _initialProxyAddress) {
        require(_initialProxyAddress != address(0), "Zero address for proxy");
        owner = msg.sender;
        proxy = _initialProxyAddress;
    }

    /**
     * @dev Transfer ownership of this contract
     */
    function transferOwnership(address _newOwner) public isOwner {
        require(_newOwner != address(0), "Zero address for new owner");
        owner = _newOwner;
        emit ChangeOwnership(_newOwner);
    }

    /**
     * @dev Reset proxy contract address
     */
    function updateProxyAddress(address _newProxyAddress) public isOwner {
        require(_newProxyAddress != address(0), "Zero address for new proxy");
        proxy = _newProxyAddress;
        emit ChangeProxy(_newProxyAddress);
    }

    /**
     * @dev Emit add fund event on chain
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) public isProxy returns(bool _isDone) {
        emit TransferIn(_clientAddress, _tokenAddress, _tokenValue, _data);
        _isDone = true;
    }

    /**
     * @dev Emit unlock fund event on chain
     */
    function queueWithdraw(address _clientAddress, address _tokenAddress, uint256 _tokenValue, uint256 _tier) public isProxy returns(bool _isDone) {
        emit Queue(_clientAddress, _tokenAddress, _tokenValue, _tier);
        _isDone = true;
    }
}