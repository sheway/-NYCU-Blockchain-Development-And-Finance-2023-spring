// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract Proxy {
    // 用 keccak256 計算並儲存 owner 和 implementation 的位置
    bytes32 private constant ownerPosition = keccak256("org.zeppelinos.proxy.owner"); 
    bytes32 private constant implementationPosition = keccak256("org.zeppelinos.proxy.implementation");

    // 在建構子中初始化 implementation 和 owner
    constructor(address _implementation, address _caller) {
        setImplementation(_implementation);
        setOwner(_caller);
    }

    // 接收外部合約的 fallback 函數，並調用 _delegateCall 函數
    fallback() external payable {
        _delegateCall();
    }

    // 接收以太幣的 fallback 函數，並調用 _delegateCall 函數
    receive() external payable {
        _delegateCall();
    }

    // 通過代理合約調用實現合約
    function _delegateCall() private returns (bytes memory) {
        address _impl = get_impl_addr();
        require(_impl != address(0), "Implementation not set");
        assembly {  
            // 複製 calldata
            calldatacopy(0, 0, calldatasize())
            // 代理調用 implementation 的函數
            let result := delegatecall(gas(), _impl, 0, calldatasize(), 0, 0)
            // 複製回傳資料
            returndatacopy(0, 0, returndatasize())
            switch result
            // delegatecall returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    //will return current implement contract address
    function get_impl_addr() public view returns(address impl) {   
        bytes32 position = implementationPosition;   
        assembly {
            impl := sload(position)
        }
    }

    //will return proxy owner address
    function proxyOwner() public view returns(address ownewr) {   
        bytes32 position = ownerPosition;   
        assembly {
            ownewr := sload(position)
        }
        return ownewr;
    }

    //init or update contract address
    function setImplementation(address newImplementation) private {   
        bytes32 position = implementationPosition;   
        assembly {
            sstore(position, newImplementation)
        } 
    } 

    //init proxy owner
    function setOwner(address _owner) private {   
        bytes32 position = ownerPosition;   
        assembly {
            sstore(position, _owner)
        } 
    } 
}
