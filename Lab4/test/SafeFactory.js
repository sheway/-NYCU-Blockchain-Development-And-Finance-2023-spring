const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SafeFactory", function() {
    let safeFactory;

    let owner;
    let wallet1;
    let wallet2;

    beforeEach(async function() {
        [owner, wallet1, wallet2] = await ethers.getSigners(); //獲取部署合約的帳號

        SafeUpgradeableImpl = await ethers.getContractFactory("SafeUpgradeable");
        safeUpgradeableImpl = await SafeUpgradeableImpl.deploy();

        SafeFactory = await ethers.getContractFactory("SafeFactory");
        safeFactory = await SafeFactory.deploy(safeUpgradeableImpl.address);

        safeFactory.updateImplementation(safeUpgradeableImpl.address);
    });

    describe("Deployment", function() {
        it("Should set the right owner", async function() {
            expect(await safeFactory._owner()).to.equal(owner.address);
        });

        it("Should set the right implementation", async function() {
            expect(await safeFactory._implementation()).to.equal(safeUpgradeableImpl.address);
        });
    });

    describe("Deploy Safe", function() {
        it("Should deploy Safe", async function() {
            //I can't get owner form safe._owner() directly after called deploySafe()(I got contract correctlt but every function are anonymous), 
            //so I had to find out actual Safe's address to access safe._owner().
            const tx = await safeFactory.connect(wallet1).deploySafe();
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const safeAddress = receipt.logs[0].address;  //the actual address of Safe is in logs[0]
            const Safe = await ethers.getContractFactory("Safe");
            const safe = await Safe.attach(safeAddress);  //attach it to Safe
            expect(safe).to.be.instanceof(ethers.Contract);  //make sure this address is a contract
        });

        it("Should transfer ownership of Safe to caller", async function() {
            const tx = await safeFactory.connect(wallet1).deploySafe();
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const safeAddress = receipt.logs[0].address;
            const Safe = await ethers.getContractFactory("Safe");
            const safe = await Safe.attach(safeAddress);  //mainly same as above, the only difference is to check the owner of Safe
            expect(await safe._owner()).to.equal(wallet1.address);
        });
    });

    describe("Deploy Safe Proxy", function() {
        it("Should deploy Safe Proxy", async function() {
            const tx = await safeFactory.connect(wallet1).deploySafeProxy();
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const safeProxyAddress = receipt.logs[0].address;
            const Proxy = await ethers.getContractFactory("Proxy");
            const proxy = await Proxy.attach(safeProxyAddress);
            expect(proxy).to.be.instanceof(ethers.Contract);  //check if the address is an contract
        });

        it("Should transfer ownership of Safe Proxy to caller", async function() {
            const tx = await safeFactory.connect(wallet1).deploySafeProxy();
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const safeProxyAddress = receipt.logs[0].address;
            const Proxy = await ethers.getContractFactory("Proxy");
            const proxy = await Proxy.attach(safeProxyAddress);
            expect(await proxy.proxyOwner()).to.equal(wallet1.address);  //check if the owner is same as caller
        });
    });

    describe("Update Implementation", function() {
        it("Should not allow non-owner to update implementation", async function() {
            await expect(
                safeFactory.connect(wallet1).updateImplementation(wallet2.address)
            ).to.be.revertedWith("You are not owner");
        });

        it("Should points to the new implementation after updateImplementation is being called.", async function() {
            SafeUpgradeableImpl2 = await ethers.getContractFactory("SafeUpgradeable");  //deploy another contract to test updateImplementation function
            safeUpgradeableImpl2 = await SafeUpgradeableImpl.deploy();
            await safeFactory.connect(owner).updateImplementation(safeUpgradeableImpl2.address);
            const tx = await safeFactory.connect(wallet1).deploySafeProxy();
            const receipt = await ethers.provider.getTransactionReceipt(tx.hash);
            const safeProxyAddress = receipt.logs[0].address;
            const Proxy = await ethers.getContractFactory("Proxy");
            const proxy = await Proxy.attach(safeProxyAddress);  
            expect(await safeFactory._implementation()).to.equal(safeUpgradeableImpl2.address);  //make sure the Implement contract that proxy point to had change after deploy another proxy
        });
    });
});

