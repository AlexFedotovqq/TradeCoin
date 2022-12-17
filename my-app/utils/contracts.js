import UniswapV2Factory from "../utils/contracts/UniswapV2Factory.json";
import ERC20 from "../utils/contracts/ERC20.json";
import UniswapV2Pair from "../utils/contracts/UniswapV2Pair.json";

export function getContractInfo(chain) {
  //if (chain === 80001)
  return {
    address: "0xE605Ddd2570932d7F123E106A69Fd2b139614E7a",
    abi: UniswapV2Factory.abi,
  };
}

export function getERC20() {
  return {
    abi: ERC20.abi,
  };
}

export function getPair() {
  return {
    abiPair: UniswapV2Pair.abi,
  };
}
