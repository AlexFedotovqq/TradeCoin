import UniswapV2Factory from "../utils/contracts/UniswapV2Factory.json";
import ERC20 from "../utils/contracts/ERC20.json";
import UniswapV2Pair from "../utils/contracts/UniswapV2Pair.json";

export function getContractInfo(chain) {
  /*  if (chain === 80001) {
    return {
      addressFactory: "0xE605Ddd2570932d7F123E106A69Fd2b139614E7a",
      abiFactory: UniswapV2Factory.abi,
    };
  } */
  return {
    addressFactory: "0xb4BbeC5107FfFafc947912E7a05e871A312798bf",
    abiFactory: UniswapV2Factory.abi,
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
