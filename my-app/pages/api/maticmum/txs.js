import { ethers } from "ethers";
import { getContractInfo } from "../../../utils/contracts";
import UniswapV2Pair from "../../../utils/contracts/UniswapV2Pair.json";
import ERC20 from "../../../utils/contracts/ERC20.json";

export default async function handler(req, res) {
  try {
    const { addressFactory, abiFactory } = getContractInfo(80001);

    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc-mumbai.maticvigil.com"
    );

    const contract = new ethers.Contract(
      addressFactory,
      abiFactory,
      customHttpProvider
    );

    const currentCount = ethers.BigNumber.from(
      await contract.allPairsLength()
    ).toNumber();

    let items = [];

    for (let i = currentCount; i > 0; i--) {
      const pairAddress = await contract.allPairs(i - 1);
      const Pair = new ethers.Contract(
        pairAddress,
        UniswapV2Pair.abi,
        customHttpProvider
      );

      const token0 = await Pair.token0();
      const token1 = await Pair.token1();

      var price0 = ethers.utils
        .formatEther(
          ethers.BigNumber.from(await Pair.price0CumulativeLast()).toString()
        )
        .split(".")[0];

      const Token0 = new ethers.Contract(token0, ERC20.abi, customHttpProvider);
      const Token1 = new ethers.Contract(token1, ERC20.abi, customHttpProvider);

      const name0 = await Token0.name();
      const name1 = await Token1.name();

      const token0Symbol = await Token0.symbol();
      const token1Symbol = await Token1.symbol();

      const reserves = await Pair.getReserves();
      const reserves0 = ethers.utils.formatEther(
        ethers.BigNumber.from(reserves[0]).toString()
      );

      const reserves1 = ethers.utils.formatEther(
        ethers.BigNumber.from(reserves[1]).toString()
      );

      var reserveRatio = (1 + reserves0) / (1 + reserves1);
      reserveRatio = Math.round(reserveRatio * 1e8) / 1e8;

      items.push({
        id: i,
        price0: price0,
        token0Name: name0,
        token0Symbol: token0Symbol,
        token1Name: name1,
        token1Symbol: token1Symbol,
        reserveRatio: reserveRatio,
        pairAddress: pairAddress,
      });
    }

    res.status(200).json(items);
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
