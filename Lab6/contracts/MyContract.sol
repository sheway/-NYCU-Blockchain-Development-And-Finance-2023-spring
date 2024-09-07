// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface WPrivateClubNFT {
    function iDeclareBeingRich() external;
}
contract MyContract is Ownable {
    event NFTTransfered(uint256 _tokenId);

    address public bankToken;
    address public WealtPrivateClubNFT;
    address public Bank;
    
    constructor(address Token, address club, address bank){
        transferOwnership(msg.sender);
        bankToken = Token;
        WealtPrivateClubNFT = club;
        Bank = bank;
    }

    function executeWithMoney(uint256 amount) external{
        WPrivateClubNFT(WealtPrivateClubNFT).iDeclareBeingRich();
        IERC20(bankToken).transfer(Bank, amount);
    }

    function transferNFT(uint256 _tokenId) external onlyOwner{
        IERC721(WealtPrivateClubNFT).approve(msg.sender, _tokenId);
        IERC721(WealtPrivateClubNFT).safeTransferFrom(address(this), msg.sender, _tokenId);
        emit NFTTransfered(_tokenId);
    }
}
