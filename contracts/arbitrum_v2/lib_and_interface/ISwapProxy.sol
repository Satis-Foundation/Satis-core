// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ISwapProxy {

    /**
     * @dev Universal function for swapping token
     */
    function swap(address _clientAddress, address _tokenIn, address _tokenOut, uint256 _tokenInAmount, uint24 _poolFee, uint256 _minAmountSwap, uint160 _sqrtPriceLimitX96) external returns(uint256);
}