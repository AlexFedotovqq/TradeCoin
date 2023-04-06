const TronWeb = require("tronweb");
import { ethers } from "ethers";

import { getContractInfo, getERC20, getPair } from "@/utils/contracts";

export default async function handler(req, res) {
  const { addressFactory, abiFactory } = getContractInfo();
  const { abiPair } = getPair();
  const { abiERC20 } = getERC20();

  const fullNode = "https://api.shasta.trongrid.io";
  const solidityNode = "https://api.shasta.trongrid.io";
  const eventServer = "https://api.shasta.trongrid.io";
  const privateKey = process.env.NEXT_PRIVATE_KEY;
  const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);

  const contract = await tronWeb.contract(abiFactory, addressFactory);
  const currentCount = ethers.BigNumber.from(
    await contract.allPairsLength().call()
  ).toNumber();

  let items = [];

  for (let i = currentCount; i > 0; i--) {
    const pairAddress = await contract.allPairs(i - 1).call();

    const Pair = await tronWeb.contract(abiPair, pairAddress);

    const token0 = await Pair.token0().call();
    const token1 = await Pair.token1().call();

    const Token0 = await tronWeb.contract(abiPair, token0);
    const Token1 = await tronWeb.contract(abiPair, token1);

    const name0 = await Token0.name().call();
    const name1 = await Token1.name().call();

    const reserves = await Pair.getReserves().call();
    //console.log(reserves[0]);
    //console.log(tronWeb.BigNumber(reserves[0]).toNumber());

    const reserves0 = ethers.utils.formatEther(
      ethers.BigNumber.from(reserves[0]).toString()
    );
    const reserves1 = ethers.utils.formatEther(
      ethers.BigNumber.from(reserves[1]).toString()
    );

    const supply = ethers.utils.formatEther(
      ethers.BigNumber.from(await Pair.totalSupply().call()).toString()
    );

    items.push({
      token0Address: token0,
      token1Address: token1,
      token0Name: name0,
      token1Name: name1,
      token0Reserves: reserves0,
      token1Reserves: reserves1,
      totalSupply: supply,
      pairAddress: pairAddress,
    });
  }

  res.status(200).json(items);
}
