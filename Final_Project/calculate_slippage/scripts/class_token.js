const ethers = require('ethers');
const ierc20_abi = require('../artifacts/contracts/IERC20.sol/IERC20.json').abi;

class Token {
    constructor(provider, token_address) {
        this.contract = new ethers.Contract(token_address, ierc20_abi, provider);
        this.decimals = null;
        this.symbol = null;
        this.address = null;
    }

    async initialize() {
        this.decimals = await this.contract.callStatic.decimals();
        this.symbol = await this.contract.callStatic.symbol();
        this.address = this.contract.address;
        process.stdout.write(`[${(new Date).toLocaleTimeString()}] ${this.symbol} (${this.address})\n`);
    }
}

module.exports = Token;