pragma solidity ^0.8.18;
interface IERC20 {
    function deposit() external payable;
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external;
    function decimals() external view returns (uint8);
    function symbol() external view returns (string memory);
}