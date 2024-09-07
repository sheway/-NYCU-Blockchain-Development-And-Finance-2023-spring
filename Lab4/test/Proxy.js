const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Proxy", function () {
    let safe;
    let tcoin;
    let proxy;
    let implementation;
    let owner;
    let wallet1;
    let wallet2;

    beforeEach(async function () {
        [owner, wallet1, wallet2] = await ethers.getSigners(); //獲取部署合約的帳號
        // 部署implementation合約
        const SafeUpgradeable = await ethers.getContractFactory("SafeUpgradeable");
        implementation = await SafeUpgradeable.deploy();
        // 部署proxy合約
        const Proxy = await ethers.getContractFactory("Proxy");
        proxy = await Proxy.deploy(implementation.address, wallet1.address);
        //ERC20 Token
        TestCoin = await ethers.getContractFactory("TestCoin", wallet1);
        tcoin = await TestCoin.deploy();

        tcoin.connect(wallet1).transfer(wallet2.address, ethers.utils.parseEther("100"))  //default: wallet1: 5000, wallet2: 0
        
        await tcoin.connect(wallet1).approve(proxy.address, ethers.utils.parseEther("4900"))  //set approve amount to maximum to test contract
        await tcoin.connect(wallet2).approve(proxy.address, ethers.utils.parseEther("100"))
    });
    
    describe("deployment", function () {  //test if init value is correct
        it("initializes implementation and owner correctly", async function () {
            expect(await proxy.get_impl_addr()).to.equal(implementation.address);
            expect(await proxy.proxyOwner()).to.equal(wallet1.address);
        });

        it("Should mint tokens to wallet 1", async function () {
            expect(await tcoin.balanceOf(wallet1.address)).to.equal(ethers.utils.parseEther("4900"));
        });

        it("Should mint tokens to wallet 2", async function () {
            expect(await tcoin.balanceOf(wallet2.address)).to.equal(ethers.utils.parseEther("100"));
        });

        it("Should connect to right implementation", async function () {
            expect(await proxy.get_impl_addr()).to.equal(implementation.address);
        });

        it('should have the correct owner address', async function () {
            expect(await proxy.proxyOwner()).to.equal(wallet1.address);
        });
    });
});
