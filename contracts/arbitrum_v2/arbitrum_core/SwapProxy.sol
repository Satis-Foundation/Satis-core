// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/TransferHelper.sol";
import "../lib_and_interface/IUniswapRouter.sol";
import "../lib_and_interface/Address.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";

contract SwapProxy {

    using SafeERC20 for IERC20;

    // Swap routers in use are sorted by token type.
    address public owner;
    address public proxyAddress;
    address public swapRouterAddress;
    mapping (address => bool) public swapWorkerList;
    mapping (address => bool) public enabledCurrency;

    modifier isOwner() {
        require (msg.sender == owner, "Not an admin");
        _;
    }

    modifier isSwapWorker() {
        require (swapWorkerList[msg.sender] == true, "Not a worker");
        _;
    }

    modifier isProxy() {
        require (msg.sender == proxyAddress, "Please use proxy contract");
        _;
    }

    constructor(address[] memory _currencyList, address _swapRouterAddress) {
        owner = msg.sender;
        for(uint256 i=0; i < _currencyList.length; i++) {
            enabledCurrency[_currencyList[i]] = true;
        }
        swapRouterAddress = _swapRouterAddress;
    }

    function transferOwnership(address _newOwner) external isOwner {
        owner = _newOwner;
    }

    function changeSwapWorker(address _worker, bool _isAdd) external isOwner {
        if (_isAdd) {
            swapWorkerList[_worker] = true;
        } else {
            swapWorkerList[_worker] = false;
        }
    }

    function changeSwapRouter(address _swapRouterAddress) external isSwapWorker {
        swapRouterAddress = _swapRouterAddress;
    }

    function changeEnabledCurrency(address _currency, bool _isAdd) external isSwapWorker {
        if (_isAdd) {
            enabledCurrency[_currency] = true;
        } else {
            enabledCurrency[_currency] = false;
        }
    }

    function swap(address _clientAddress, address _tokenIn, address _tokenOut, uint256 _tokenInAmount, uint24 _poolFee, uint256 _minAmountSwap, uint160 _sqrtPriceLimitX96, bool _isExactIn) external isProxy returns(uint256) {
        require(enabledCurrency[_tokenIn] == true, "TokenIn is not valid currency");
        require(_tokenIn != _tokenOut, "TokenIn == TokenOut");
        require(_tokenInAmount > 0, "0 swap amount");

        TransferHelper.safeTransferFrom(_tokenIn, _clientAddress, address(this), _tokenInAmount);
        TransferHelper.safeApprove(_tokenIn, swapRouterAddress, _tokenInAmount);
        IUniswapRouter.ExactInputSingleParams memory params = IUniswapRouter.ExactInputSingleParams({
            tokenIn: _tokenIn,
            tokenOut: _tokenOut,
            fee: _poolFee,
            recipient: _clientAddress,
            deadline: block.timestamp,
            amountIn: _tokenInAmount,
            amountOutMinimum: _minAmountSwap,
            sqrtPriceLimitX96: _sqrtPriceLimitX96
        });
        IUniswapRouter uniswapRouter = IUniswapRouter(swapRouterAddress);
        uint256 _tokenOutAmount = uniswapRouter.exactInputSingle(params);

        TransferHelper.safeTransfer(_tokenOut, proxyAddress, _minAmountSwap);

        return _tokenOutAmount;
    }
}