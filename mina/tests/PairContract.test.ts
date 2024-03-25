import { PrivateKey, UInt64, MerkleMap, PublicKey, SmartContract } from "o1js";

import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
  mintLiquidityToken,
} from "../src/pair/pair.js";
import { deployPairMint, setOwner, setAdmin } from "../src/pair/pairMint.js";
import { startLocalBlockchainClient } from "../src/helpers/client.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
} from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";
import { PairMintContract } from "../src/PairContractMint.js";
import { PairContract, PersonalPairBalance } from "../src/PairContract.js";

describe("Pair Contract", () => {
  const testAccounts = startLocalBlockchainClient();

  const map = new MerkleMap();

  const deployerAccount = testAccounts[0].privateKey;
  const deployerAddress = testAccounts[0].publicKey;

  const firstUserAccount = testAccounts[1].privateKey;
  const firstUserAddress = testAccounts[1].publicKey;

  const secondUserAccount = testAccounts[2].privateKey;
  const secondUserAddress = testAccounts[2].publicKey;

  const thirdUserAccount = testAccounts[3].privateKey;
  const thirdUserAddress = testAccounts[3].publicKey;

  const adminAccount = testAccounts[4].privateKey;
  const adminAddress = testAccounts[4].publicKey;

  const adminMintAccount = testAccounts[5].privateKey;
  const adminMintAddress = testAccounts[5].publicKey;

  const tokenXPrivateKey: PrivateKey = PrivateKey.random();
  const tokenYPrivateKey: PrivateKey = PrivateKey.random();

  const tokenX: BasicTokenContract = new BasicTokenContract(
    tokenXPrivateKey.toPublicKey()
  );
  const tokenY: BasicTokenContract = new BasicTokenContract(
    tokenYPrivateKey.toPublicKey()
  );

  const pairPK: PrivateKey = PrivateKey.random();
  const pairPub: PublicKey = pairPK.toPublicKey();
  const pairSC: PairContract = new PairContract(pairPub);

  const pairMintPK: PrivateKey = PrivateKey.random();
  const pairMintSC: PairMintContract = new PairMintContract(
    pairMintPK.toPublicKey()
  );

  let firstUserBalance: PersonalPairBalance;

  it("deployed 2 tokens", async () => {
    await deploy2Tokens(deployerAccount, tokenXPrivateKey, tokenYPrivateKey);
  });

  it("created and minted 2 tokens", async () => {
    await mintToken(deployerAccount, deployerAddress, tokenX);
    await mintToken(deployerAccount, deployerAddress, tokenY);
  });

  it("deployed pair", async () => {
    await deployPair(deployerAccount, pairPK, pairSC);
  });

  it("inited 2 tokens into pair smart contract", async () => {
    await init2TokensSmartContract(
      deployerAccount,
      tokenX,
      tokenY,
      pairSC.address
    );
  });

  it("initialised tokens in a pair", async () => {
    await initPairTokens(
      pairPK,
      pairSC,
      tokenX.address,
      tokenY.address,
      adminAddress
    );
  });

  it("deploying pair minting contract", async () => {
    await deployPairMint(deployerAccount, pairMintPK, pairMintSC);
  });

  it("deploying pair minting contract", async () => {
    await init2TokensSmartContract(
      deployerAccount,
      tokenX,
      tokenY,
      pairMintSC.address
    );
  });

  it("setting pair contract as an owner for pair mint contract", async () => {
    await setOwner(pairMintPK, pairPub, pairMintSC);
    expect(pairMintSC.owner.get().toBase58()).toBe(pairPub.toBase58());
  });

  it("setting an admin for pair mint contract", async () => {
    await setAdmin(pairPK, adminMintAddress, pairMintSC);
    expect(pairMintSC.admin.get().toBase58()).toBe(adminMintAddress.toBase58());
  });

  it("creating a user", async () => {
    firstUserBalance = await createUser(
      adminAccount,
      firstUserAccount,
      map,
      0,
      pairSC
    );
  });

  it("creating another user - user 2", async () => {
    await createUser(adminAccount, secondUserAccount, map, 1, pairSC);
  });

  it("creating another user - user 3", async () => {
    await createUser(adminAccount, thirdUserAccount, map, 2, pairSC);
  });

  it("supplying Y", async () => {
    const dy = UInt64.one;
    firstUserBalance = await supplyY(
      adminAccount,
      adminMintAccount,
      deployerAccount,
      map,
      firstUserBalance,
      dy,
      pairSC,
      pairMintSC.address
    );
    expect(pairMintSC.reservesY.get().toString()).toBe("1");
  });

  it("supplying more Y", async () => {
    const dy = UInt64.one;
    firstUserBalance = await supplyY(
      adminAccount,
      adminMintAccount,
      deployerAccount,
      map,
      firstUserBalance,
      dy,
      pairSC,
      pairMintSC.address
    );
    expect(pairMintSC.reservesY.get().toString()).toBe("2");
  });

  it("supplying X", async () => {
    const dx = UInt64.one;
    firstUserBalance = await supplyX(
      adminAccount,
      adminMintAccount,
      deployerAccount,
      map,
      firstUserBalance,
      dx,
      pairSC,
      pairMintSC.address
    );
    expect(pairMintSC.reservesX.get().toString()).toBe("1");
  });

  it("minting liquidity", async () => {
    const dl = UInt64.one;
    await mintLiquidityToken(
      adminAccount,
      adminMintAccount,
      deployerAccount,
      map,
      firstUserBalance,
      dl,
      pairSC,
      pairMintSC.address
    );
    expect(pairMintSC.reservesX.get().toString()).toBe("1");
  });
});
