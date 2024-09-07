const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NYCUToken", function () {
    let nycut;
    let owner;
    let wallet1;

    before(async function () {
        [owner, wallet1] = await ethers.getSigners(); //獲取部署合約的帳號
        NYCUToken = await ethers.getContractFactory("NYCUToken", owner);
        nycut = await NYCUToken.deploy();
    });

    describe("deployment", function () {  //test if init value is correct
        it("Should mint tokens to owner", async function () {
            expect(await nycut.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("5000"));
        });
    });

    describe("mint_Function", function () {
        it("should mint NYCUToken Token", async function () {
            await nycut.connect(owner).mint(owner.address, ethers.utils.parseEther("100"));  //owner mint 100 token
            expect(await nycut.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("5100"));
        });
    });

    describe("burn_Function", function () {
        it("should burn NYCUToken Token", async function () {
            await nycut.connect(owner).burn(ethers.utils.parseEther("100"));  //owner burn 100 token
            expect(await nycut.balanceOf(owner.address)).to.equal(ethers.utils.parseEther("5000"));
        });
    });
    
    describe("transferOwner_Function", function () {
        it("should able owner to transfer ownership to another address", async function () { 
            await nycut.connect(owner).transferOwner(wallet1.address);
            expect(await nycut.owner()).to.equal(wallet1.address);
        });
    });
});
