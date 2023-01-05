// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISigmaAction {

    /**
     * @dev Emit add fund event
     */
    function sigmaAddFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit lock fund event
     */
    function sigmaLockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Emit unlock fund event
     */
    function sigmaUnlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit remove fund event
     */
    function sigmaRemoveFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Emit redeem fund event
     */
    function sigmaVerifyAndRedeemToken(address _clientAddress, address _tokenAddress, uint256 _redeemValue) external returns(bool);
}