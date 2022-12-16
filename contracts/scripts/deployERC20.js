const { ethers } = require("hardhat");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy(TOTAL_SUPPLY);
  await token.deployed();

  console.log(`deployed to ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
