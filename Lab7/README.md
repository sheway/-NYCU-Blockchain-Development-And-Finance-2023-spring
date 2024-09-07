# 311581041-bdaf-lab7
Run the codes to start the smart contract:

1. `npm install`
   - To install the require package of this contract.
2. `npx hardhat node`
   - Start local node server for ethereum.
3. `npx hardhat test`
   - To run the tests in test folder.

# Test description
1. First we gave Alice 10000 USDC as initial founds.
2. In order to let Bob lend all USDC in Compound USDC, I chose four whale WETH account and transfer their all assets to Bob so can he lend all the  assets in Compound USDC.
3. After Bob got enough assets, supply all weth to Compound USDC and lend out all USDC.![image](https://github.com/sheway/311581041-bdaf-lab7/assets/67420772/324dabb9-49ed-4f3b-bbfd-f4ac7d08450b)

4. Alice try to withdraw her assets in Compound USDC, she will find out the contract don't have enough USDC and the tx will revert with Compound USDC have no enough assets.![image](https://github.com/sheway/311581041-bdaf-lab7/assets/67420772/f43412b9-fa8c-4322-8fca-e552a337b2dd)



# Homework descriptions
# Lab7: What happens when Compound has no liquidity?

**Due: 23:59 on Tue, May, 23, 2023** 

---

On block number 17228670, [Compound USDC contract](https://etherscan.io/address/0xc3d688B66703497DAA19211EEdff47f25384cdc3#readProxyContract) roughly has 458k in Liquidity.

Write a test script that simulates two actors that do the following actions:

- Alice provides liquidity (1000 USDC) into the Compound USDC contract
- Bob borrows out all the liquidity from Compound USDC contract.
    - There are some setup required : )
- Alice tries to withdraw, what happens here?

Now. You could use either hardhat or foundry to achieve this, but here are the requirements:

- Simulate on the block 17228670
- Print the USDC balance that is held in the Compound USDC contract before and after every transaction that interacts with it

Tools you will need (I provide the links for hardhat, but foundry should have similar things):

- How to perform [mainnet fork](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks)
- [Impersonating accounts](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#impersonating-accounts)
- [Running on a specific block numbe](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks#pinning-a-block)r
- Token holders page on Etherscan (using [DAI’s](https://etherscan.io/token/0x6b175474e89094c44da98b954eedeac495271d0f#balances) as example)

These are important and practical techniques to test out protocols. When you are developing a protocol that interacts with other defi projects, this is the way to do it. 

To understand Compound, read its doc:

- [https://docs.compound.finance/](https://docs.compound.finance/)

Feel free to discuss about your understanding of Compound in the Discord and figure it out together with your peers!

Detailed step:

- [Print] the USDC balance in the Compound USDC contract
- Alice provides liquidity (1000 USDC) into the Compound USDC contract
- [Print] the USDC balance in the Compound USDC contract
- Bob performs some setup … (think about it and try to figure out yourself!)
- Bob withdraws all the USDC balance
- [Print] the USDC balance in the Compound USDC contract, this should be 0, or a very small number close to 0
- [Print] Alice tries to withdraw 1000 USDC, record what happened and print those out
