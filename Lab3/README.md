# 311581041-bdaf-lab3

Run the codes to start the smart contract:

1. `npm install`
   - To install the necessary package in `package.json`
2. `npx hardhat node`
   - Start local node server for ethereum, or install [Ganache](https://trufflesuite.com/ganache/) for GUI.
3. `npx hardhat compile`
   - To compile the smart contract.
4. `npx hardhat test`
   - To run the tests in test/Lock.js.
5. `npx hardhat run scripts/deploy.js`
   - Deploy the smart contract to local network(with default network ganache), or to deploy onchain.

The contract was deploied and verified, and can be view on [Goerli etherscan](https://goerli.etherscan.io/address/0x566F297Da8936805493447cD462de72CD1cCF06f) with contract address: `0x566F297Da8936805493447cD462de72CD1cCF06f`.

## 3/22 Update

- After finishing the class, I realized that what I had done was significantly different from what the teacher had hoped for during the class. Therefore, I re-implemented Lock.sol and added an ERC20 token-TestCoin to test the contract.
- Despite the functions used by the teacher, I added a `balanceOf` function to query the remaining token amount of a certain token within the contract.

## 3/20 Update

- After interact with my contract Lock, finding out that I forgot to add some protection like transfer token can only less or equal to the maximum supply amount of token JHL, so anyone can transfer any amount of tokens to anyone haha.
- Same as the deposit function, forgot to add condition to prevent outsider to deposit, so anyone can withdraw not only the owner of the contract.

# Homework descriptions

## LAB3 Simple ERC20 Safe

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

- **Readings**
  - Deploy
    - [Alchemy docs: Hello-world-smart-contract](https://docs.alchemy.com/docs/hello-world-smart-contract)
    - [Hardhat docs: Deploying your contracts](https://hardhat.org/hardhat-runner/docs/guides/deploying)
  - Verify
    - [Alchemy docs: Submitting your Smart Contract to Etherscan](https://docs.alchemy.com/docs/submitting-your-smart-contract-to-etherscan)
    - [Hardhat docs: Verifying your contracts](https://hardhat.org/hardhat-runner/docs/guides/verifying)
- **Requirements**

  - Create a simple safe contract that allows everyone to store funds in the contract.
  - The contract should at least includes the following two functions:

    ```bash
    function deposit(address token, uint256 amount)

    function withdraw(address token, uint256 amount)
    ```

  - `deposit` is expected to take away users' funds as specified.
  - `withdraw` is expected to return users' funds as specified.
  - Construct **tests** with Hardhat (You will have to create your own ERC20)
  - **Deploy** the contract with Hardhat
  - **Verify** the contract with Hardhat on the testnet

- **Recommended libraries**
  - [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)
  - [Hardhat](https://github.com/NomicFoundation/hardhat)
- **Submission**
  - Please create a **private** GitHub repository and share it with **martinetlee** and **ryanycw**.
  - The repository should be named like: **[STUDENT_ID]-bdaf-lab[LAB_NUMBER]**
  - README.md should be present and it should clearly indicate how to run the code
