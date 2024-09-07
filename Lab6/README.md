# 311581041-bdaf-lab6
Run the codes to start the smart contract:

1. `npm install`
   - To install the require package of this contract.
2. `npx hardhat node`
   - Start local node server for ethereum.
3. `npx hardhat test`
   - To run the tests in test folder.

# Contract description
1. We can find out that if we need to mint NFT from `WealthClubNFT`, we need to have over 1000000e18 of Bank Token.
2. In order to let `BankWithFlashloan` to call my contract, the name of function must to be `executeWithMoney`.
3. After using the function `flashloan` in contract `BankWithFlashloan`, `BankWithFlashloan` will call my contract, and at the end of contract, we must return the ownership of the token we borrowed.
4. If the transaction is complete, we can use contract address to `WealthClubNFT` to check if we get NFT successfully.
5. Use `transferNFT` in `MyContract` to transfer NFT to contract owner.


# Homework descriptions
# Lab6: Open Sesame with Flashloan

**Due: 23:59 on Fri, April, 28, 2023 for students already in the class**

---

**Here is the scenario:** 

You are a poor dev and want to get into the door of a wealthy club, the wealthy club is gated by an NFT. Only those who hold this [WealthyPrivateClub NFT](https://goerli.etherscan.io/address/0x5e94B61BCa112683D18d5Ed27CebB16566E6d5ba#code) can walk into their secret club. The secret club consists of wealthy members who holds lot of [“Bank Token”](https://goerli.etherscan.io/address/0x7A81e50E0Ad45B31cC8E54A55095714F13a0c74e). Separately, the token is used to govern a Bank and they have recently released a new smart contract [BankWithFlashloan](https://goerli.etherscan.io/address/0xbe02727047fADd7fe434E093e001745B42C5F49B#code), adding a flashloan capability and with lots of Bank Token in it. 

Figure out a way to get the NFT **to your own address**. You’re going to need flashloan for sure. 

1. Record the transaction that used flashloan. 
2. Record the transaction that gets the NFT to your own address. 

 

**Submission link:** [https://forms.gle/rTweSao8KwUCCPuP8](https://forms.gle/rTweSao8KwUCCPuP8)
