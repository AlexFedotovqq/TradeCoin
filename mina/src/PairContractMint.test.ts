import { PrivateKey } from "o1js";

import { startLocalBlockchainClient } from "./helpers/client.js";
import { deployPairMint, initOwner, mint } from "./pair/pairMint.js";

const testAccounts = await startLocalBlockchainClient();

const deployerAccount = testAccounts[0].privateKey;
const deployerAddress = testAccounts[0].publicKey;

const secondAccount = testAccounts[1].privateKey;

const zkAppPrivateKey = PrivateKey.random();

const { pairSmartContractMint: pairSmartContract } = await deployPairMint(
  zkAppPrivateKey,
  deployerAccount
);

console.log("deployed pair mint");

console.log(pairSmartContract.totalSupply.get().toBigInt());
console.log(pairSmartContract.owner.get().toBase58());

await initOwner(zkAppPrivateKey, deployerAddress, pairSmartContract);

console.log(pairSmartContract.owner.get().toBase58());

await mint(deployerAccount, pairSmartContract);

try {
  await mint(secondAccount, pairSmartContract);
} catch {
  console.log("fails because not an owner of a contract");
}
