import ERC20 from "@/utils/contracts/ERC20.json";
import UniswapV2Pair from "@/utils/contracts/UniswapV2Pair.json";

import { TradeCoinFactoryAbi } from "./contracts/TradeCoinFactory";

export function getContractInfo() {
  return {
    addressFactory: "TBm29AMoKKkxE9z5mwWdVdbt5CPqPhZxTq",
    abiFactory: TradeCoinFactoryAbi,
  };
}

export function getERC20() {
  return {
    abiERC20: ERC20.abi,
  };
}

export function getPair() {
  return {
    abiPair: UniswapV2Pair.abi,
  };
}
