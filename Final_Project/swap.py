from decimal import Decimal


def get_price(CONTRACT1, CONTRACT2, PANCAKE_CONTRACT):
    price = PANCAKE_CONTRACT.contract.functions.getAmountsOut(
        1 * 10 ** CONTRACT1.decimals,
        [CONTRACT1.address, CONTRACT2.address]
    ).call()[1] / 10 ** CONTRACT2.decimals
    return Decimal(price)


def erc20_balance(CONTRACT, Wallet):
    balance = CONTRACT.contract.functions.balanceOf(Wallet).call()
    balance = Decimal(balance) / (10 ** CONTRACT.decimals)
    return balance


def approve_token_to_pancakeswap(w3, CONTRACT1, PANCAKE_CONTRACT, Wallet, private_key):
    tx = CONTRACT1.contract.functions.approve(PANCAKE_CONTRACT.address, 2**256 - 1).build_transaction({  #approve maximum
        "chainId": w3.eth.chain_id,
        "from": Wallet,
        "nonce": w3.eth.get_transaction_count(Wallet),
        "gasPrice": w3.eth.gas_price
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    tx_hash = w3.to_hex(tx_hash)
    return tx_hash


def swap(w3, PANCAKE_CONTRACT, pending_balance, pending_balance_min, route, deadline, gasPrice, nonce, Wallet, private_key):
    tx = PANCAKE_CONTRACT.contract.functions.swapExactTokensForTokens(pending_balance, pending_balance_min, route, Wallet, deadline).build_transaction({
        "chainId": w3.eth.chain_id,
        "from": Wallet,
        "nonce": nonce,
        "gasPrice": gasPrice
    })
    signed_tx = w3.eth.account.sign_transaction(tx, private_key)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.rawTransaction)
    return w3.to_hex(tx_hash)
