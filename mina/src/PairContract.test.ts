import { PrivateKey, UInt64, MerkleMap } from "o1js";

import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
  mintLiquidityToken,
} from "./pair/pair.js";
import { deployPairMint, initOwner } from "./pair/pairMint.js";
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
const secondAddress = testAccounts[1].publicKey;

const thirdAccount = testAccounts[2].privateKey;
const thirdAddress = testAccounts[2].publicKey;

const { tokenX: tokenX, tokenY: tokenY } = await deploy2Tokens(deployerAccount);

console.log("deployed 2 Tokens");

await mintToken(deployerAccount, deployerAddress, tokenX);

await mintToken(deployerAccount, deployerAddress, tokenY);

console.log("created and minted 2 tokens");

log2TokensAddressBalance(deployerAddress, tokenX, tokenY);

const {
  pairSmartContract: pairSmartContract,
  zkAppPrivateKey: zkAppPrivateKey,
  zkAppPub: zkPairAppAddress,
} = await deployPair(deployerAccount);

console.log("deployed pair");

await init2TokensSmartContract(
  deployerAccount,
  tokenX,
  tokenY,
  zkPairAppAddress
);

console.log("inited 2 tokens into smart contracts");

await initPairTokens(
  zkAppPrivateKey,
  deployerAccount,
  tokenX.address,
  tokenY.address
);

console.log("initialised tokens in a pair");

console.log("deploying pair minting contract");

const zkPairMintPrivateKey = PrivateKey.random();

const { pairSmartContractMint: pairSmartContractMint } = await deployPairMint(
  zkPairMintPrivateKey,
  deployerAccount
);
console.log("deployed pair minting contract");

await init2TokensSmartContract(
  deployerAccount,
  tokenX,
  tokenY,
  pairSmartContractMint.address
);

console.log("initialised tokens in a pairMint");

await initOwner(zkPairMintPrivateKey, zkPairAppAddress, pairSmartContractMint);

console.log(pairSmartContractMint.owner.get().toBase58());

console.log("creating a user");

let firstUserBalance = await createUser(
  map,
  0,
  pairSmartContract,
  deployerAccount
);

console.log("created a user");

console.log("creating another user - user 2");

await createUser(map, 1, pairSmartContract, secondAccount);

console.log("created a second user", secondAddress.toBase58());

console.log("creating another user - user 3");

await createUser(map, 2, pairSmartContract, thirdAccount);

console.log("created a third user", thirdAddress.toBase58());

console.log("supplying Y");

const dy = UInt64.one;

firstUserBalance = await supplyY(
  map,
  firstUserBalance,
  dy,
  pairSmartContract,
  pairSmartContractMint.address,
  deployerAccount
);

console.log("supplied Y");

console.log("reserves Y", pairSmartContractMint.reservesY.get().toBigInt());

console.log("supplying more Y");

firstUserBalance = await supplyY(
  map,
  firstUserBalance,
  dy,
  pairSmartContract,
  pairSmartContractMint.address,
  deployerAccount
);

console.log("supplied Y");

console.log("reserves Y", pairSmartContractMint.reservesY.get().toBigInt());

console.log("supplying X");

const dx = UInt64.one;

firstUserBalance = await supplyX(
  map,
  firstUserBalance,
  dx,
  pairSmartContract,
  pairSmartContractMint.address,
  deployerAccount
);

console.log("supplied X");

console.log("reserves X", pairSmartContractMint.reservesX.get().toBigInt());

console.log("minting liquidity");

await mintLiquidityToken(
  map,
  firstUserBalance,
  UInt64.one,
  pairSmartContract,
  deployerAccount,
  pairSmartContractMint.address
);
console.log("minted liquidity");
