import { Mina, PrivateKey, Field, Poseidon, MerkleTree } from "o1js";

import { PoolId, MyMerkleWitness } from "../src/DexContract.js";
import { deployDex } from "../src/dex/dex.js";
import { startLocalBlockchainClient } from "../src/helpers/client.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
} from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";
import { Dex } from "../src/DexContract.js";

describe("Dex Contract", () => {
  const testAccounts = startLocalBlockchainClient();

  const map = new MerkleTree(6);

  const deployerAccount = testAccounts[0].privateKey;
  const deployerAddress = testAccounts[0].publicKey;

  const secondAccount = testAccounts[1].privateKey;
  const secondAddress = testAccounts[1].publicKey;

  const tokenXPrivateKey: PrivateKey = PrivateKey.random();
  const tokenYPrivateKey: PrivateKey = PrivateKey.random();

  const tokenX: BasicTokenContract = new BasicTokenContract(
    tokenXPrivateKey.toPublicKey()
  );
  const tokenY: BasicTokenContract = new BasicTokenContract(
    tokenYPrivateKey.toPublicKey()
  );

  const zkDexAppPrivateKey = PrivateKey.random();
  const zkDexAppAddress = zkDexAppPrivateKey.toPublicKey();
  const dexApp = new Dex(zkDexAppAddress);

  it("deployed 2 tokens", async () => {
    await deploy2Tokens(deployerAccount, tokenXPrivateKey, tokenYPrivateKey);
  });

  it("created and minted 2 tokens", async () => {
    await mintToken(deployerAccount, deployerAddress, tokenX);
    await mintToken(deployerAccount, deployerAddress, tokenY);
  });

  it("deployed dex", async () => {
    await deployDex(zkDexAppPrivateKey, deployerAccount, dexApp);
  });

  it("inited 2 tokens into Dex", async () => {
    await init2TokensSmartContract(
      deployerAccount,
      tokenX,
      tokenY,
      zkDexAppAddress
    );
  });
});

/*
console.log("creating new user");
const firstId = 0n;

const balanceOne: PoolId = {
  PairAddress: deployerAddress,
  mintingContractAddress: deployerAddress,
  id: Field(firstId),
};

const w = map.getWitness(firstId);
const witness = new MyMerkleWitness(w);

const create_user_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.createPool(witness, balanceOne);
});

await create_user_txn.prove();
await create_user_txn.sign([deployerAccount]).send();

map.setLeaf(firstId, Poseidon.hash(PoolId.toFields(balanceOne)));

console.log("creating second user");

const secondId = 1n;

const balanceTwo: PoolId = {
  PairAddress: deployerAddress,
  mintingContractAddress: deployerAddress,
  id: Field(secondId),
};

console.log("local map root", map.getRoot().toString());

const w2 = map.getWitness(secondId);
const witnessTwo = new MyMerkleWitness(w2);

const create_user_txnTwo = await Mina.transaction(secondAddress, () => {
  dexApp.createPool(witnessTwo, balanceTwo);
});

await create_user_txnTwo.prove();
await create_user_txnTwo.sign([secondAccount]).send();

map.setLeaf(secondId, Poseidon.hash(PoolId.toFields(balanceTwo)));

console.log("deleting first user");
console.log("local map root", map.getRoot().toString());

const w3 = map.getWitness(firstId);
const witnessOne_Two = new MyMerkleWitness(w3);

const delete_user_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.deletePool(witnessOne_Two, balanceOne);
});

await delete_user_txn.prove();
await delete_user_txn.sign([deployerAccount]).send();

map.setLeaf(0n, Field(0));

console.log("local map root", map.getRoot().toString()); */

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
