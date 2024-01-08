import { Dex } from "./DexContract.js";
import { log2TokensAddressBalance, logDexBalances } from "./helpers/logs.js";

import { deploy2Tokens, mintToken } from "./token/token.js";

import { Mina, PrivateKey, AccountUpdate, UInt64, Signature } from "o1js";

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

// necessary to initialize tokens for ZkApp
const send_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress, 2);
  tokenX.transfer(deployerAddress, zkDexAppAddress, UInt64.zero);
  tokenY.transfer(deployerAddress, zkDexAppAddress, UInt64.zero);
});

await send_txn.prove();
await send_txn.sign([deployerAccount]).send();

console.log("sent");

let verificationKey: any;

if (proofsEnabled) {
  ({ verificationKey } = await Dex.compile());
  console.log("compiled");
}

const dexApp = new Dex(zkDexAppAddress);

const deploy_dex_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  dexApp.deploy({ verificationKey, zkappKey: zkDexAppPrivateKey });
});

await deploy_dex_txn.prove();
await deploy_dex_txn.sign([deployerAccount]).send();

console.log("deployed dex");

const init_dex_txn = await Mina.transaction(deployerAddress, () => {
  dexApp.initTokenAddresses(tokenX.address, tokenY.address);
});

await init_dex_txn.prove();
await init_dex_txn.sign([deployerAccount]).send();

console.log("initialised tokens in a dex");

console.log("supplying liquidity -- base");

let txBaseX = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenX(UInt64.from(10));
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
