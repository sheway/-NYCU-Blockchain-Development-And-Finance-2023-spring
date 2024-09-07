# 311581041-bdaf-lab5
Run the codes to start the smart contract:

1. `npm install`
   - To install the require package of this contract.
2. `npx hardhat node`
   - Start local node server for ethereum.
3. `npx hardhat test`
   - To run the tests in test folder.

# Homework descriptions
## Lab5: Getting your feet wet into Defi

**Due: 23:59 on Mon, April, 10, 2023 for students already in the class**

---

In this lab, we’ll be playing around with Defi platform that are deployed on Georli testnet so that you get more familiar to it - not only as a user, but also as a protocol developer.

Here is the scenario: 

you are a protocol developer who are launching your own project and your own token. You want to create an Uniswap Market for your own token that is paired with DAI. But you have some ETH but not DAI. Your token contract has an owner role: in the beginning, it should be your own address, however after the initial operations, you should be handling it over to a multiSig contract(The well known one is Gnosis Safe). Lastly, you are going to perform a rug-pull, you are going to mint a lot of tokens and sell all the tokens into the pool to get most of the DAI back. 

**Submission link:** [https://forms.gle/Dib8nyCMFU2MsZPt8](https://forms.gle/Dib8nyCMFU2MsZPt8)

1. Develop an ERC20 token: 
    - 18 decimals.
    - Minting and burning capability with onlyOwner access control.
    - Ability to transfer ownership
2. Deploy your ERC20 token. Mint 1000 tokens (i.e. 1000 * 10^18 units) to yourself. **(Record the address of your own token)**
3. Go to Aave, lend ETH and borrow DAI out **(Record your Borrow transaction)**
    1. Go to AaveV3 Goerli: [https://staging.aave.com/?marketName=proto_goerli_v3](https://staging.aave.com/?marketName=proto_goerli_v3) 
    2. On the left, Supply 0.05 ETH.
    3. Borrow some DAI (50 or 100)
4. Go to Etherscan and get the address of the DAI **(Record the address of the DAI token)**
    - As this is a testnet, there are a lot of different versions of DAI, we’re going to use the one you borrowed out from Aave.
5. Go to UniswapV2 to create a new liquidity pair: [https://app.uniswap.org/#/pools/v2](https://app.uniswap.org/#/pools/v2) 
    - Make sure you are on Goerli testnet
    - “Add V2 Liquidity”
    - paste the address of your DAI token you have in one field (the ui should show you that you have some)
    - Paste the address of your own token in the other field
    - We can actually set the initial price of the token by determining the ratio between DAI and your token: let’s make your token worth 10 DAI by supplying 100 DAI to 10 of your token. (or 50 DAI to 5 of your token).
    - Approve DAI and your token to Uniswap, and hit the Supply button. (It will ask you to “Create pool and Supply”)
    - You will receive some pool tokens as per this transaction. Look at your address on Etherscan and determine the address of the token. **(Record the address of the pool token)**
    - Try [Swap](https://app.uniswap.org/#/swap), you should be able to swap your token to DAI now. Buy 0.001 of your token now. **(Record the transaction)**
6. Create a [Safe (Gnosis’s multiSig solution) on Goerli](https://app.safe.global/new-safe/create) **(Record the address of your Safe multiSig address)**
    - Have 2 owners in the Safe. You can use Metamask to generate the second address.
    - Set the Threshold as 2 out of 2 owners. This means that every time this multiSig is sending a transaction, both of these owners have to sign.
7. Transfer Ownership of your token to your Safe multiSig address. **(Record the transaction)**
8. Mint 10000 of your tokens by using your Safe multiSig address to your own address **(Record the transaction)**
9. Sell all of the 10000 tokens into the Uniswap pool you created. **(Record the transaction)**
