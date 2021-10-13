// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;


/*
 * This contract is a simple money pool for deposit. 
 * It supports transfer and withdrawal of assets (ETH and ERC20 tokens).
 * (In most of the Layer 2 implementations, wrapped Ether is used instead).
 *
 * This contract uses Openzeppelin's library for ERC20 tokens. 
 * When deploying on certain L2s (such as Optimism), it requires a slight modification
 * of the original ERC20 token library, since some OVMs do not support ETH functions. 
 */

import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/utils/SafeERC20.sol';
import 'https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol';
//import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';
//import '@openzeppelin/contracts/utils/math/SafeMath.sol';


contract moneyPool {

    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    mapping (address => mapping (address => uint256)) clientERC20Balance;
    mapping (address => uint256) clientETHBalance;
    mapping (address => mapping (address => uint256)) clientERC20Lock;
    mapping (address => uint256) clientETHLock;

    address public owner;


    /*
     * Events that will be triggered when assets are deposited.
     * The log files will record the sender, recipient and transaction data.
     */
    event ethTransferLog (address sendAddress, address recipientAddress, string transactionData, string assetType, uint transactionValue);
    event erc20TransferLog (address sendAddress, address recipientAddress, string transactionData, string assetType, address erc20Address, uint transactionValue);


    
    /*
     * Set owner address. 
     */
    constructor() {
        owner = msg.sender;
    }

    /*
     * Transfer the ownership of this contract.
     * Only the owner (admin) can trigger this function.
     */
    function transferOwnership (address _newOwner) public {
        require (msg.sender == owner, "Error: Not an admin");
        owner = _newOwner;
    }

 
    
    /*
     * Deposit Ether into this contract.
     */
    function ethDeposit (string memory _data) payable external {
        clientETHBalance[msg.sender] = clientETHBalance[msg.sender].add(msg.value);
        //clientETHLock[msg.sender] = newLockValue;
        emit ethTransferLog(msg.sender, address(this), _data, 'ETH', msg.value);
    }

    /*
     * Withdraw Ether from this contract.
     * The withdraw action will failed if there is not enough mobile asset.
     */
    function ethWithdrawal (uint256 _withdrawValue) external {
        require (_withdrawValue <= clientETHBalance[msg.sender].sub(clientETHLock[msg.sender]), "Not enough mobile assets");
        address payable transferAddress = payable(msg.sender);
        transferAddress.transfer(_withdrawValue);
        clientETHBalance[msg.sender] = clientETHBalance[msg.sender].sub(_withdrawValue);
        emit ethTransferLog(address(this), msg.sender, 'Assets withdrew', 'ETH', _withdrawValue);
    }
    
    /*
     * User function for locking Ether in this contract.
     * Only the user can call this function.
     */
    function clientETHAddLock (address _clientAddress, uint _addLockValue) public {
        require (msg.sender == _clientAddress, "Error: Incorrect client address");
        clientETHLock[_clientAddress] = clientETHLock[_clientAddress].add(_addLockValue);
    }

    /*
     * Admin function for unlocking a user's Ether.
     * Only the owner (admin) can call this function.
     */
    function adminETHUnlock (address _clientAddress, uint _unlockValue) public {
        require (msg.sender == owner, "Error: Not an Admin");
        clientETHLock[_clientAddress] = clientETHLock[_clientAddress].sub(_unlockValue);
    }



    /*
     * Deposit ERC20 tokens into this contract.
     */
    function erc20Deposit (address _tokenAddress, uint256 _tokenValue, string memory _data) external {
        IERC20 depositToken = IERC20(_tokenAddress);
        depositToken.safeTransferFrom(msg.sender, address(this), _tokenValue);
        clientERC20Balance[msg.sender][_tokenAddress] = clientERC20Balance[msg.sender][_tokenAddress].add(_tokenValue);
        emit erc20TransferLog(msg.sender, address(this), _data, 'ERC20', _tokenAddress, _tokenValue);
    }

    /*
     * Withdraw ERC20 tokens from this contract.
     * The withdraw action will failed if there is not enough mobile asset.
     */
    function erc20Withdrawal (address _tokenAddress, uint256 _tokenValue) external {
        require (_tokenValue <= clientERC20Balance[msg.sender][_tokenAddress].sub(clientERC20Lock[msg.sender][_tokenAddress]), "Not enough mobile assets");
        IERC20 withdrawToken = IERC20(_tokenAddress);
        withdrawToken.safeTransfer(msg.sender, _tokenValue);
        clientERC20Balance[msg.sender][_tokenAddress] = clientERC20Balance[msg.sender][_tokenAddress].sub(_tokenValue);
        emit erc20TransferLog(address(this), msg.sender, 'Assets withdrew', 'ERC20', _tokenAddress, _tokenValue);
    }

    /*
     * User function for locking ERC20 tokens in this contract.
     * Only the user can call this function.
     */
    function clientErc20AddLock (address _clientAddress, address _tokenAddress, uint256 _addLockValue) public {
        require (msg.sender == _clientAddress, "Error: Incorrect client address");
        clientERC20Lock[_clientAddress][_tokenAddress] = clientERC20Lock[_clientAddress][_tokenAddress].add(_addLockValue);
    }

    /*
     * Admin function for unlocking a user's ERC20 tokens.
     * Only the owner (admin) can call this function.
     */
    function adminErc20Unlock (address _clientAddress, address _tokenAddress, uint256 _unlockValue) public {
        require (msg.sender == owner, "Error: Not an Admin");
        clientERC20Lock[_clientAddress][_tokenAddress] = clientERC20Lock[_clientAddress][_tokenAddress].sub(_unlockValue);
    }
    
}
