import {
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64,
  MerkleMap,
  Field,
} from "o1js";

import { deployPair } from "./pair/pair.js";
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

const { pairSmartContract: pairSmartContract } = await deployPair(
  zkDexAppPrivateKey,
  deployerAccount,
  proofsEnabled
);

console.log("deployed pair");

const init_dex_txn = await Mina.transaction(deployerAddress, () => {
  pairSmartContract.initTokenAddresses(tokenX.address, tokenY.address);
});

await init_dex_txn.prove();
await init_dex_txn.sign([deployerAccount]).send();

console.log("initialised tokens in a pair");

const supplyYTxn = await Mina.transaction(deployerAddress, () => {
  pairSmartContract.supplyTokenY(UInt64.one);
});

await supplyYTxn.prove();
await supplyYTxn.sign([deployerAccount]).send();

console.log("supplied Y");

const supplyXTxn = await Mina.transaction(deployerAddress, () => {
  pairSmartContract.supplyTokenX(UInt64.one);
});

await supplyXTxn.prove();
await supplyXTxn.sign([deployerAccount]).send();

console.log("supplied X");

const supplyLiqTxn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  pairSmartContract.mintLiquidityToken(UInt64.one);
});

await supplyLiqTxn.prove();
await supplyLiqTxn.sign([deployerAccount]).send();
