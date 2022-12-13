const { ethers } = require("hardhat");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);

async function main() {
  deployer = await ethers.getSigners();
  const Token = await ethers.getContractFactory("ERC20");
  const token = await Token.deploy(TOTAL_SUPPLY);
  await token.deployed();

  console.log(`deployed to ${token.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
