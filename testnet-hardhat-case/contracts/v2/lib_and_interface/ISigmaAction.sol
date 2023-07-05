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
    function sigmaQueueWithdraw(address _clientAddress, address _tokenAddress, uint256 _tokenValue, uint256 _tier) external returns(bool);

    /**
     * @dev Emit redeem fund event
     */
    function sigmaVerifyAndRedeemToken(address _clientAddress, address _tokenAddress, uint256 _redeemValue) external returns(bool);
}