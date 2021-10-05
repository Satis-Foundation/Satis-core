// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract moniesPull {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) clientERC20Balance;
    mapping (address => mapping (address => uint256)) clientERC20Lock;
    address public adminAddress;


    event erc20TransferLog (address sendAddress, address receiveAddress, string transactionData, string assetType, address erc20Address, uint transactionValue);

    constructor() {
        adminAddress = msg.sender;
    }


    function erc20Deposit (address tokenAddress, uint256 tokenValue, string memory data) external {
        IERC20 depositToken = IERC20(tokenAddress);
        depositToken.safeTransferFrom(msg.sender, address(this), tokenValue);
        clientERC20Balance[msg.sender][tokenAddress] = clientERC20Balance[msg.sender][tokenAddress].add(tokenValue);
        emit erc20TransferLog(msg.sender, address(this), data, 'ERC20', tokenAddress, tokenValue);
    }

    function erc20Withdrawal (address tokenAddress, uint256 tokenValue) external {
        require (tokenValue <= clientERC20Balance[msg.sender][tokenAddress].sub(clientERC20Lock[msg.sender][tokenAddress]), "Not enough mobile assets");
        IERC20 withdrawToken = IERC20(tokenAddress);
        withdrawToken.safeTransfer(msg.sender, tokenValue);
        clientERC20Balance[msg.sender][tokenAddress] = clientERC20Balance[msg.sender][tokenAddress].sub(tokenValue);
        emit erc20TransferLog(address(this), msg.sender, 'Assets withdrew', 'ERC20', tokenAddress, tokenValue);
    }

    function clientErc20AddLock (address clientAddress, address tokenAddress, uint256 addLockValue) public {
        require (msg.sender == clientAddress, "Error: Incorrect client address");
        clientERC20Lock[clientAddress][tokenAddress] = clientERC20Lock[clientAddress][tokenAddress].add(addLockValue);
    }

    function adminErc20Unlock (address clientAddress, address tokenAddress, uint256 unlockValue) public {
        require (msg.sender == adminAddress, "Error: Not an Admin");
        clientERC20Lock[clientAddress][tokenAddress] = clientERC20Lock[clientAddress][tokenAddress].sub(unlockValue);
    }
}
