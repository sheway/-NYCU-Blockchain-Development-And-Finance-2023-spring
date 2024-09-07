import json
import time
import requests
from datetime import datetime
from web3 import Web3
from web3.middleware import geth_poa_middleware
from get_abi import get_Contract
from swap import erc20_balance, approve_token_to_pancakeswap, swap
import os
from dotenv import load_dotenv
from view_block import start_tx_pool_monitoring
from decimal import Decimal
from token_collector import choose_token


if __name__ == '__main__':
    net = "testnet"
    file_path = "./" + net + "/tokens.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    bsc = data["bsc"]
    PANCAKE_ROUTER_ADDRESS = data["PANCAKE_ROUTER"]
    Token1 = "WBNB"
    Token1_Address = data[Token1]
    # Token2 = "USDT"
    # Token2_Address = data[Token2]

    w3 = Web3(Web3.HTTPProvider(bsc))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    load_dotenv()
    private_key = os.getenv("KEY")
    BSCSCAN_API_KEY = os.getenv("BSCSCAN_API_KEY")
    Wallet = os.getenv("ADDRESS")

    TOKEN1 = get_Contract(w3, Token1_Address, net)
    PANCAKE_CONTRACT = get_Contract(w3, PANCAKE_ROUTER_ADDRESS, net)
    Token2_Address = choose_token(w3, PANCAKE_CONTRACT, TOKEN1.address, 5, net)
    TOKEN2 = get_Contract(w3, Token2_Address, net)
    url = f'https://api.bscscan.com/api?module=account&action=balance&address={Wallet}&apikey={BSCSCAN_API_KEY}'
    print(TOKEN1.symbol, Token1_Address)
    print(TOKEN2.symbol, Token2_Address)

    #Loop Start
    #Approve PANCAKE_ROUTER
    # tx_hash = approve_token_to_pancakeswap(w3, TOKEN1, PANCAKE_CONTRACT, Wallet, private_key)
    # print(f"approve {TOKEN1.symbol} tx:", tx_hash)
    print(f"approve {TOKEN1.symbol} tx: 0xd5a628f1fe9e49c8878c523cf1321f1e8b0955600bfc5a6a02e04b165a3de1fb")
    # time.sleep(5)
    tx_hash = approve_token_to_pancakeswap(w3, TOKEN2, PANCAKE_CONTRACT, Wallet, private_key)
    print(f"approve {TOKEN2.symbol} tx:", tx_hash)

    Front_bnb_balance = requests.get(url).json()['result']
    print(f"BNB front balance: {int(Front_bnb_balance) / 10**18}")
    Front_CONTRACT1_balance = erc20_balance(TOKEN1, Wallet)
    print(f"{TOKEN1.symbol} Balance: {Front_CONTRACT1_balance}")
    Front_CONTRACT2_balance = erc20_balance(TOKEN2, Wallet)
    print(f"{TOKEN2.symbol} Balance: {Front_CONTRACT2_balance}")

    #Start Monitering
    cur_time = datetime.now().strftime("%M")
    print(f"Start Monitering at {cur_time}")
    sandwitch_tx, sandwitch_data = start_tx_pool_monitoring(w3, TOKEN1, TOKEN2, PANCAKE_CONTRACT)
    print("Find tx: ", sandwitch_tx.hash.hex())
    print("sandwitch_data", sandwitch_data)

    Percentage = 0.5
    nonce = w3.eth.get_transaction_count(Wallet)
    print("---------------------Sandwitch start at block: {0}---------------------".format(sandwitch_tx['blockNumber']))

    # Sandwitch front
    price = sandwitch_data['amountOutMin'] / sandwitch_data['amountIn']
    print("{0}/{1}: {2}".format(TOKEN1.symbol, TOKEN2.symbol, price))
    pending_balance = Front_CONTRACT1_balance * Decimal(Percentage)
    pending_balance = int(pending_balance * Decimal(10 ** TOKEN1.decimals))
    pending_balance_min = int(pending_balance * price)
    print("pending_balance: ", pending_balance)
    print("pending_balance_min: ", pending_balance_min)
    print("Origional Gas price: ", sandwitch_tx['gasPrice'])
    print("Gas price: ", int(int(sandwitch_tx['gasPrice']) * 1.5))
    print("Nonce: ", nonce)

    tx_hash_front = swap(w3, PANCAKE_CONTRACT, pending_balance, pending_balance_min, sandwitch_data['path'],
                         sandwitch_data['deadline'], int(int(sandwitch_tx['gasPrice']) * 1.5), nonce, Wallet, private_key)
    print("Sandwitch front tx_hash", tx_hash_front)

    rev_path = sandwitch_data['path']
    rev_path.reverse()
    # Sandwitch back
    tx_hash_back = swap(w3, PANCAKE_CONTRACT, pending_balance_min, pending_balance,
                        rev_path, sandwitch_data['deadline'],
                        int(int(sandwitch_tx['gasPrice'])), nonce+1, Wallet, private_key)
    print("Sandwitch back tx_hash", tx_hash_back)


    time.sleep(5)
    Back_bnb_balance = requests.get(url).json()['result']
    Back_CONTRACT1_balance = erc20_balance(TOKEN1, Wallet)
    print("{0} Balance: {1}".format(TOKEN1.symbol, Front_CONTRACT1_balance))
    print("BNB Decrease Amount: ", Front_bnb_balance - Back_bnb_balance)
    print("{0} Decrease Amount: {1}".format(Front_CONTRACT1_balance - Back_CONTRACT1_balance))
    print("-----------------------------Sandwitch end-----------------------------")


