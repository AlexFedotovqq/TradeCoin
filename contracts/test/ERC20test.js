const { ethers } = require("hardhat");
const { expect } = require("chai");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);

describe("erc 20", function () {
  let token;
  let deployer;
  let jane;
  beforeEach(async () => {
    [deployer, jane] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("ERC20");
    token = await Token.deploy(TOTAL_SUPPLY);
    await token.deployed();
  });

  it("Should set the right details for erc 20", async function () {
    const name = await token.name();

    expect(name).to.eq("XRC Swap");
    expect(await token.symbol()).to.eq("XRC-SW");
    expect(await token.decimals()).to.eq(18);
    expect(await token.totalSupply()).to.eq(TOTAL_SUPPLY);
    expect(await token.balanceOf(deployer.address)).to.eq(TOTAL_SUPPLY);
    expect(await token.balanceOf(jane.address)).to.eq(0);
  });
});
