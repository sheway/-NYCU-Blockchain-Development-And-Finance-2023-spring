import requests
from dotenv import load_dotenv
import os
import json


class Contract:
    def __init__(self, symbol, address, abi, contract, decimals: int = None):
        self.symbol = symbol  # unimportant, only show
        self.address = address
        self.decimals = decimals
        self.abi = abi
        self.contract = contract


def get_abi(ADDRESS, net):
    file_path = "./" + net + "/abi.json"
    # 检查文件是否存在
    if os.path.exists(file_path) and os.stat(file_path).st_size > 0:
        # 读取 abi.json 文件内容
        with open(file_path, "r") as file:
            data = json.load(file)
    else:
        # 如果文件不存在或为空，创建一个空的数据字典
        data = {}
    try:
        abi = data[ADDRESS]
    except:
        if net == "mainnet":
            load_dotenv()
            API_KEY = os.getenv("BSCSCAN_API_KEY")
            url_1 = f"https://api.bscscan.com/api?module=contract&action=getabi&address="
            url_2 = f"&apikey={API_KEY}"
            url = url_1 + ADDRESS + url_2
        elif net == "testnet":
            url = "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=" + ADDRESS
        abi = requests.get(url).json()['result']
        if abi != "Contract source code not verified":
            print("get abi:", abi)
            new_data = {
                ADDRESS: abi
            }
            data.update(new_data)

        # 将整个数据重新写入 abi.json 文件
        with open(file_path, "w") as file:
            json.dump(data, file)
        file.close()
    return abi


def get_Contract(w3, Address, net):
    Address = w3.to_checksum_address(Address)
    abi = get_abi(Address, net)
    Address_contract = w3.eth.contract(address=Address, abi=abi)
    try:
        decimal = Address_contract.functions.decimals().call()
    except:
        decimal = None
    try:
        Token_name = Address_contract.functions._symbol().call()
    except:
        try:
            Token_name = Address_contract.functions.symbol().call()
        except:
            Token_name = ""
    CONTRACT = Contract(Token_name, Address, abi, Address_contract, decimal)
    return CONTRACT
import requests
from dotenv import load_dotenv
import os
import json


class Contract:
    def __init__(self, symbol, address, abi, contract, decimals: int = None):
        self.symbol = symbol  # unimportant, only show
        self.address = address
        self.decimals = decimals
        self.abi = abi
        self.contract = contract


def get_abi(ADDRESS, net):
    file_path = "./" + net + "/abi.json"
    # 检查文件是否存在
    if os.path.exists(file_path) and os.stat(file_path).st_size > 0:
        # 读取 abi.json 文件内容
        with open(file_path, "r") as file:
            data = json.load(file)
    else:
        # 如果文件不存在或为空，创建一个空的数据字典
        data = {}
    try:
        abi = data[ADDRESS]
    except:
        if net == "mainnet":
            load_dotenv()
            API_KEY = os.getenv("BSCSCAN_API_KEY")
            url_1 = f"https://api.bscscan.com/api?module=contract&action=getabi&address="
            url_2 = f"&apikey={API_KEY}"
            url = url_1 + ADDRESS + url_2
        elif net == "testnet":
            url = "https://api-testnet.bscscan.com/api?module=contract&action=getabi&address=" + ADDRESS
        abi = requests.get(url).json()['result']
        if abi != "Contract source code not verified":
            print("get abi:", abi)
            new_data = {
                ADDRESS: abi
            }
            data.update(new_data)

        # 将整个数据重新写入 abi.json 文件
        with open(file_path, "w") as file:
            json.dump(data, file)
        file.close()
    return abi


def get_Contract(w3, Address, net):
    Address = w3.to_checksum_address(Address)
    abi = get_abi(Address, net)
    Address_contract = w3.eth.contract(address=Address, abi=abi)
    try:
        decimal = Address_contract.functions.decimals().call()
    except:
        decimal = None
    try:
        Token_name = Address_contract.functions._symbol().call()
    except:
        try:
            Token_name = Address_contract.functions.symbol().call()
        except:
            Token_name = ""
    CONTRACT = Contract(Token_name, Address, abi, Address_contract, decimal)
    return CONTRACT
