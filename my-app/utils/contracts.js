import UniswapV2Factory from "@/utils/contracts/UniswapV2Factory.json";
import ERC20 from "@/utils/contracts/ERC20.json";
import UniswapV2Pair from "@/utils/contracts/UniswapV2Pair.json";

export function getContractInfo(chain) {
  if (chain === 250) {
    return {
      addressFactory: "0x30bea678b14c6be5De742f4ea065Dd20C34de8Da",
      abiFactory: UniswapV2Factory.abi,
    };
  }

  if (chain === 5001) {
    return {
      addressFactory: "0x1d4e02a5680ca146E246335Df2c413b9254D25F0",
      abiFactory: UniswapV2Factory.abi,
    };
  }

  if (chain === 80001) {
    return {
      addressFactory: "0xE605Ddd2570932d7F123E106A69Fd2b139614E7a",
      abiFactory: UniswapV2Factory.abi,
    };
  }
  if (chain === 15556) {
    return {
      addressFactory: "0xd5f17FE381292a1ca3a0b1231ba4b543dAA871cE",
      abiFactory: UniswapV2Factory.abi,
    };
  }
  if (chain === 3141) {
    return {
      addressFactory: "0xf33b15728f0ec44826ee217Bfd8FA9aD0e2300aa",
      abiFactory: UniswapV2Factory.abi,
    };
  }

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
