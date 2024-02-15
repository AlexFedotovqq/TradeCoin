import { BasicTokenContract } from "../BasicTokenContract.js";
import { Dex } from "../DexContract.js";

import { PublicKey, Mina, SmartContract } from "o1js";

export function logDexBalances(
  pub: PublicKey,
  tokenX: BasicTokenContract,
  tokenY: BasicTokenContract,
  dexApp: Dex
) {
  log2TokensAddressBalance(pub, tokenX, tokenY);

  log2TokensAddressBalance(dexApp.address, tokenX, tokenY);

  logTokenBalance(dexApp, pub);

  logDexStates(dexApp);
}

export function logDexStates(dexApp: Dex) {
  console.log("total supply", dexApp.totalSupply.get().value.toBigInt());

  console.log("X balance", dexApp.XYbalance.get().toBigInt());
  console.log("Y balance", dexApp.XYbalance.get().toBigInt());
}

export function log2TokensAddressBalance(
  pub: PublicKey,
  tokenX: SmartContract,
  tokenY: SmartContract
) {
  const pubAddress = pub.toBase58();
  const pubTokenXBalance = Mina.getBalance(
    pub,
    tokenX.token.id
  ).value.toBigInt();

  const pubTokenYBalance = Mina.getBalance(
    pub,
    tokenY.token.id
  ).value.toBigInt();

  console.log(pubAddress + " tokenX : ", pubTokenXBalance);
  console.log(pubAddress + " tokenY : ", pubTokenYBalance);
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

export function logTokenBalance(contract: SmartContract, pub: PublicKey) {
  const pubAddress = pub.toBase58();
  const tokenAddress = contract.address.toBase58();
  let balance = 0n;
  try {
    balance = Mina.getBalance(pub, contract.token.id).value.toBigInt();
  } catch (e) {}
  console.log(pubAddress, "address", tokenAddress, "tokens:", balance);
}
