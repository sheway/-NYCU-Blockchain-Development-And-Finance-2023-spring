# 311581041-bdaf-lab2

## Hardware and Environment
- OS: Windows 11 Professional Edition 21H2
- CPU: AMD Ryzen 5 5600X CPU @ 3.70GHz
- Memory: 16GB
- Development Tool: Visual Studio Code v1.75.1
- Programming Language: Node.js v18.14.1
- Packages: 
    - bip39: v3.0.4
    - ethereumjs-util: v7.1.5
    - hdkey: v2.1.0

## Instruction
After moving to the current directory...
1. 	`npm install` 
    - To install package with corrusponding version.
2.	`node 311581041_lab2.js 5678`
    - To execute the code, where the string after .js is the prefix of public key, or the preset prefix is '2345'.

The program will output corresponding Prefix, Mnemonic, Public Key, Address and the number of regenerations.



![311581041_lab2_p1](https://user-images.githubusercontent.com/67420772/220979779-42dfac90-2b2a-4b24-8e5a-4fa653b2469a.png)
![311581041_lab2_p2](https://user-images.githubusercontent.com/67420772/220979787-36ed24f8-4768-4f84-b14b-dd96922b85de.png)

# Homework description
## Lab2: Vanity Address Generator

**Due: 23:59 on Mon, March, 6, 2023 for students already in the class**

**Submission**: Through Google form shared in the Discord

---

There are three parts to this Lab. 

---

### **Non technical assignment:**

- Upload your CV/resume as part of the assignment so that I can get to know you better.

---

### **Operational assignment:**

- **Create a wallet**
    - Download Metamask
    - Follow the instructions to create an address
    - Get familiar with the interface - especially on **how to change network to testnet goerli**
- **Interacting with a contract, getting your course NFT**
    - Obtain Goerli testnet Ether 0.5 ETH by using one of the faucets:
        - [https://goerlifaucet.com/](https://goerlifaucet.com/) Need an alchemy account
        - [https://faucet.quicknode.com/ethereum/goerli](https://faucet.quicknode.com/ethereum/goerli)
        - [https://goerli-faucet.pk910.de/](https://goerli-faucet.pk910.de/) PoW - mine your own testnet Ether
    - Head to Goerli etherscan: [https://goerli.etherscan.io/](https://goerli.etherscan.io/)
    - Visit the contract:
        - go to the contract: `0x9AD3074E915EE8713A527EF371b54FcA88531822`
        - Get familiar with the interface
        - Find the appropriate function and interact with it
        - You should be getting an NFT with the address: `0x342c6D48CDE8808F04dC59c5992F9a3E12479767`

---

### Technical assignment - Vanity address generator:

- **Read**
    - [HDWallet](https://en.bitcoin.it/wiki/Deterministic_wallet#Type_2:_Hierarchical_deterministic_wallet) (****Hierarchical deterministic wallet)****
    - BIP-39
        - [https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
        - [https://iancoleman.io/bip39/](https://iancoleman.io/bip39/)
- **Ethereum Address format:**
    - Ethereum also implements BIP-39
- **Requirements**
    - Input a string `_pre`, output a mnemonic that would create a public key with `_pre` being its prefix. e.g. input “1234”, output a mnemonic that has a public key with `0x1234.....567`
    - One should obtain the exact public key by inputing the generated mnemonic into Metamask.
        - Alternatively, this can be checked with other tools such as `hardhat` or `truffle` (input mnemonic and they will provide the available public keys)
    - For HDWallet path, use `m/44’/60’/0’/0/`
    - Use **Javascript/NodeJS** to implement
- **Recommended libraries**
    - https://github.com/bitcoinjs/bip39
    - [https://github.com/ethereumjs/ethereumjs-wallet](https://github.com/ethereumjs/ethereumjs-wallet)  (hdkey)
- **How to**
    - The general flow of generating a wallet should be:
        - Input target prefix
        - Obtain entropy
        - Convert entropy to seed
        - Use seed to obtain hdwallet
    - The flow to obtain a vanity address would be repeating the above until you find an address that matches the prefix.
