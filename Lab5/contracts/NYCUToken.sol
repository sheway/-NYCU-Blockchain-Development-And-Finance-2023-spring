// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

//import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NYCUToken is ERC20, Ownable {
    constructor() ERC20("NYCUToken", "NYCU") {
        _mint(msg.sender, 5000 ether);
    }
    function mint(address addr, uint256 amount) public onlyOwner {
        _mint(addr, amount);
    }

    function burn(uint256 amount) public onlyOwner {
        _burn(msg.sender, amount);
    }

    function transferOwner(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }
}
