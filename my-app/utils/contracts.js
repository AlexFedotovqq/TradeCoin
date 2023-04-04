import { TRX20Abi } from "./contracts/TRX20";
import { TradeCoinFactoryAbi } from "./contracts/TradeCoinFactory";
import { TradeCoinPairAbi } from "./contracts/TradeCoinPair";

export function getContractInfo() {
  return {
    addressFactory: "TBm29AMoKKkxE9z5mwWdVdbt5CPqPhZxTq",
    abiFactory: TradeCoinFactoryAbi,
  };
}

export function getERC20() {
  return {
    abiERC20: TRX20Abi,
  };
}

export function getPair() {
  return {
    abiPair: TradeCoinPairAbi,
  };
}
