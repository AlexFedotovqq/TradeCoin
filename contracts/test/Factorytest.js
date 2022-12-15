const { ethers } = require("hardhat");
const { expect } = require("chai");

var UniswapV2Pair = require("../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);

describe("factory", function () {
  let factory, tokenA, tokenB;

  let deployer, jane;
  beforeEach(async () => {
    [deployer, jane] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    factory = await Factory.deploy(deployer.address);
    await factory.deployed();

    const TokenA = await ethers.getContractFactory("ERC20");
    tokenA = await TokenA.deploy(TOTAL_SUPPLY);
    await tokenA.deployed();

    const TokenB = await ethers.getContractFactory("ERC20");
    tokenB = await TokenB.deploy(TOTAL_SUPPLY);
    await tokenB.deployed();
  });

  it("Should deploy Factory ", async function () {
    expect(await factory.feeTo()).to.eq(ethers.constants.AddressZero);
    expect(await factory.feeToSetter()).to.eq(deployer.address);
    expect(await factory.allPairsLength()).to.eq(0);
  });

  it("Should create pair ", async function () {
    await factory.createPair(tokenA.address, tokenB.address);
    const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

    const pair = new ethers.Contract(
      pairAddress,
      JSON.stringify(UniswapV2Pair.abi),
      deployer
    ).connect(deployer);

    const token0Address = (await pair.token0()).address;
    const token0 = tokenA.address === token0Address ? tokenA : tokenB;
    const token1 = tokenA.address === token0Address ? tokenB : tokenA;

    expect(await factory.allPairsLength()).to.eq(1);
    expect(await pair.token0()).to.eq(token0.address);
    expect(await pair.token1()).to.eq(token1.address);
  });
});
