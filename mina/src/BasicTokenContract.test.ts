import { startLocalBlockchainClient } from "./helpers/client.js";
import { logTokenBalance, logTokenInfo } from "./helpers/logs.js";
import {
  deployToken,
  getBalance,
  mintToken,
  transferToken,
} from "./token/token.js";

const proofsEnabled = false;

const testAccounts = await startLocalBlockchainClient(proofsEnabled);

const deployerAccount = testAccounts[0].privateKey;
const deployerAddress = testAccounts[0].publicKey;

const deployerAccount1 = testAccounts[1].privateKey;
const deployerAddress1 = testAccounts[1].publicKey;

const deployerAccount2 = testAccounts[2].privateKey;

const deployerAddress3 = testAccounts[3].publicKey;

console.log("deployerAccount: " + deployerAddress.toBase58());

const { contract, zkAppPrivateKey } = await deployToken(
  deployerAccount,
  proofsEnabled
);

console.log("deployed");

await mintToken(
  zkAppPrivateKey,
  deployerAccount,
  zkAppPrivateKey.toPublicKey(),
  contract
);

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
