// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol';
//import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
//import "@openzeppelin/contracts/utils/math/SafeMath.sol';


contract moniesPull {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) clientERC20Balance;
    mapping (address => uint256) clientETHBalance;
    mapping (address => mapping (address => uint256)) clientERC20Lock;
    mapping (address => uint256) clientETHLock;


    event ethTransferLog (address sendAddress, address receiveAddress, string transactionData, string assetType, uint transactionValue);
    event erc20TransferLog (address sendAddress, address receiveAddress, string transactionData, string assetType, address erc20Address, uint transactionValue);




    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    //
    // !!! Should we include lock and unlock change in deposit?
    //
    function ethDeposit (string memory data) payable external {
        clientETHBalance[msg.sender] = clientETHBalance[msg.sender].add(msg.value);
        //clientETHLock[msg.sender] = newLockValue;
        emit ethTransferLog(msg.sender, address(this), data, 'ETH', msg.value);
    }

    function ethWithdrawal (uint256 withdrawValue) external {
        require (withdrawValue <= clientETHBalance[msg.sender].sub(clientETHLock[msg.sender]), "Not enough mobile assets");
        address payable transferAddress = payable(msg.sender);
        transferAddress.transfer(withdrawValue);
        clientETHBalance[msg.sender] = clientETHBalance[msg.sender].sub(withdrawValue);
        emit ethTransferLog(address(this), msg.sender, 'Assets withdrew', 'ETH', withdrawValue);
    }
    
    function ethLock (uint256 newLockValue) external {
        clientETHLock[msg.sender] = newLockValue;
    }




    function erc20Approve (address tokenAddress, uint256 tokenValue) external {
        IERC20 approveToken = IERC20(tokenAddress);
        approveToken.safeApprove(msg.sender, tokenValue);
    }
    
    function erc20IncreaseAllowance (address tokenAddress, uint256 tokenValue) external {
        IERC20 allowToken = IERC20(tokenAddress);
        allowToken.safeIncreaseAllowance(msg.sender, tokenValue);
    }
    
    function erc20DecreaseAllowance (address tokenAddress, uint256 tokenValue) external {
        IERC20 allowToken = IERC20(tokenAddress);
        allowToken.safeIncreaseAllowance(msg.sender, tokenValue);
    }

    function erc20Deposit (address tokenAddress, uint256 tokenValue, string memory data) external {
        IERC20 depositToken = IERC20(tokenAddress);
        depositToken.safeTransferFrom(msg.sender, address(this), tokenValue);
        emit erc20TransferLog(msg.sender, address(this), data, 'ERC20', tokenAddress, tokenValue);
    }

    function erc20Withdrawal (address tokenAddress, uint256 tokenValue) external {
        IERC20 withdrawToken = IERC20(tokenAddress);
        withdrawToken.safeTransfer(msg.sender, tokenValue);
        emit erc20TransferLog(address(this), msg.sender, 'Assets withdrew', 'ERC20', tokenAddress, tokenValue);
    }


}