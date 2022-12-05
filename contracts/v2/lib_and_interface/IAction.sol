// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IAction {

    /**
     * @dev Emit add fund event
     */
    function addFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit lock fund event
     */
    function lockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Emit unlock fund event
     */
    function unlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit remove fund event
     */
    function removeFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);
}