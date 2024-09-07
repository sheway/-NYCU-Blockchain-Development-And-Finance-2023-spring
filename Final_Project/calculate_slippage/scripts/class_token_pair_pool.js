const Decimal = require('decimal');
const ethers = require('ethers');
const pair_abi = require('../artifacts/contracts/IPancakePair.sol/IPancakePair.json').abi;

class TokenPairPool {
    constructor() {
        this.token1 = null;
        this.token2 = null;
        this.pair_address = null;
        this.contract = null;
        this.token1_reserve = null;
        this.token2_reserve = null;
        this.token1_reserve_before_div_by_decimals = null;
        this.token2_reserve_before_div_by_decimals = null;
        this.price = null;
        this.k = null;
    }

    async initialize(provider, factory_contract, token1, token2) {
        this.token1 = token1;
        this.token2 = token2;
        this.pair_address = await factory_contract.callStatic.getPair(this.token1.address, this.token2.address);
        this.contract = new ethers.Contract(this.pair_address, pair_abi, provider);
        const reserve = await this.contract.callStatic.getReserves();
        this.token1_reserve_before_div_by_decimals = reserve[0];
        this.token2_reserve_before_div_by_decimals = reserve[1];
        this.token1_reserve = new Decimal(this.token1_reserve_before_div_by_decimals / (10**this.token1.decimals));
        this.token2_reserve = new Decimal(this.token2_reserve_before_div_by_decimals / (10**this.token2.decimals));
        this.price = (this.token2_reserve) / (this.token1_reserve);
        this.k = this.token1_reserve * this.token2_reserve;
        process.stdout.write(`[${(new Date).toLocaleTimeString()}] ${this.token2.symbol} / ${this.token1.symbol}'s decimals: ${this.token2.decimals} / ${this.token1.decimals}\n`);
        process.stdout.write(`[${(new Date).toLocaleTimeString()}]  ${this.token2.symbol} / ${this.token1.symbol}'s reserve: ${this.token2_reserve} / ${this.token1_reserve}, 1 ${this.token1.symbol} -> ${this.price} ${this.token2.symbol}\n`);
    }
}

module.exports = TokenPairPool;