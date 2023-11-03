import { TRX20Abi } from "./TRX20";
import { TradeCoinFactoryAbi } from "./TradeCoinFactory";
import { TradeCoinPairAbi } from "./TradeCoinPair";

export function getContractInfo() {
  return {
    addressFactory: "TDrWZVU9g2bRQSN6vqFeuRjYJ1pytcdHw5",
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
