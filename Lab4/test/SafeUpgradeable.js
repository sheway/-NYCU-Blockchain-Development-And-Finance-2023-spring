const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeUpgradeable", function () {
    let safeUpgradeable;
    let tcoin;
    let owner;
    let wallet1;
    let wallet2;

    beforeEach(async function () {
        [owner, wallet1, wallet2] = await ethers.getSigners(); //獲取部署合約的帳號
        SafeUpgradeable = await ethers.getContractFactory("SafeUpgradeable", owner);
        TestCoin = await ethers.getContractFactory("TestCoin", wallet1);  //ERC20 Token
        safeUpgradeable = await SafeUpgradeable.deploy();
        tcoin = await TestCoin.deploy();
        await safeUpgradeable.connect(owner).initialize();

        tcoin.connect(wallet1).transfer(wallet2.address, ethers.utils.parseEther("100"))  //default: wallet1: 5000, wallet2: 0
        
        await tcoin.connect(wallet1).approve(safeUpgradeable.address, ethers.utils.parseEther("4900"))  //set approve amount to maximum to test contract
        await tcoin.connect(wallet2).approve(safeUpgradeable.address, ethers.utils.parseEther("100"))
    });

    describe("deployment", function () {  //test if init value is correct
        it("Should mint tokens to wallet 1", async function () {
            expect(await tcoin.balanceOf(wallet1.address)).to.equal(ethers.utils.parseEther("4900"));
        });

        it("Should mint tokens to wallet 2", async function () {
            expect(await tcoin.balanceOf(wallet2.address)).to.equal(ethers.utils.parseEther("100"));
        });
    });

    describe("deposit_Function", function () {
        it("should deposit TCoin Token into SafeUpgradeable", async function () {
            await safeUpgradeable.connect(wallet1).deposit(tcoin.address, ethers.utils.parseEther("80"));  //wallet1 deposit 80 to Safe
            await safeUpgradeable.connect(wallet2).deposit(tcoin.address, ethers.utils.parseEther("50"));  //wallet2 deposit 50 to Safe

            expect(await tcoin.balanceOf(wallet1.address)).to.equal(ethers.utils.parseEther("4820"));  //check the balance of the Tcoin in addr1 outside Safe is as same as design
            expect(await safeUpgradeable.balanceOf(wallet1.address, tcoin.address)).to.equal(ethers.utils.parseEther("79.92"));  //check the balance of the Tcoin in addr1 in Safe is as same as design
            expect(await tcoin.balanceOf(wallet2.address)).to.equal(ethers.utils.parseEther("50"));  //check the balance of the Tcoin in addr2 outside Safe is as same as design
            expect(await safeUpgradeable.balanceOf(wallet2.address, tcoin.address)).to.equal(ethers.utils.parseEther("49.95"));  //check the balance of the Tcoin in addr2 in Safe is as same as design
        });
    });
    
    describe("withdraw_Function", function () {
        it("should withdraw TCoin Token from SafeUpgradeable", async function () {
            await safeUpgradeable.connect(wallet1).deposit(tcoin.address, ethers.utils.parseEther("1500"));  
            await safeUpgradeable.connect(wallet1).withdraw(tcoin.address, ethers.utils.parseEther("700"));
            expect(await tcoin.balanceOf(wallet1.address)).to.equal(ethers.utils.parseEther("4100"));  //outside Safe: 4900 - 1500 + 700
            expect(await safeUpgradeable.balanceOf(wallet1.address, tcoin.address)).to.equal(ethers.utils.parseEther("798.5"));  //in Safe: 1500 -1.5 - 700
        });
    });

    describe("takeFee_Function", function () {
        it("should able for owner to withdraw Transfer fee from SafeUpgradeable", async function () {
            await safeUpgradeable.connect(wallet1).deposit(tcoin.address, ethers.utils.parseEther("1500"));
            await safeUpgradeable.connect(wallet1).withdraw(tcoin.address, ethers.utils.parseEther("700"));
            await safeUpgradeable.connect(owner).takeFee(tcoin.address);
            expect(await tcoin.balanceOf(wallet1.address)).to.equal(ethers.utils.parseEther("4100"));  //outside Safe: 4900 - 1500 + 700
            expect(await safeUpgradeable.balanceOf(wallet1.address, tcoin.address)).to.equal(ethers.utils.parseEther("798.5"));  //in Safe: 1500 - 700
            expect(await tcoin.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("1.5"));  //fee be taken should be 700*0.1% = 0.7
            expect(await safeUpgradeable.balanceOf(owner.address, tcoin.address)).to.equal(ethers.utils.parseEther("0"));  //remain 0 in Safe
        });
    });
});
