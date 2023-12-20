import { BasicTokenContract } from "./BasicTokenContract.js";
import { Dex } from "./DexContract.js";
import { Mina, PrivateKey, AccountUpdate, UInt64, Signature } from "o1js";

function logOutBalances() {
  console.log(
    "deployerAddress tokenX tokens:",
    Mina.getBalance(deployerAddress, tokenX.token.id).value.toBigInt()
  );

  console.log(
    "zkDexAppAddress tokenX tokens:",
    Mina.getBalance(zkDexAppAddress, tokenX.token.id).value.toBigInt()
  );

  console.log(
    "deployerAddress tokenY tokens:",
    Mina.getBalance(deployerAddress, tokenY.token.id).value.toBigInt()
  );

  console.log(
    "zkDexAppAddress tokenY tokens:",
    Mina.getBalance(zkDexAppAddress, tokenY.token.id).value.toBigInt()
  );

  console.log(
    "deployer dexApp tokens:",
    Mina.getBalance(deployerAddress, dexApp.token.id).value.toBigInt()
  );

  console.log("total supply", dexApp.totalSupply.get().value.toBigInt());
}

const proofsEnabled = false;
const enforceTransactionLimits = true;

const Local = Mina.LocalBlockchain({
  proofsEnabled,
  enforceTransactionLimits,
});

Mina.setActiveInstance(Local);

const deployerAccount = Local.testAccounts[0].privateKey;
const deployerAddress = Local.testAccounts[0].publicKey;

console.log("deployerAccount: " + deployerAddress.toBase58());

const TokenAddressXPrivateKey = PrivateKey.random();
const TokenAddressX = TokenAddressXPrivateKey.toPublicKey();

console.log("TokenAddressX: " + TokenAddressX.toBase58());

const TokenAddressYPrivateKey = PrivateKey.random();
const TokenAddressY = TokenAddressYPrivateKey.toPublicKey();

console.log("TokenAddressY: " + TokenAddressY.toBase58());

const zkDexAppPrivateKey = PrivateKey.random();
const zkDexAppAddress = zkDexAppPrivateKey.toPublicKey();

console.log("zkDexAppAddress: " + zkDexAppAddress.toBase58());

let verificationKey: any;

if (proofsEnabled) {
  ({ verificationKey } = await BasicTokenContract.compile());
}

console.log("compiled");

const tokenX = new BasicTokenContract(TokenAddressX);
const tokenY = new BasicTokenContract(TokenAddressY);

const deploy_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress, 2);

  tokenX.deploy({ verificationKey, zkappKey: TokenAddressXPrivateKey });
  tokenY.deploy({ verificationKey, zkappKey: TokenAddressYPrivateKey });
});

await deploy_txn.prove();

await deploy_txn.sign([deployerAccount]).send();

console.log("deployed 2 Tokens");

const mintAmount = UInt64.from(10_000);

const mintSignatureX = Signature.create(
  TokenAddressXPrivateKey,
  mintAmount.toFields().concat(deployerAddress.toFields())
);

const mintSignatureY = Signature.create(
  TokenAddressYPrivateKey,
  mintAmount.toFields().concat(deployerAddress.toFields())
);

const mint_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress, 2);
  tokenX.mint(deployerAddress, mintAmount, mintSignatureX);
  tokenY.mint(deployerAddress, mintAmount, mintSignatureY);
});

await mint_txn.prove();
await mint_txn.sign([deployerAccount]).send();

console.log("minted");

console.log(
  "deployerAddress tokenX tokens:",
  Mina.getBalance(deployerAddress, tokenX.token.id).value.toBigInt()
);
console.log(
  "deployerAddress tokenY tokens:",
  Mina.getBalance(deployerAddress, tokenY.token.id).value.toBigInt()
);

// necessary to initialize tokens for ZkApp
const send_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress, 2);
  tokenX.transfer(deployerAddress, zkDexAppAddress, UInt64.zero);
  tokenY.transfer(deployerAddress, zkDexAppAddress, UInt64.zero);
});

await send_txn.prove();
await send_txn.sign([deployerAccount]).send();

console.log("sent");

if (proofsEnabled) {
  ({ verificationKey } = await Dex.compile());
}
console.log("compiled");

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

console.log(dexApp.tokenX.get().toBase58());
console.log(dexApp.tokenY.get().toBase58());

console.log("supply liquidity -- base");

let txBaseX = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenX(UInt64.from(1));
});

await txBaseX.prove();

await txBaseX.sign([deployerAccount, zkDexAppPrivateKey]).send();

let txBaseY = await Mina.transaction(deployerAddress, () => {
  dexApp.supplyTokenY(UInt64.from(1));
});

await txBaseY.prove();

await txBaseY.sign([deployerAccount]).send();

let txBaseMint = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  dexApp.mintLiquidityToken(UInt64.from(2));
});

await txBaseMint.prove();

await txBaseMint.sign([deployerAccount]).send();

logOutBalances();

// add script for swap

/* console.log("swap");

let txSwap = await Mina.transaction(deployerAddress, () => {
  dexApp.swapXforY(UInt64.from(1));
});

await txSwap.prove();

await txSwap.sign([deployerAccount, zkDexAppPrivateKey]).send();

logOutBalances(); */

console.log("burn liquidity");

let txBurn = await Mina.transaction(deployerAddress, () => {
  dexApp.redeem(UInt64.from(2));
});

await txBurn.prove();

await txBurn.sign([deployerAccount, zkDexAppPrivateKey]).send();

logOutBalances();
