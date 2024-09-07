const { network, ethers } = require("hardhat");

async function main() {
  const NYCUToken = await ethers.getContractFactory("NYCUToken");
  const nycu = await NYCUToken.deploy();

  console.log('Deploying NYCUToken...');
  await nycu.deployed();
  console.log("Contract Address:", nycu.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
