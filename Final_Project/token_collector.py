import json
import time
import operator
from datetime import datetime
from web3 import Web3
from web3.middleware import geth_poa_middleware
from get_abi import get_Contract, get_abi


def choose_token(w3, PANCAKE_CONTRACT, TOKEN1_address, min, net):
    cur_time = datetime.now().strftime("%M")
    print(f"current min is {cur_time}")
    dict = {}
    while int(datetime.now().strftime("%M")) - int(cur_time) < min:
        blockNumber = w3.eth.get_block_number()
        print("blockNumber: ", blockNumber)
        txns = w3.eth.get_block(block_identifier=blockNumber, full_transactions=True).transactions
        for tx in txns:
            if tx["to"] == PANCAKE_CONTRACT.address and tx['input'][0:10] == "0x38ed1739":
                decoded_input = PANCAKE_CONTRACT.contract.decode_function_input(tx['input'])
                if decoded_input[1]['path'][0] != TOKEN1_address:
                    break
                try:
                    i = w3.to_checksum_address(decoded_input[1]['path'][-1])
                    Contract = get_Contract(w3, i, net)
                    if Contract.decimals is None or Contract.symbol == "":
                        print("Address:", Contract.address, "is not a brc-20.")
                        break
                    elif Contract.decimals < 9:
                        print("Address:", Contract.address, "may be shit.")
                        break
                    else:
                        try:
                            dict[Contract.address] += 1
                        except KeyError:
                            dict[Contract.address] = 1
                except Exception as e:
                    print('-----------------------------')
                    print(e)
                    print(tx)
                    print(f'Pending Transaction: {tx.hash.hex()}')
                    print(f'From: {tx["from"]}')
                    print(f'To: {tx["to"]}')
                    value_in_wei = tx["value"]
                    value_in_bnb = value_in_wei / 10 ** 18
                    print(f'Value: {value_in_bnb} BNB')
                    decoded_input = PANCAKE_CONTRACT.contract.decode_function_input(tx['input'])
                    print(decoded_input)
                    print('-----------------------------')
        time.sleep(3)
        try:
            print(max(dict, key=lambda key: dict[key]), dict[max(dict, key=lambda key: dict[key])])
        except:
            print("No token yet")
    dict = sorted(dict.items(), key=lambda x: x[1], reverse=True)
    return dict[0][0]


def collect_token(w3, PANCAKE_CONTRACT, data):
    cur_time = datetime.now().strftime("%M")
    while int(datetime.now().strftime("%M")) - int(cur_time) < 5:
        blockNumber = w3.eth.get_block_number()
        txns = w3.eth.get_block(block_identifier=blockNumber, full_transactions=True).transactions
        for tx in txns:
            if tx["to"] == PANCAKE_CONTRACT.address and tx['input'][0:10] == "0x38ed1739":
                decoded_input = PANCAKE_CONTRACT.contract.decode_function_input(tx['input'])
                try:
                    for i in decoded_input[1]['path']:
                        i = w3.to_checksum_address(i)
                        Contract = get_Contract(w3, i, net)
                        if Contract.decimals is None or Contract.symbol == "":
                            print("Address:", Contract.address, "is not a brc-20.")
                            break
                        elif Contract.decimals < 9:
                            print("Address:", Contract.address, "may be shit.")
                            break
                        else:
                            try:
                                data[Contract.symbol]
                            except KeyError:
                                print("Find tx: ", tx.hash.hex())
                                print("New Token detected, {0}:{1}".format(Contract.symbol, i))
                                new_data = {
                                    Contract.symbol: i
                                }
                                data.update(new_data)
                                with open(file_path, "w") as temp:
                                    json.dump(data, temp)
                                temp.close()
                except Exception as e:
                    print('-----------------------------')
                    print(e)
                    print(tx)
                    print(f'Pending Transaction: {tx.hash.hex()}')
                    print(f'From: {tx["from"]}')
                    print(f'To: {tx["to"]}')
                    value_in_wei = tx["value"]
                    value_in_bnb = value_in_wei / 10 ** 18
                    print(f'Value: {value_in_bnb} BNB')
                    decoded_input = PANCAKE_CONTRACT.contract.decode_function_input(tx['input'])
                    print(decoded_input)
                    print('-----------------------------')
        time.sleep(5)


if __name__ == '__main__':
    net = "mainnet"
    file_path = "./" + net + "/tokens.json"
    with open(file_path, "r") as file:
        data = json.load(file)

    bsc = data["bsc"]
    PANCAKE_ROUTER_ADDRESS = data["PANCAKE_ROUTER"]
    Token1 = "WBNB"
    Token1_Address = data[Token1]

    w3 = Web3(Web3.HTTPProvider(bsc))
    w3.middleware_onion.inject(geth_poa_middleware, layer=0)
    PANCAKE_CONTRACT = get_Contract(w3, PANCAKE_ROUTER_ADDRESS, net)

    # collect_token(w3, PANCAKE_CONTRACT, data)
    # for symbol in data:
    #     if symbol != "bsc":
    #         print(symbol, data[symbol])
    #         get_abi(data[symbol], net)
    choose_token(w3, PANCAKE_CONTRACT, Token1_Address, 3, net)


