import { logTokenBalance, logTokenInfo } from "./helpers/logs.js";
import {
  deployToken,
  getBalance,
  mintToken,
  transferToken,
} from "./token/token.js";

import { Mina } from "o1js";

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

const { contract, zkAppPrivateKey } = await deployToken(
  deployerAddress,
  deployerAccount,
  proofsEnabled
);

console.log("deployed");

await mintToken(zkAppPrivateKey, deployerAccount, contract);

console.log("minted");

logTokenInfo(contract);

await transferToken(zkAppPrivateKey, deployerAccount, contract);

console.log("sent");

logTokenBalance(contract, deployerAddress);

await getBalance(deployerAccount, deployerAddress, contract);

console.log("got balance");

await getBalance(deployerAccount, deployerAddress1, contract);

console.log("got balance 2");

await getBalance(deployerAccount1, deployerAddress, contract);

console.log("got balance 3");

await getBalance(deployerAccount2, deployerAddress3, contract);

console.log("got balance 4");

// add tests to a smart contract
