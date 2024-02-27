import {
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64,
  MerkleMap,
  Field,
  Poseidon,
} from "o1js";

import { PersonalBalance } from "./DexContract.js";
import { deployDex } from "./dex/dex.js";
import { log2TokensAddressBalance, logDexBalances } from "./helpers/logs.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
} from "./token/token.js";

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

const secondAccount = Local.testAccounts[1].privateKey;
const secondAddress = Local.testAccounts[1].publicKey;

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

console.log("inited 2 tokens into smart contracts");

const { dexApp: dexApp } = await deployDex(zkDexAppPrivateKey, deployerAccount);

console.log("deployed dex");

console.log("creating new user");

const firstId = Field(0);

const balanceOne: PersonalBalance = {
  owner: deployerAddress,
  id: firstId,
};

const witness = map.getWitness(firstId);

const create_user_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.createUser(witness, balanceOne);
});

await create_user_txn.prove();
await create_user_txn.sign([deployerAccount]).send();

map.set(firstId, Poseidon.hash(PersonalBalance.toFields(balanceOne)));

console.log("creating second user");

const secondId = Field(1);

const balanceTwo: PersonalBalance = {
  owner: secondAddress,
  id: secondId,
};

console.log("local map root", map.getRoot().toString());

const witnessTwo = map.getWitness(secondId);

const create_user_txnTwo = await Mina.transaction(secondAddress, () => {
  dexApp.createUser(witnessTwo, balanceTwo);
});

await create_user_txnTwo.prove();
await create_user_txnTwo.sign([secondAccount]).send();

map.set(secondId, Poseidon.hash(PersonalBalance.toFields(balanceTwo)));

console.log("deleting first user");
console.log("local map root", map.getRoot().toString());

const witnessOne_Two = map.getWitness(firstId);

const delete_user_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.deleteUser(witnessOne_Two, balanceOne);
});

await delete_user_txn.prove();
await delete_user_txn.sign([deployerAccount]).send();

map.set(balanceOne.id, Field(0));

console.log(map.getRoot().toString());

/* console.log("supplying liquidity X -- base");

let txBaseX = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenX(UInt64.from(10), balance, witness);
});

await txBaseX.prove();
await txBaseX.sign([deployerAccount]).send();

console.log("supplying liquidity Y -- base");

const XYbalances: PairBalances = {
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

let txBaseY = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenY(UInt64.from(10), XYbalances);
});

await txBaseY.prove();
await txBaseY.sign([deployerAccount]).send();

console.log("minting liquidity");

let txBaseMint = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  dexApp.mintLiquidityToken(UInt64.from(20));
});

await txBaseMint.prove();
await txBaseMint.sign([deployerAccount]).send();

logDexBalances(deployerAddress, tokenX, tokenY, dexApp);

console.log("swap"); */
/* 
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
 */
