// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/utils/Address.sol";
import "./Safe.sol";
import "./Proxy.sol";
import "./SafeUpgradeable.sol";

contract SafeFactory {
    address public _implementation; // Address of the Safe implementation contract
    address payable public _owner; // Owner of the factory contract

    constructor(address impl) {
        _implementation = impl; // Deploy Safe implementation and store its address
        _owner = payable(msg.sender);
    }

    function deploySafe() external returns (address){
        Safe safe = new Safe();
        safe.transferOwnership(msg.sender);
        require(Address.isContract(address(safe)), "Safe creation failed");
        return address(safe);
    }   

    function deploySafeProxy() external returns (address) {
        Proxy proxy = new Proxy(_implementation, msg.sender);
        require(Address.isContract(address(proxy)), "Safe proxy creation failed"); // To make sure the Safe contract is initialized
        address(proxy).call(abi.encodeWithSignature("initialize()"));
        return address(proxy);
    }

    function updateImplementation(address newImp) external {
        require(msg.sender == _owner, "You are not owner");
        _implementation = newImp;
    }
}
