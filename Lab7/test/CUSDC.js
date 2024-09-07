const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("CUSDC", function () {
    let Alice;
    let Bob;
    let usdcContract;
    let wethContract;
    let cusdcContract;
    let usdcMantissa;
    let ethMantissa;

    before(async function () {
        [signer, Alice, Bob] = await ethers.getSigners(); //獲取部署合約的帳號
        const usdc_whale_address = "0x7713974908Be4BEd47172370115e8b1219F4A5f0";  //whale address with lots of usdc
        const usdcWhale = await ethers.provider.getSigner(usdc_whale_address);
        let usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
        let wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
        let cusdcProxyAaddress = "0xc3d688B66703497DAA19211EEdff47f25384cdc3";
        usdcMantissa = 1e6; // USDC have 6 decimal places
        ethMantissa = 1e18; // ETH and WETH have 18 decimal places
        let cusdcProxyAbi = [
            'event Supply(address indexed from, address indexed dst, uint256 amount)',
            'function supply(address asset, uint amount)',
            'function withdraw(address asset, uint amount)',
            'function balanceOf(address account) returns (uint256)',
        ];
        await hre.network.provider.request({  //Impersonate usdc whale
            method: "hardhat_impersonateAccount",
            params: [usdc_whale_address]
        });

        usdcContract = await ethers.getContractAt("IERC20", usdcAddress);  //get usdc contract
        wethContract = await ethers.getContractAt("IERC20", wethAddress);  //get weth contract
        
        await usdcContract.connect(usdcWhale).transfer(Alice.address, ethers.utils.parseUnits("10000", 6));  //whale transfer 1000 usdc to Alice
      
        cusdcContract = new ethers.Contract(cusdcProxyAaddress, cusdcProxyAbi, signer);  //get cusdc contract
        let cusdcBalance = await usdcContract.balanceOf(cusdcContract.address);
        console.log("the USDC balance in the Compound USDC contract:", cusdcBalance.toString()/usdcMantissa);  //print cusdc contract usdc balance
    });

    describe("before", function () {  //test if init value is correct
        it("weth whales should transfer lots of weth to Bob", async function () {
            const weth_whale_address1 = "0x741AA7CFB2c7bF2A1E7D4dA2e3Df6a56cA4131F3";  //whale address1 with lots of weth
            const weth_whale_address2 = "0x2fEb1512183545f48f6b9C5b4EbfCaF49CfCa6F3";  //whale address2 with lots of weth
            const weth_whale_address3 = "0x6B44ba0a126a2A1a8aa6cD1AdeeD002e141Bcd44";  //whale address3 with lots of weth
            const weth_whale_address4 = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";  //whale address4 with lots of weth
            const wethcWhale1 = await ethers.provider.getSigner(weth_whale_address1);  //whale address1 getSigner
            const wethcWhale2 = await ethers.provider.getSigner(weth_whale_address2);  //whale address2 getSigner
            const wethcWhale3 = await ethers.provider.getSigner(weth_whale_address3);  //whale address3 getSigner
            const wethcWhale4 = await ethers.provider.getSigner(weth_whale_address4);  //whale address4 getSigner
            await hre.network.provider.request({  //Impersonate weth whale1
                method: "hardhat_impersonateAccount",
                params: [weth_whale_address1]
            });
            await hre.network.provider.request({  //Impersonate weth whale2
                method: "hardhat_impersonateAccount",
                params: [weth_whale_address2]
            });
            await hre.network.provider.request({  //Impersonate weth whale3
                method: "hardhat_impersonateAccount",
                params: [weth_whale_address3]
            });
            await hre.network.provider.request({  //Impersonate weth whale4
                method: "hardhat_impersonateAccount",
                params: [weth_whale_address4]
            });
            await wethContract.connect(wethcWhale1).transfer(Bob.address, ethers.utils.parseUnits("23364", 18));  //whale transfer all weth to Bob
            await wethContract.connect(wethcWhale2).transfer(Bob.address, ethers.utils.parseUnits("13813", 18));
            await wethContract.connect(wethcWhale3).transfer(Bob.address, ethers.utils.parseUnits("12077", 18));
            await wethContract.connect(wethcWhale4).transfer(Bob.address, ethers.utils.parseUnits("14850", 18));
        });
        it("should check Alice's USDC balance is equal to 10000 USDC", async function () {  //check Alice got enough assets
            let AliceBalance = await usdcContract.balanceOf(Alice.address);
            expect(AliceBalance).to.equal(ethers.utils.parseUnits("10000", 6));
        });
        it("should check Bob's ETH balance is equal to 64104 WETH", async function () {  //check Bob got enough assets
            let BobWETHBalance = await wethContract.balanceOf(Bob.address);
            expect(BobWETHBalance).to.equal(ethers.utils.parseUnits("64104", 18));
        });
    });

    describe("Alice provide liquidity", function () {
        it("should check Alice's USDC is supplied into Compound USDC", async function () {
            await usdcContract.connect(Alice).approve(cusdcContract.address, ethers.utils.parseUnits("1000", 6));  //Alice approve cusdcContract with 10000 usdc
            await cusdcContract.connect(Alice).supply(usdcContract.address, ethers.utils.parseUnits("1000", 6));  //Alice supply cusdcContract with 10000 usdc

            let AliceBalance = await usdcContract.balanceOf(Alice.address);
            expect(AliceBalance).to.equal(ethers.utils.parseUnits("9000", 6));  //check Alice's asset decrease
            
            cusdcProxUSDCHBalance = await usdcContract.balanceOf(cusdcContract.address);  //check CUSDC's usdc asset increase
            console.log("the USDC balance in the Compound USDC contract:", cusdcProxUSDCHBalance.toString()/usdcMantissa);
        });
    });

    describe("Bob withdraw all USDC from Compound USDC", function () {  //test if init value is correct
        it("Bob supply weth into CUSDC, and withdraw almost all USDC in CUSDC", async function () {
            let cusdcContractWETHBalance = await wethContract.balanceOf(cusdcContract.address);

            await wethContract.connect(Bob).approve(cusdcContract.address, ethers.utils.parseUnits("64103", 18));  //Bob approve cusdcContract with 64103 weth
            await cusdcContract.connect(Bob).supply(wethContract.address, ethers.utils.parseUnits("64103", 18));  //Bob supply cusdcContract with 64103 weth

            let BobBalance = await wethContract.balanceOf(Bob.address);
            expect(BobBalance).to.equal(ethers.utils.parseUnits("1", 18));  //check Bob's asset decrease
            
            cusdcContractWETHBalance = await wethContract.balanceOf(cusdcContract.address);  //check CUSDC's weth asset increase

            let tx = await cusdcContract.connect(Bob).withdraw(usdcContract.address, ethers.utils.parseUnits("46964238", 6).toString());  //Bob lend all usdc in cusdc contract
            cusdcProxUSDCHBalance = await usdcContract.balanceOf(cusdcContract.address);
            console.log("the USDC balance in the Compound USDC contract:", cusdcProxUSDCHBalance.toString()/usdcMantissa);
        });
    });

    describe("Alice try to withdraw", function () {  //test if init value is correct
        it("should let Alice withdraw her assets", async function () {
            let tx = await cusdcContract.connect(Alice).withdraw(usdcContract.address, ethers.utils.parseUnits("1000", 6).toString());
            console.log(tx);
        });
    });
});
