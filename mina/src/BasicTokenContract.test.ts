import { BasicTokenContract } from "./BasicTokenContract.js";
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

const deployerAccount1 = Local.testAccounts[1].privateKey;
const deployerAddress1 = Local.testAccounts[1].publicKey;

const deployerAccount2 = Local.testAccounts[2].privateKey;
const deployerAddress2 = Local.testAccounts[2].publicKey;

const deployerAccount3 = Local.testAccounts[3].privateKey;
const deployerAddress3 = Local.testAccounts[3].publicKey;

console.log("deployerAccount: " + deployerAddress.toBase58());

const zkAppPrivateKey = PrivateKey.random();
const zkAppAddress = zkAppPrivateKey.toPublicKey();

console.log("zkAppAddress: " + zkAppAddress.toBase58());

let verificationKey: any;

if (proofsEnabled) {
  ({ verificationKey } = await BasicTokenContract.compile());
}

console.log("compiled");

const contract = new BasicTokenContract(zkAppAddress);

const deploy_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);

  contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
});

await deploy_txn.prove();

await deploy_txn.sign([deployerAccount]).send();

console.log("deployed");

console.log("minting...");

const mintAmount = UInt64.from(10);

const mintSignature = Signature.create(
  zkAppPrivateKey,
  mintAmount.toFields().concat(zkAppAddress.toFields())
);

const mint_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  contract.mint(zkAppAddress, mintAmount, mintSignature);
});

await mint_txn.prove();
await mint_txn.sign([deployerAccount]).send();

console.log("minted");

console.log(
  "totalAmountInCirculation: " + contract.totalAmountInCirculation.get()
);

console.log(
  "zkapp tokens:",
  Mina.getBalance(zkAppAddress, contract.token.id).value.toBigInt()
);

console.log("sending...");

const sendAmount = UInt64.from(1);

const send_txn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  contract.transfer(zkAppAddress, deployerAddress, sendAmount);
});
await send_txn.prove();
await send_txn.sign([deployerAccount, zkAppPrivateKey]).send();

console.log("sent");

console.log(
  "deployer tokens:",
  Mina.getBalance(deployerAddress, contract.token.id).value.toBigInt()
);

console.log(
  "zkapp tokens:",
  Mina.getBalance(zkAppAddress, contract.token.id).value.toBigInt()
);

const balance_txn = await Mina.transaction(deployerAddress, () => {
  contract.balanceOf(deployerAddress);
});
await balance_txn.prove();
await balance_txn.sign([deployerAccount]).send();

console.log("got balance");

const balance_txn2 = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  contract.balanceOf(deployerAddress1);
});

await balance_txn2.prove();
await balance_txn2.sign([deployerAccount]).send();

console.log("got balance 2 ");

const balance_txn3 = await Mina.transaction(deployerAddress1, () => {
  contract.balanceOf(deployerAddress);
});

await balance_txn3.prove();
await balance_txn3.sign([deployerAccount1]).send();

console.log("got balance 3");

const balance_txn4 = await Mina.transaction(deployerAddress2, () => {
  AccountUpdate.fundNewAccount(deployerAddress2);
  contract.balanceOf(deployerAddress2);
});

await balance_txn4.prove();
await balance_txn4.sign([deployerAccount2]).send();

console.log("got balance 4");

const balance_txn5 = await Mina.transaction(deployerAddress2, () => {
  AccountUpdate.fundNewAccount(deployerAddress2);
  contract.balanceOf(deployerAddress3);
});

await balance_txn5.prove();
await balance_txn5.sign([deployerAccount2]).send();

console.log("got balance 5");
