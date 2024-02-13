import { Balances } from "./DexContract.js";
import { deployDex } from "./dex/dex.js";
import { log2TokensAddressBalance, logDexBalances } from "./helpers/logs.js";

import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
} from "./token/token.js";

import {
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64,
  MerkleMap,
  Field,
} from "o1js";

const map = new MerkleMap();

const proofsEnabled = false;
const enforceTransactionLimits = true;

const Local = Mina.LocalBlockchain({
  proofsEnabled,
  enforceTransactionLimits,
});

Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0].privateKey;
const deployerAddress = Local.testAccounts[0].publicKey;

const zkDexAppPrivateKey = PrivateKey.random();
const zkDexAppAddress = zkDexAppPrivateKey.toPublicKey();

const {
  tokenX: tokenX,
  tokenY: tokenY,
  tokenXPK: TokenAddressXPrivateKey,
  tokenYPK: TokenAddressYPrivateKey,
} = await deploy2Tokens(deployerAddress, deployerAccount, proofsEnabled);

console.log("deployed 2 Tokens");

const mintAmount = UInt64.from(10_000);

await mintToken(
  TokenAddressXPrivateKey,
  deployerAccount,
  deployerAddress,
  tokenX,
  mintAmount
);

await mintToken(
  TokenAddressYPrivateKey,
  deployerAccount,
  deployerAddress,
  tokenY,
  mintAmount
);

console.log("created and minted 2 tokens");

log2TokensAddressBalance(deployerAddress, tokenX, tokenY);

await init2TokensSmartContract(
  deployerAccount,
  tokenX,
  tokenY,
  zkDexAppAddress
);

console.log("inited 2 tokens smart contracts");

const { dexApp: dexApp } = await deployDex(zkDexAppPrivateKey, deployerAccount);

console.log("deployed dex");

const init_dex_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.initTokenAddresses(tokenX.address, tokenY.address);
});

await init_dex_txn.prove();
await init_dex_txn.sign([deployerAccount]).send();

console.log("initialised tokens in a dex");

console.log("supplying liquidity -- base");

const witness = map.getWitness(Field(0));

const balance: Balances = {
  owner: deployerAddress,
  id: Field(0),
  tokenXAmount: UInt64.zero,
  tokenYAmount: UInt64.zero,
  incrementX(amount: UInt64) {
    this.tokenXAmount = this.tokenXAmount.add(amount);
  },
  decrementX(amount: UInt64) {
    this.tokenXAmount = this.tokenXAmount.sub(amount);
  },
  incrementY(amount: UInt64) {
    this.tokenYAmount = this.tokenYAmount.add(amount);
  },
  decrementY(amount: UInt64) {
    this.tokenYAmount = this.tokenYAmount.sub(amount);
  },
};

let txBaseX = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenX(UInt64.from(10), witness, balance);
});

await txBaseX.prove();
await txBaseX.sign([deployerAccount]).send();

let txBaseY = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenY(UInt64.from(10));
});

await txBaseY.prove();
await txBaseY.sign([deployerAccount]).send();

let txBaseMint = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  dexApp.mintLiquidityToken(UInt64.from(20));
});

await txBaseMint.prove();
await txBaseMint.sign([deployerAccount]).send();

logDexBalances(deployerAddress, tokenX, tokenY, dexApp);

console.log("swap");

let txSwap = await Mina.transaction(deployerAddress, () => {
  dexApp.swapXforY(UInt64.from(4));
});

await txSwap.prove();

await txSwap.sign([deployerAccount, zkDexAppPrivateKey]).send();

logDexBalances(deployerAddress, tokenX, tokenY, dexApp);

console.log("burn liquidity");

let txBurn = await Mina.transaction(deployerAddress, () => {
  dexApp.redeem(UInt64.from(4));
});

await txBurn.prove();
await txBurn.sign([deployerAccount, zkDexAppPrivateKey]).send();

logDexBalances(deployerAddress, tokenX, tokenY, dexApp);
