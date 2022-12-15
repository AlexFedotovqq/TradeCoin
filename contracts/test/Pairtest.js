const { ethers } = require("hardhat");
const { expect } = require("chai");

var UniswapV2Pair = require("../artifacts/contracts/UniswapV2Pair.sol/UniswapV2Pair.json");

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const TOTAL_SUPPLY = expandTo18Decimals(10000);

describe("features", function () {
  let factory, pair, token0, token1;

  let deployer, jane;
  beforeEach(async () => {
    [deployer, jane] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("UniswapV2Factory");
    factory = await Factory.deploy(deployer.address);
    await factory.deployed();

    const TokenA = await ethers.getContractFactory("ERC20");
    const tokenA = await TokenA.deploy(TOTAL_SUPPLY);
    await tokenA.deployed();

    const TokenB = await ethers.getContractFactory("ERC20");
    const tokenB = await TokenB.deploy(TOTAL_SUPPLY);
    await tokenB.deployed();

    await factory.createPair(tokenA.address, tokenB.address);
    const pairAddress = await factory.getPair(tokenA.address, tokenB.address);

    pair = new ethers.Contract(
      pairAddress,
      JSON.stringify(UniswapV2Pair.abi),
      deployer
    ).connect(deployer);

    const token0Address = (await pair.token0()).address;
    token0 = tokenA.address === token0Address ? tokenA : tokenB;
    token1 = tokenA.address === token0Address ? tokenB : tokenA;
  });

  it("Should create pair ", async function () {
    expect(await factory.allPairsLength()).to.eq(1);
    expect(await pair.token0()).to.eq(token0.address);
    expect(await pair.token1()).to.eq(token1.address);
  });

  it("Should mint ", async function () {
    const token0Amount = expandTo18Decimals(2);
    const token1Amount = expandTo18Decimals(18);
    await token0.transfer(pair.address, token0Amount);
    await token1.transfer(pair.address, token1Amount);

    await pair.mint(deployer.address);

    // sqrt( t1 * t2 )
    const expectedLiquidity = expandTo18Decimals(6);
    expect(await pair.totalSupply()).to.eq(expectedLiquidity);

    expect(await token0.balanceOf(pair.address)).to.eq(token0Amount);
    expect(await token1.balanceOf(pair.address)).to.eq(token1Amount);

    //const reserves = await pair.getReserves();

    //expect(reserves[0]).to.eq(token0Amount);
    //expect(reserves[1]).to.eq(token1Amount);
  });

  it("Should swap", async function () {
    const token0Amount = expandTo18Decimals(5);
    const token1Amount = expandTo18Decimals(10);
    await token0.transfer(pair.address, token0Amount);
    await token1.transfer(pair.address, token1Amount);

    await pair.mint(deployer.address);

    // we need math
    // Y * X = Ynew * Xnew
    // 50/6 = 8.(3) = Ynew

    // the outY = Y - Ynew = 1.(6)

    const swapAmount = expandTo18Decimals(1);
    const expectedOutputAmount = ethers.BigNumber.from("1662497915624478906");
    await token0.transfer(pair.address, swapAmount);

    await pair.swap(0, expectedOutputAmount, deployer.address, "0x");

    const reserves = await pair.getReserves();
    expect(reserves[0]).to.eq(token0Amount.add(swapAmount));
    expect(reserves[1]).to.eq(token1Amount.sub(expectedOutputAmount));
    expect(await token0.balanceOf(pair.address)).to.eq(
      token0Amount.add(swapAmount)
    );
    expect(await token1.balanceOf(pair.address)).to.eq(
      token1Amount.sub(expectedOutputAmount)
    );
    const totalSupplyToken0 = await token0.totalSupply();
    const totalSupplyToken1 = await token1.totalSupply();
    expect(await token0.balanceOf(deployer.address)).to.eq(
      totalSupplyToken0.sub(token0Amount).sub(swapAmount)
    );
    expect(await token1.balanceOf(deployer.address)).to.eq(
      totalSupplyToken1.sub(token1Amount).add(expectedOutputAmount)
    );
  });
});
