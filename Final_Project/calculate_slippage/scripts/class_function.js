const ethers = require('ethers');

class Function {
    constructor(function_abi){
        const function_name_regex = /function\s+(\w+)\(/;
        this.function_name = function_name_regex.exec(function_abi)[1];
        this.iface = new ethers.utils.Interface(function_abi);
        this.func_signature = this.iface.getSighash(this.function_name);
    }
}

module.exports = Function;