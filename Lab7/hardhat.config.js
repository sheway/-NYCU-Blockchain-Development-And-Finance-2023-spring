require('dotenv').config();
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");

const {GEORLI_API_URL, ETHER_API_URL, GOERLI_PRIVATE_KEY, ETHERSCAN_API_KEY} = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
        url: ETHER_API_URL,
        blockNumber: 17228670
      }
    },
    ganache:{
      url:'http://127.0.0.1:8545',
    },
    goerli:{
      url: GEORLI_API_URL,
      accounts:[`0x${GOERLI_PRIVATE_KEY}`]
    }
  },
  etherscan:{
    apiKey:ETHERSCAN_API_KEY,
  }
};
