// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAction {

    /**
     * @dev Emit add fund event
     */
    function addFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Emit queue for withdraw event
     */
    function queueWithdraw(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit withdraw event
     */
    function withdrawFund(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);
}
