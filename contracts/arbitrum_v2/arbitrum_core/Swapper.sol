// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../lib_and_interface/TransferHelper.sol";
import "../lib_and_interface/IUniswapRouter.sol";
import "../lib_and_interface/Address.sol";
import "../lib_and_interface/IERC20.sol";
import "../lib_and_interface/SafeERC20.sol";

contract Swapper {

    using SafeERC20 for IERC20;

    address public swapRouterAddress;

}