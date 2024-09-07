import time


def handle_pending_txs(w3, tx):
    print(f'Pending Transaction: {tx.hash.hex()}')
    print(f'From: {tx["from"]}')
    print(f'To: {tx["to"]}')
    print(f'Gas: {tx["gas"]}')
    print(f'Gas fee: {tx["gasPrice"]}')

    value_in_wei = tx["value"]
    value_in_bnb = value_in_wei / 10**18
    print(f'Value: {value_in_bnb} BNB')
    print('-----------------------------')


def start_tx_pool_monitoring(w3, TOKEN1, TOKEN2, PANCAKE_CONTRACT):
    while True:
        pending_txns = w3.eth.get_block(block_identifier='pending', full_transactions=True)
        for tx in pending_txns.transactions:
            if tx['to'] == PANCAKE_CONTRACT.address and tx['input'][0:10] == "0x38ed1739":
                decoded_input = PANCAKE_CONTRACT.contract.decode_function_input(tx['input'])

                if decoded_input[1]['path'][0] == TOKEN1.address and decoded_input[1]['path'][-1] == TOKEN2.address:
                    return tx, decoded_input[1]
        # time.sleep(0.05)
