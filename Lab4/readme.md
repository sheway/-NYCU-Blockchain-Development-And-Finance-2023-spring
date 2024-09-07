# 311581041-bdaf-lab4

Run the codes to start the smart contract:

1. `npm install`
   - To install the require package of this contract.
2. `npx hardhat node`
   - Start local node server for ethereum, or install [Ganache](https://trufflesuite.com/ganache/) for GUI.
3. `npx hardhat test`
   - To run the tests in test folder.

There are totally 22 tests in test folder to test four contract.

## Hardhat Coverage report
![image](https://user-images.githubusercontent.com/67420772/229427051-5a684948-f7c5-436c-b9ab-6ff6d63a4713.png)

## Hardhat Gas report
![image](https://user-images.githubusercontent.com/67420772/229427115-68d6fcf1-60c6-4011-8aeb-867b6c214e2a.png)


# Homework descriptions
## Lab4: Proxies, Proxies everywhere

**Due: 23:59 on Mon, April, 3, 2023 for students already in the class**

---

We’ll be practicing the Proxy pattern and Factory pattern in this lab. 

Assuming you have your contract Safe from Lab3.

## Useful Resource

- [https://github.com/dragonfly-xyz/useful-solidity-patterns/tree/main/patterns/basic-proxies](https://github.com/dragonfly-xyz/useful-solidity-patterns/tree/main/patterns/basic-proxies)
- [https://github.com/dragonfly-xyz/useful-solidity-patterns/tree/main/patterns/initializing-upgradeable-contracts](https://github.com/dragonfly-xyz/useful-solidity-patterns/tree/main/patterns/initializing-upgradeable-contracts)

## Modify the Safe contract

- The contract should have an owner.
- The contract now takes a 0.1% tax. That means, if an address deposited 1000 ATokens, the address can only withdraw 999 ATokens. The remaining 1 AToken will be kept in the contract and ready to be withdrawn by the owner.
- Implement a `function takeFee(address token)` and only the owner of the contract can call it. The owner should get the token fees that are accumulated in the contract.

## Write 3 contracts:

- A **SafeUpgradeable** implementation contract, but **in Proxy pattern**.
    - Constructor needs to become a separate callable function.
- A **proxy contract** ([ref](https://fravoll.github.io/solidity-patterns/proxy_delegate.html)1, [ref](https://solidity-by-example.org/app/upgradeable-proxy/)2) with a few important specifications:
    - Use unstructured storage to store “owner” and “implementation”. As in [here](https://blog.openzeppelin.com/upgradeability-using-unstructured-storage/)
    - The “owner” should be able to update the implementation of the proxy.
- A **SafeFactory contract**: a factory that deploys proxies that point to the **SafeUpgradeable** implementation.
    - Stores the address of the Safe Implementation in a storage.
    - `function updateImplementation(address newImp) external`
        - The Safe implementation address can only be updated by the owner of the Factory contract.
    - `function deploySafeProxy() external`
        - Deploys a proxy, points the proxy to the current Safe Implementation. Initializes the proxy so that the message sender is the owner of the new Safe.
    - `function deploySafe() external`
        - Deploys the original Safe contract. Note that you might need to modify the Safe contract so that the original caller of the `deploySafe` contract will be the owner of the deployed "Safe” contract.

## Write tests

- Make sure the tax calculations are done correctly in the modified Safe contract.
- the tests should indicate that the system works as intended. E.g.
    - the caller of deploySafe is the owner of the deployed Safe contract
    - the caller of deploySafeProxy is the owner of the deployed Proxy.
    - After `updateImplementation` is being called, a newly deployed proxy with `deploySafeProxy()` points to the new implementation instead of the old one.

## Assessment

- Use Solidity Test Coverage to see how well covered is your tests (Note that high coverage does not necessarily mean high quality tests)
    - [https://www.npmjs.com/package/solidity-coverage](https://www.npmjs.com/package/solidity-coverage)
- Use Hardhat gas reporter to assess the gas of `deploySafeProxy()` and `deploySafe()`.
    - [https://www.npmjs.com/package/hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter)

## Requirements

- Display the result of coverage and gas report in the README of the repository
- **Submission**
    - Please create a **private** GitHub repository and share it with **martinetlee** and **ryanycw**.
    - The repository should be named like: **[STUDENT_ID]-bdaf-lab[LAB_NUMBER]**
    - README.md should be present and it should clearly indicate how to run the code
    - Submit the link of the repository: [https://forms.gle/mgGeUwNLRWgiz43VA](https://forms.gle/mgGeUwNLRWgiz43VA)
