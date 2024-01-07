import { BasicTokenContract } from "../BasicTokenContract.js";
import { Dex } from "../DexContract.js";

import { PublicKey, Mina } from "o1js";

export function logOutBalances(
  deployerAddress: PublicKey,
  tokenX: BasicTokenContract,
  tokenY: BasicTokenContract,
  dexApp: Dex
) {
  log2Tokens(deployerAddress, tokenX, tokenY);

  console.log(
    "zkDexAppAddress tokenX tokens:",
    Mina.getBalance(dexApp.address, tokenX.token.id).value.toBigInt()
  );

  console.log(
    "zkDexAppAddress tokenY tokens:",
    Mina.getBalance(dexApp.address, tokenY.token.id).value.toBigInt()
  );

  console.log(
    "deployer dexApp tokens:",
    Mina.getBalance(deployerAddress, dexApp.token.id).value.toBigInt()
  );

  console.log("total supply", dexApp.totalSupply.get().value.toBigInt());

  console.log("Y balance", dexApp.Ybalance.get().value.toBigInt());

  console.log("X balance", dexApp.Xbalance.get().value.toBigInt());
}

export function log2Tokens(
  deployerAddress: PublicKey,
  tokenX: BasicTokenContract,
  tokenY: BasicTokenContract
) {
  console.log(
    "deployerAddress tokenX tokens:",
    Mina.getBalance(deployerAddress, tokenX.token.id).value.toBigInt()
  );
  console.log(
    "deployerAddress tokenY tokens:",
    Mina.getBalance(deployerAddress, tokenY.token.id).value.toBigInt()
  );
}

export function logTokenInfo(contract: BasicTokenContract) {
  console.log(
    "totalAmountInCirculation: " + contract.totalAmountInCirculation.get()
  );

  console.log(
    "zkapp tokens:",
    Mina.getBalance(contract.address, contract.token.id).value.toBigInt()
  );
}

export function logTokenBalance(contract: BasicTokenContract, pub: PublicKey) {
  console.log(
    "deployer tokens:",
    Mina.getBalance(pub, contract.token.id).value.toBigInt()
  );

  console.log(
    "zkapp tokens:",
    Mina.getBalance(contract.address, contract.token.id).value.toBigInt()
  );
}
