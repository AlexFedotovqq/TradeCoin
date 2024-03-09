import { PublicKey, Mina, SmartContract, fetchAccount } from "o1js";

import { BasicTokenContract } from "../BasicTokenContract.js";
import { Dex } from "../DexContract.js";
import { PairContract } from "../PairContract.js";

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

export async function logDexStates(dexApp: Dex, live: boolean = false) {
  if (live) {
    await fetchAccount({ publicKey: dexApp.address });
  }
  console.log("total number of pools", dexApp.poolTotal.get().value.toBigInt());
  console.log("tree root state", dexApp.treeRoot.get().toString());
}

export async function logPairStates(app: PairContract, live: boolean = false) {
  if (live) {
    await fetchAccount({ publicKey: app.address });
  }
  console.log("token X address", app.tokenX.get().toBase58());
  console.log("token Y address", app.tokenY.get().toBase58());
  console.log("tree root state", app.treeRoot.get().toString());
  console.log("UserId state", app.userId.get().toBigInt());
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
  console.log("totalSupply: " + contract.totalSupply.get());

  console.log(
    "zkapp tokens:",
    Mina.getBalance(contract.address, contract.token.id).value.toBigInt()
  );

  console.log("token Id", contract.token.id.toBigInt());
  console.log("tokenOwner", contract.token.tokenOwner.toBase58());
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
