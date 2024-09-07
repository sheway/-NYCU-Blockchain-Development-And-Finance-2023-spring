const { network, ethers } = require("hardhat");

async function main() {
  const Safe = await ethers.getContractFactory("Safe");
  const safe = await Safe.deploy();

  console.log('Deploying Safe...');
  await safe.deployed();
  console.log("Contract Address:", safe.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
