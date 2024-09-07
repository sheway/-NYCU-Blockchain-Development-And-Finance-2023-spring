require('dotenv').config();
const Decimal = require('decimal');
const hardhat = require("hardhat");
const ethers = require('ethers');
const router_abi = require('../artifacts/contracts/IPancakeRouter.sol/IPancakeRouter.json').abi;
const factory_abi = require('../artifacts/contracts/IPancakeFactory.sol/IPancakeFactory.json').abi;
const addresses = require('../address/bsc_mainnet.json');
const SwapTransaction = require('./class_transaction.js');
const Function = require('./class_function.js');
const swap_function_abi = [
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)',
]
var provider = "";
const connect_WSS = () => {
    process.stdout.write(`[${(new Date).toLocaleTimeString()}] Connecting via WebSocket...\n`);
    provider = new ethers.providers.WebSocketProvider(process.env.NETWORK_WSS);
    // provider = new ethers.providers.JsonRpcProvider(process.env.NETWORK_RPC);
    let network = provider.getNetwork()
    network.then(res => process.stdout.write(`[${(new Date).toLocaleTimeString()}] Connected to chain ID ${res.chainId}\n`));
}

var signer = "";
const connect_signer = () => {
    signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    process.stdout.write(`[${(new Date).toLocaleTimeString()}] Connected to signer ${signer.address}\n`);
}

var router_contract = "";
var factory_contract = "";
const connect_contracts = () => {
    router_contract = new ethers.Contract(addresses.PANCAKE_ROUTER, router_abi, provider);
    factory_contract = new ethers.Contract(addresses.PANCAKE_FACTORY, factory_abi, provider);
    process.stdout.write(`[${(new Date).toLocaleTimeString()}] Connected to router contract ${router_contract.address}\n`);
    process.stdout.write(`[${(new Date).toLocaleTimeString()}] Connected to factory contract ${factory_contract.address}\n`);
}

async function listen_pending_tx_with_target_function(target_function) {
    SwapTransaction.read_tokens_from_file(provider);
    provider.on("pending", async (txHash) => {
        if (txHash) {
            let pending_tx = await provider.getTransaction(txHash);
            // filter out pending transaction that has property to and data where to is pancake router and data is swapExactTokensForTokens
            if (pending_tx 
                && pending_tx.to && pending_tx.data
                && pending_tx.to.includes(router_contract.address) && pending_tx.data.includes(target_function.func_signature)) {
                console.log(`[${(new Date).toLocaleTimeString()}] pending_tx: ${txHash}`);
                const pending_swap_transaction = new SwapTransaction(pending_tx, target_function.iface);
                await pending_swap_transaction.initialize(signer, factory_contract);
                await pending_swap_transaction.calculate_slippage(router_contract);

            }
        }
    });
};


connect_WSS();
connect_signer();
connect_contracts();
listen_pending_tx_with_target_function(new Function(swap_function_abi));