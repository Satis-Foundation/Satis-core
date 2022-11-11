// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * Interface of the money pool functions
 */

interface IMoneyPoolRaw {
    /**
     * @dev Returns client's nonce.
     */
    function getClientSigmaNonce(address _clientAddress) external view returns(uint256);

    /**
     * @dev Returns client's balance.
     */
    function getClientSigmaBalance(address _clientAddress, address _tokenAddress) external view returns(uint256);

    /**
     * @dev Returns client's locked balance.
     */
    function getClientSigmaLockBalance(address _clientAddress, address _tokenAddress) external view returns(uint256);

    /**
     * @dev Return contract's storage of SATIS tokens.
     */
    function getSatisTokenAmountInContract(address _tokenAddress) external view returns(uint256);

    /**
     * @dev Returns pool's owner address.
     */
    function getSigmaPoolOwner() external view returns(address);

    /**
     * @dev Transfer fund.
     */
    function sigmaAddFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Lock fund.
     */
    function sigmaLockFundWithAction(address _clientAddress, address _tokenAddress, uint256 _tokenValue, string memory _data) external returns(bool);

    /**
     * @dev Add and lock fund.
     */
    function sigmaAddFundWithAction(address _clientAddress, address _tokenAddress, uint256 _lockValue, uint256 _addValue, string memory _data) external returns(bool);

    /**
     * @dev Remove fund.
     */
    function sigmaRemoveFund(address _clientAddress, address _tokenAddress, uint256 _tokenValue) external returns(bool);

    /**
     * @dev Verify and unlock fund.
     */
    function sigmaVerifyAndUnlockFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _nonce, uint256 _newLockValue) external returns(bool);

    /**
     * @dev Verify, unlock and remove fund.
     */
    function sigmaVerifyAndRemoveFund(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _unlockValue, uint256 _withdrawValue, uint256 _nonce, uint256 _newLockValue) external returns(bool);

    /**
     * @dev Verify and redeem SATIS tokens.
     */
    function sigmaVerifyAndRedeemToken(bytes memory _targetSignature, address _clientAddress, address _tokenAddress, uint256 _redeemValue, uint256 _nonce) external returns(bool)
}