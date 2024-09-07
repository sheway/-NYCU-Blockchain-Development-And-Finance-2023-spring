// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Safe {
    address payable public _owner;
    uint256 public _TX_FEE_RATE;
    mapping(address => mapping(address => uint256)) balances;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    event Deposit(address indexed account, address indexed token, uint256 amount, uint256 fee);
    event Withdraw(address indexed account, address indexed token, uint256 amount);

    //set owner be payable and set transfer fee to 0.001% in wei format
    constructor() {
        _owner = payable(msg.sender);
        _TX_FEE_RATE = 0.001 ether;  // 0.1%
    }

    //if function with this modifier should satisfy owner check
    modifier onlyOwner() {
        require(msg.sender == _owner, "You are not owner");
        _;
    }

    //to deposit tokens to the contract
    function deposit(address token, uint256 amount) external {
        uint256 fee = amount * _TX_FEE_RATE / 1e18;
        balances[_owner][token] += fee;
        balances[msg.sender][token] += amount;
        balances[msg.sender][token] -= fee;
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, token, amount, fee);
    }

    //to withdraw tokens from the contract
    function withdraw(address token, uint256 amount) external {
        require(balances[msg.sender][token] >= amount, "You don't have enough token");
        balances[msg.sender][token] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }

    //to check the token balance of an account outside of  the coontract
    function balanceOf(
        address account,
        address token
    ) external view returns (uint256) {
        return balances[account][token];
    }

    //for the owner to withdraw fees collected in a specific token
    function takeFee(address token) onlyOwner external{
        uint256 bal = balances[msg.sender][token];
        balances[msg.sender][token] = 0;
        IERC20(token).transfer(msg.sender, bal);
    }

    //for the owner to transfer ownership to a new address
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner address cannot be zero address");
        address _ole_owner = _owner;
        _owner = payable(newOwner);
        emit OwnershipTransferred(_ole_owner, newOwner);
    }
}
