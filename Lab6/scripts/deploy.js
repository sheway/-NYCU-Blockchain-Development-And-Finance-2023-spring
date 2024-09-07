const { network, ethers } = require("hardhat");

async function main() {
  const MyContract = await ethers.getContractFactory("MyContract");
  const contract = await MyContract.deploy('0x7A81e50E0Ad45B31cC8E54A55095714F13a0c74e', '0x5e94B61BCa112683D18d5Ed27CebB16566E6d5ba', '0xbe02727047fADd7fe434E093e001745B42C5F49B');

  console.log('Deploying contract...');
  await contract.deployed();
  console.log("Contract Address:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
