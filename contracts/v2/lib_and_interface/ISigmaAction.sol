// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISigmaAction {

    /**
     * @dev Emit lock fund event
     */
    function sigmaAddFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Emit unlock fund event
     */
    function sigmaQueueWithdraw(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit withdraw fund event
     */
    function sigmaWithdrawFund(string memory _ticketId, address _clientAddress, address _tokenAddress, uint256 _withdrawValue, uint256 _inDebtValue) external returns(bool);

    /**
     * @dev Emit redeem fund event
     */
    function sigmaVerifyAndRedeemToken(address _clientAddress, address _tokenAddress, uint256 _redeemValue) external returns(bool);
}