// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * Interface of the money pool functions
 */

interface IMoneyPoolRaw {
    /**
     * @dev Returns client's nonce.
     */
    function getClientNonce(address _clientAddress) external view returns(uint256);

    /**
     * @dev Returns client's balance.
     */
    function getClientBalance(address _clientAddress, address _tokenAddress) external view returns(uint256);

    /**
     * @dev Returns client's locked balance.
     */
    function getClientLockBalance(address _clientAddress, address _tokenAddress) external view returns(uint256);

    /**
     * @dev Returns pool's owner address.
     */
    function getPoolOwner() external view returns(address);

    /**
     * @dev Transfer fund.
     */
    function addFund(address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Lock fund.
     */
    function lockFundWithAction(address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Add and lock fund.
     */
    function addFundWithAction(address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data) external returns(bool);

    /**
     * @dev Remove fund.
     */
    function removeFund(address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Pool admin unlock fund.
     */
    function unlockFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Verify and unlock fund.
     */
    function verifyAndUnlockFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue) external returns(bool);

    /**
     * @dev Verify, unlock and remove fund.
     */
    function verifyAndRemoveFund(bytes memory _targetSignature, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue) external returns(bool);

    /**
     * @dev Pool owner take locked fund.
     */
    function ownerTakeLockedFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev View funds in contract.
     */
    function viewFund(address _tokenAddress) external view returns(uint256 _totalFund, uint256 _lockedFund);
}