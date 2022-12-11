const { ethers } = require("hardhat");
const { expect } = require("chai");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);
const TEST_AMOUNT = expandTo18Decimals(10);

describe("", function () {
  let token;

  beforeEach(async () => {
    [bob, jane] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("UniswapV2ERC20");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Should set the right ", async function () {
    const name = await token.name();

    expect(name).to.eq("Uniswap V2");
    expect(await token.symbol()).to.eq("UNI-V2");
    expect(await token.decimals()).to.eq(18);
    console.log(await token.totalSupply());
    //expect(await token.totalSupply()).to.eq(TOTAL_SUPPLY);
    //expect(await token.balanceOf(wallet.address)).to.eq(TOTAL_SUPPLY);
  });
});
