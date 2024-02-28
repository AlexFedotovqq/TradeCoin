import {
  Mina,
  PrivateKey,
  AccountUpdate,
  UInt64,
  MerkleMap,
  Field,
  Signature,
  Poseidon,
} from "o1js";

import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
} from "./pair/pair.js";
import { startLocalBlockchainClient } from "./helpers/client.js";
import { log2TokensAddressBalance } from "./helpers/logs.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
} from "./token/token.js";

const testAccounts = await startLocalBlockchainClient();

const map = new MerkleMap();

const deployerAccount = testAccounts[0].privateKey;
const deployerAddress = testAccounts[0].publicKey;

const secondAccount = testAccounts[1].privateKey;
const thirdAccount = testAccounts[2].privateKey;

const zkAppPrivateKey = PrivateKey.random();
const zkPairAppAddress = zkAppPrivateKey.toPublicKey();

const {
  tokenX: tokenX,
  tokenY: tokenY,
  tokenXPK: TokenAddressXPrivateKey,
  tokenYPK: TokenAddressYPrivateKey,
} = await deploy2Tokens(deployerAddress, deployerAccount);

console.log("deployed 2 Tokens");

await mintToken(
  TokenAddressXPrivateKey,
  deployerAccount,
  deployerAddress,
  tokenX
);

await mintToken(
  TokenAddressYPrivateKey,
  deployerAccount,
  deployerAddress,
  tokenY
);

console.log("created and minted 2 tokens");

log2TokensAddressBalance(deployerAddress, tokenX, tokenY);

await init2TokensSmartContract(
  deployerAccount,
  tokenX,
  tokenY,
  zkPairAppAddress
);

console.log("inited 2 tokens into smart contracts");

const { pairSmartContract: pairSmartContract } = await deployPair(
  zkAppPrivateKey,
  deployerAccount
);

console.log("deployed pair");

await initPairTokens(
  zkAppPrivateKey,
  deployerAccount,
  tokenX.address,
  tokenY.address,
  pairSmartContract
);

console.log("initialised tokens in a pair");

console.log("creating a user");

let firstUserBalance = await createUser(
  map,
  0,
  pairSmartContract,
  deployerAccount
);

console.log("created a user");

console.log("creating another user");

await createUser(map, 1, pairSmartContract, secondAccount);

console.log("created a user");

console.log("creating another user - user 3");

await createUser(map, 2, pairSmartContract, thirdAccount);

console.log("created a third user");

console.log("supplying Y");

firstUserBalance = await supplyY(
  map,
  firstUserBalance,
  UInt64.one,
  pairSmartContract,
  deployerAccount
);

console.log("supplied Y");

console.log("supplying more Y");

firstUserBalance = await supplyY(
  map,
  firstUserBalance,
  UInt64.one,
  pairSmartContract,
  deployerAccount
);

console.log("supplied Y");

console.log("supplying X");

firstUserBalance = await supplyX(
  map,
  firstUserBalance,
  UInt64.one,
  pairSmartContract,
  deployerAccount
);

console.log("supplied X");

/* 


const supplyLiqTxn = await Mina.transaction(deployerAddress, () => {
  AccountUpdate.fundNewAccount(deployerAddress);
  pairSmartContract.mintLiquidityToken(UInt64.one);
});

await supplyLiqTxn.prove();
await supplyLiqTxn.sign([deployerAccount]).send();
 */
