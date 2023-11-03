export async function swap(contract, tokenA, tokenB) {
  let pairAddress = await contract
    .getPair(tokenA.address, tokenB.address)
    .call();

  if (pairAddress === "410000000000000000000000000000000000000000") {
    console.log("create a pair first");
    return;
  }

  const pair = await tronWeb.contract(abiPair, pairAddress);

  const orderIn = (await pair.token0().call()) === tokenA ? 0 : 1;
  const orderOut = (await pair.token1().call()) === tokenB ? 1 : 0;

  const token = await tronWeb.contract(abiERC20, tokenA.address);

  await token.transfer(pairAddress, expandTo18Decimals(swapAmount)).send();

  const Preserves = await pair.getReserves().call();

  var amountInWithFee = expandTo18Decimals(swapAmount).mul(996);

  var numerator = amountInWithFee.mul(Preserves[orderOut]);
  var denominator = Preserves[orderIn].mul(1000).add(amountInWithFee);
  var amountOut = numerator / denominator;

  const expectedOutputAmount = ethers.BigNumber.from(String(amountOut));

  const address = await tronWeb.defaultAddress.base58;

  await pair.swap(0, expectedOutputAmount, address, "0x").send();
  try {
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
    }, 5000);
  } catch (error) {
    console.error("Error during swap:", error);
  }
}

export async function addLiquidity(address0, address1, pairAddress) {
  const { abiERC20 } = getERC20();
  const { abiPair } = getPair();
  const address = await tronWeb.defaultAddress.base58;

  const token0 = await tronWeb.contract(abiERC20, address0);
  const token1 = await tronWeb.contract(abiERC20, address1);
  const pair = await tronWeb.contract(abiPair, pairAddress);

  await token0.transfer(pairAddress, expandTo18Decimals(tokenAQuantity)).send();

  await token1.transfer(pairAddress, expandTo18Decimals(tokenBQuantity)).send();

  await pair.mint(address).send();
}

export async function removeLiquidity(pairAddress) {
  const { abiPair } = getPair();
  const address = await tronWeb.defaultAddress.base58;

  const pair = await tronWeb.contract(abiPair, pairAddress);

  await pair
    .transfer(pair.address, expandTo18Decimals(withdrawalQuantity))
    .send();

  await pair.burn(address).send();
}

export async function startUpload() {
  const { addressFactory, abiFactory } = getContractInfo();
  const contract = await tronWeb.contract(abiFactory, addressFactory);
  await contract.createPair(tokenA, tokenB).send({ feeLimit: 4000000000 });
}
