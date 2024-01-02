import { BasicTokenContract } from "../BasicTokenContract.js";
import { Dex } from "../DexContract.js";

import { PublicKey } from "o1js";

export function logOutBalances(
  Mina: any,
  deployerAddress: PublicKey,
  tokenX: BasicTokenContract,
  tokenY: BasicTokenContract,
  dexApp: Dex
) {
  log2Tokens(Mina, deployerAddress, tokenX, tokenY);

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
  Mina: any,
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
