import UniswapV2Factory from "../utils/contracts/UniswapV2Factory.json";

export function getContractInfo(chain) {
  //if (chain === 80001)
  return {
    address: "0xE605Ddd2570932d7F123E106A69Fd2b139614E7a",
    abi: UniswapV2Factory.abi,
  };
}
