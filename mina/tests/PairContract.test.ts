import { PrivateKey, UInt64, MerkleMap, PublicKey } from "o1js";

import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
  mintLiquidityToken,
  burnLiquidityToken,
} from "../src/pair/pair.js";
import { deployPairMint } from "../src/pair/pairMint.js";
import { startLocalBlockchainClient } from "../src/helpers/client.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
  transferToken,
} from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";
import { PairMintContract } from "../src/PairContractMint.js";
import { PairContract, PersonalPairBalance } from "../src/PairContract.js";
import { getTokenIdBalance } from "../src/index.js";

describe("Pair Contract", () => {
  const testAccounts = startLocalBlockchainClient();

  const map: MerkleMap = new MerkleMap();

  const tokensAdminAccount = testAccounts[0].privateKey;
  const tokensAdminAddress = testAccounts[0].publicKey;

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
  const tokenXPub: PublicKey = tokenXPrivateKey.toPublicKey();
  const tokenYPrivateKey: PrivateKey = PrivateKey.random();
  const tokenYPub: PublicKey = tokenYPrivateKey.toPublicKey();
  const tokenX: BasicTokenContract = new BasicTokenContract(tokenXPub);
  const tokenY: BasicTokenContract = new BasicTokenContract(tokenYPub);

  const pairPK: PrivateKey = PrivateKey.random();
  const pairPub: PublicKey = pairPK.toPublicKey();
  const pairContract: PairContract = new PairContract(pairPub);

  const pairMintPK: PrivateKey = PrivateKey.random();
  const pairMintPub: PublicKey = pairMintPK.toPublicKey();
  const pairMintSC: PairMintContract = new PairMintContract(pairMintPub);

  let firstUserBalance: PersonalPairBalance;

  it("deployed and minted tokens", async () => {
    await deploy2Tokens(tokensAdminAccount, tokenXPrivateKey, tokenYPrivateKey);
    await mintToken(tokensAdminAccount, tokensAdminAddress, tokenX);
    await mintToken(tokensAdminAccount, tokensAdminAddress, tokenY);
    const balanceX: string = await getTokenIdBalance(
      tokensAdminAddress,
      tokenX.deriveTokenId()
    );
    const balanceY: string = await getTokenIdBalance(
      tokensAdminAddress,
      tokenX.deriveTokenId()
    );
    expect(balanceX).toBe("100000000000");
    expect(balanceY).toBe("100000000000");

    const sendAmount: UInt64 = UInt64.from(100_000);
    await transferToken(
      tokensAdminAccount,
      firstUserAddress,
      tokenX,
      sendAmount
    );
    await transferToken(
      tokensAdminAccount,
      firstUserAddress,
      tokenY,
      sendAmount
    );
    const user1BalanceX: string = await getTokenIdBalance(
      firstUserAddress,
      tokenX.deriveTokenId()
    );
    const user1BalanceY: string = await getTokenIdBalance(
      firstUserAddress,
      tokenY.deriveTokenId()
    );
    expect(user1BalanceX).toBe("100000");
    expect(user1BalanceY).toBe("100000");
  });

  it("deployed pair", async () => {
    await deployPair(adminAccount, pairPK, pairContract);
    expect(pairContract.admin.get().toBase58()).toBe(adminAddress.toBase58());
  });

  it("inited 2 tokens into a pair smart contract", async () => {
    await init2TokensSmartContract(
      tokensAdminAccount,
      tokenX,
      tokenY,
      pairContract.address
    );
  });

  it("initialised tokens in a pair smart contract", async () => {
    await initPairTokens(
      adminAccount,
      pairContract,
      tokenX.address,
      tokenY.address
    );
  });

  it("fails to initialise tokens in a pair smart contract", async () => {
    try {
      await initPairTokens(
        adminAccount,
        pairContract,
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
      tokensAdminAccount,
      tokenX,
      tokenY,
      pairMintSC.address
    );
    expect(pairMintSC.admin.get().toBase58()).toBe(adminMintAddress.toBase58());
  });

  it("creates a user - user 1", async () => {
    firstUserBalance = await createUser(
      adminAccount,
      firstUserAccount,
      map,
      0,
      pairContract
    );
    expect(pairContract.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creates a user - user 2", async () => {
    await createUser(adminAccount, secondUserAccount, map, 1, pairContract);
    expect(pairContract.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creates a user - user 3", async () => {
    await createUser(adminAccount, thirdUserAccount, map, 2, pairContract);
    expect(pairContract.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("supplies token Y - user 1", async () => {
    const dy: UInt64 = UInt64.one;
    firstUserBalance = await supplyY(
      adminAccount,
      adminMintAccount,
      firstUserAccount,
      map,
      firstUserBalance,
      dy,
      pairContract,
      pairMintSC.address
    );
    expect(pairMintSC.reservesY.get().toString()).toBe("1");
  });

  it("supplies token Y to user 1 from tokensAdmin", async () => {
    const dy: UInt64 = UInt64.from(49);
    firstUserBalance = await supplyY(
      adminAccount,
      adminMintAccount,
      tokensAdminAccount,
      map,
      firstUserBalance,
      dy,
      pairContract,
      pairMintSC.address
    );
    expect(pairMintSC.reservesY.get().toString()).toBe("50");
  });

  it("supplies token X", async () => {
    const dx: UInt64 = UInt64.from(50);
    firstUserBalance = await supplyX(
      adminAccount,
      adminMintAccount,
      tokensAdminAccount,
      map,
      firstUserBalance,
      dx,
      pairContract,
      pairMintSC.address
    );
    expect(pairMintSC.reservesX.get().toString()).toBe("50");
  });

  it("mints liquidity", async () => {
    const dl: UInt64 = UInt64.from(50);
    await mintLiquidityToken(
      adminAccount,
      adminMintAccount,
      tokensAdminAccount,
      map,
      firstUserBalance,
      dl,
      pairContract,
      pairMintSC.address
    );
    expect(pairMintSC.reservesX.get().toString()).toBe("50");
    expect(pairMintSC.reservesY.get().toString()).toBe("50");
  });

  /* it("swap", async () => {
    const dl: UInt64 = UInt64.from(50);
  }); */

  /* it("burns liquidity", async () => {
    const dl: UInt64 = UInt64.from(50);
    await burnLiquidityToken(
      adminAccount,
      adminMintAccount,
      tokensAdminAccount,
      map,
      firstUserBalance,
      dl,
      pairContract,
      pairMintSC.address
    );
    expect(pairMintSC.reservesX.get().toString()).toBe("0");
  }); */
});
