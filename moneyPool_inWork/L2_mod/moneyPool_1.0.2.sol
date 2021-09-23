// SPDX-License-Identifier: MIT

pragma solidity ^0.7.6;

import '@openzeppelin/contracts/token/ERC20/SafeERC20.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract moniesPull {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) clientERC20Balance;
    //mapping (address => uint256) clientETHBalance;
    mapping (address => mapping (address => uint256)) clientERC20Lock;
    //apping (address => uint256) clientETHLock;

    address public adminAddress;


    //event ethTransferLog (address sendAddress, address receiveAddress, string transactionData, string assetType, uint transactionValue);
    event erc20TransferLog (address sendAddress, address receiveAddress, string transactionData, string assetType, address erc20Address, uint transactionValue);


    
    constructor() {
        adminAddress = msg.sender;
    }

    /*
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    */
    
    
    
    /*
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
        // input new lock value to overwrite
        clientETHLock[msg.sender] = newLockValue;
    }
    
    function adminETHLock (address clientAddress, uint newLockValue) public {
        require (msg.sender == adminAddress, "Error: Not an Admin");
        clientETHLock[clientAddress] = newLockValue;
    }
    */



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

    function erc20Lock (address tokenAddress, uint256 newLockValue) external {
        // input new lock value to overwrite
        clientERC20Lock[msg.sender][tokenAddress] = newLockValue;
    }
    
    function adminErc20Lock (address clientAddress, address tokenAddress, uint256 newLockValue) public {
        require (msg.sender == adminAddress, "Error: Not an Admin");
        clientERC20Lock[clientAddress][tokenAddress] = newLockValue;
    }
    
    
    
    /*
    Should we provide a function for the owner to add other admins?
    function addAdmin (address newAdminAddress) public {
        
    }
    */
}
