// SPDX-License-Identifier: MIT

pragma solidity ^0.8.2;

import "./openzeppelin-contracts-4.4.1/contracts/token/ERC20/ERC20.sol";
import "./openzeppelin-contracts-4.4.1/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// import "./openzeppelin-contracts-4.4.1/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
// import "./openzeppelin-contracts-4.4.1/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract Satis is ERC20, ERC20Burnable {
    constructor() ERC20("Satis", "SATIS") {
      _mint(msg.sender, 1e11 * 10 ** 18);
    }
}
