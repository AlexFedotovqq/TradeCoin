import { ethers } from "ethers";
import { getContractInfo } from "@/utils/contracts";
import UniswapV2Pair from "@/utils/contracts/UniswapV2Pair.json";
import ERC20 from "@/utils/contracts/ERC20.json";

export async function queryContract() {
  try {
    const { addressFactory, abiFactory } = getContractInfo();

    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc.xinfin.network"
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

      const Token0 = new ethers.Contract(token0, ERC20.abi, customHttpProvider);
      const Token1 = new ethers.Contract(token1, ERC20.abi, customHttpProvider);

      const name0 = await Token0.name();
      const name1 = await Token1.name();

      const reserves = await Pair.getReserves();
      const reserves0 = ethers.utils.formatEther(
        ethers.BigNumber.from(reserves[0]).toString()
      );
      const reserves1 = ethers.utils.formatEther(
        ethers.BigNumber.from(reserves[1]).toString()
      );

      const supply = ethers.utils.formatEther(
        ethers.BigNumber.from(await Pair.totalSupply()).toString()
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

    return items;
  } catch (err) {
    return { error: "failed to fetch data" + err };
  }
}

export async function queryPrices() {
  try {
    const { addressFactory, abiFactory } = getContractInfo();

    const customHttpProvider = new ethers.providers.JsonRpcProvider(
      "https://rpc.xinfin.network"
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

    return items;
  } catch (err) {
    return { error: "failed to fetch data" + err };
  }
}
