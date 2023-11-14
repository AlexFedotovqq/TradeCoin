import { BasicTokenContract } from "./BasicTokenContract.js";
import { Dex } from "./DexContract.js";
import { Mina, PrivateKey, AccountUpdate } from "o1js";

const proofsEnabled = false;

const Local = Mina.LocalBlockchain({
  proofsEnabled,
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

if (proofsEnabled) {
  ({ verificationKey } = await Dex.compile());
  console.log(verificationKey.hash);
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
