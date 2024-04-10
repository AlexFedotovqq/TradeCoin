import { PrivateKey, UInt64, MerkleMap, PublicKey } from "o1js";

import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
  mintLiquidityToken,
} from "../src/pair/pair.js";
import { deployPairMint } from "../src/pair/pairMint.js";
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

  const map: MerkleMap = new MerkleMap();

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

  it("deployed and minted tokens", async () => {
    await deploy2Tokens(deployerAccount, tokenXPrivateKey, tokenYPrivateKey);
    await mintToken(deployerAccount, deployerAddress, tokenX);
    await mintToken(deployerAccount, deployerAddress, tokenY);
  });

  it("deployed pair", async () => {
    await deployPair(adminAccount, pairPK, pairSC);
    expect(pairSC.admin.get().toBase58()).toBe(adminAddress.toBase58());
  });

  it("inited 2 tokens into a pair smart contract", async () => {
    await init2TokensSmartContract(
      deployerAccount,
      tokenX,
      tokenY,
      pairSC.address
    );
  });

  it("initialised tokens in a pair smart contract", async () => {
    await initPairTokens(adminAccount, pairSC, tokenX.address, tokenY.address);
  });

  it("fails to initialise tokens in a pair smart contract", async () => {
    try {
      await initPairTokens(
        adminAccount,
        pairSC,
        tokenX.address,
        tokenY.address
      );
    } catch (e) {
      expect(String(e).substring(0, 28)).toBe("Error: tokenX is initialised");
    }
  });

  it("deploying pair minting contract and initing tokens", async () => {
    await deployPairMint(adminMintAccount, pairMintPK, pairMintSC);
    await init2TokensSmartContract(
      deployerAccount,
      tokenX,
      tokenY,
      pairMintSC.address
    );
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
    expect(pairSC.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creating another user - user 2", async () => {
    await createUser(adminAccount, secondUserAccount, map, 1, pairSC);
    expect(pairSC.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creating another user - user 3", async () => {
    await createUser(adminAccount, thirdUserAccount, map, 2, pairSC);
    expect(pairSC.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("supplying Y", async () => {
    const dy: UInt64 = UInt64.one;
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
    const dy: UInt64 = UInt64.one;
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
    const dx: UInt64 = UInt64.one;
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
    const dl: UInt64 = UInt64.one;
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
