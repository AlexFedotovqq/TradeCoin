import {
  PrivateKey,
  UInt64,
  MerkleMap,
  PublicKey,
  Signature,
  MerkleMapWitness,
} from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import {
  deployPair,
  initPairTokens,
  createUser,
  supplyX,
  supplyY,
  mintLiquidityToken,
  burnLiquidityToken,
  getTxDetailsPrivate,
  getSignatureAdminPairMintContract,
  getSignatureAdminPairContract,
  getWitnessFromBalanceId,
  TxPairContractDetailsPrivate,
} from "../src/pair/pair.js";
import { deployPairMint } from "../src/pair/pairMint.js";
import { PersonalPairBalance } from "../src/pair/PersonalPairBalance.js";
import {
  deploy2Tokens,
  init2TokensSmartContract,
  mintToken,
  transferToken,
} from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";
import { PairMintContract } from "../src/PairContractMint.js";
import { PairContract } from "../src/PairContract.js";
import { getTokenIdBalance } from "../src/index.js";
import {
  TxTokenPairMintContract,
  getTxTokenPairMintContractStruct,
} from "../src/pair/TxTokenPairMintContract.js";
import {
  TxTokenPairContract,
  getTxTokenPairContractStruct,
} from "../src/pair/TxTokenPair.js";

describe("Pair Contract", () => {
  const testAccounts = startLocalBlockchainClient();

  const map: MerkleMap = new MerkleMap();

  const tokensAdminAccount = testAccounts[0].privateKey;
  const tokensAdminAddress = testAccounts[0].publicKey;

  const pkFirstUser = testAccounts[1].privateKey;
  const pubFirstUser = testAccounts[1].publicKey;

  const secondUserAccount = testAccounts[2].privateKey;
  const secondUserAddress = testAccounts[2].publicKey;

  const thirdUserAccount = testAccounts[3].privateKey;
  const thirdUserAddress = testAccounts[3].publicKey;

  const pkAdmin = testAccounts[4].privateKey;
  const pubAdmin = testAccounts[4].publicKey;

  const pkAdminMint = testAccounts[5].privateKey;
  const pubAdminMint = testAccounts[5].publicKey;

  const tokenXPrivateKey: PrivateKey = PrivateKey.random();
  const tokenXPub: PublicKey = tokenXPrivateKey.toPublicKey();
  const tokenYPrivateKey: PrivateKey = PrivateKey.random();
  const tokenYPub: PublicKey = tokenYPrivateKey.toPublicKey();
  const tokenX: BasicTokenContract = new BasicTokenContract(tokenXPub);
  const tokenY: BasicTokenContract = new BasicTokenContract(tokenYPub);

  const pkPair: PrivateKey = PrivateKey.random();
  const pubPair: PublicKey = pkPair.toPublicKey();
  const scPair: PairContract = new PairContract(pubPair);

  const pkPairMint: PrivateKey = PrivateKey.random();
  const pubPairMint: PublicKey = pkPairMint.toPublicKey();
  const scPairMint: PairMintContract = new PairMintContract(pubPairMint);

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
    await transferToken(tokensAdminAccount, pubFirstUser, tokenX, sendAmount);
    await transferToken(tokensAdminAccount, pubFirstUser, tokenY, sendAmount);
    const user1BalanceX: string = await getTokenIdBalance(
      pubFirstUser,
      tokenX.deriveTokenId()
    );
    const user1BalanceY: string = await getTokenIdBalance(
      pubFirstUser,
      tokenY.deriveTokenId()
    );
    expect(user1BalanceX).toBe("100000");
    expect(user1BalanceY).toBe("100000");
  });

  it("deployed pair", async () => {
    await deployPair(pkAdmin, pkPair, scPair);
    expect(scPair.admin.get().toBase58()).toBe(pubAdmin.toBase58());
  });

  it("inited 2 tokens into a pair smart contract", async () => {
    await init2TokensSmartContract(tokensAdminAccount, tokenX, tokenY, pubPair);
  });

  it("initialised tokens in a pair smart contract", async () => {
    await initPairTokens(pkAdmin, scPair, tokenX.address, tokenY.address);
  });

  it("fails to initialise tokens in a pair smart contract", async () => {
    try {
      await initPairTokens(pkAdmin, scPair, tokenX.address, tokenY.address);
    } catch (e) {
      expect(String(e).substring(0, 28)).toBe("Error: tokenX is initialised");
    }
  });

  it("deploying pair minting contract and initing tokens", async () => {
    await deployPairMint(pkAdminMint, pkPairMint, scPairMint);
    await init2TokensSmartContract(
      tokensAdminAccount,
      tokenX,
      tokenY,
      pubPairMint
    );
    expect(scPairMint.admin.get().toBase58()).toBe(pubAdminMint.toBase58());
  });

  it("creates a user - user 1", async () => {
    firstUserBalance = await createUser(pkAdmin, pkFirstUser, map, 0, scPair);
    expect(scPair.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creates a user - user 2", async () => {
    await createUser(pkAdmin, secondUserAccount, map, 1, scPair);
    expect(scPair.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("creates a user - user 3", async () => {
    await createUser(pkAdmin, thirdUserAccount, map, 2, scPair);
    expect(scPair.root.get().toString()).toBe(map.getRoot().toString());
  });

  it("supplies token Y - user 1", async () => {
    const dy: UInt64 = UInt64.one;
    firstUserBalance = await supplyY(
      pkAdmin,
      pkAdminMint,
      pkFirstUser,
      firstUserBalance,
      map,
      dy,
      scPair,
      pubPairMint
    );
    expect(scPairMint.reservesY.get().toString()).toBe("1");
  });

  it("supplies token Y to user 1 from tokensAdmin", async () => {
    const dy: UInt64 = UInt64.from(49);
    firstUserBalance = await supplyY(
      pkAdmin,
      pkAdminMint,
      tokensAdminAccount,
      firstUserBalance,
      map,
      dy,
      scPair,
      pubPairMint
    );
    expect(scPairMint.reservesY.get().toString()).toBe("50");
  });

  it("supplies token X", async () => {
    const dx: UInt64 = UInt64.from(50);
    firstUserBalance = await supplyX(
      pkAdmin,
      pkAdminMint,
      tokensAdminAccount,
      firstUserBalance,
      map,
      dx,
      scPair,
      pubPairMint
    );
    expect(scPairMint.reservesX.get().toString()).toBe("50");
  });

  it("mints initial liquidity", async () => {
    const dl: UInt64 = UInt64.from(50);
    const dx: UInt64 = dl;
    const dy: UInt64 = dl;
    const txPairContractDetailsPrivate: TxPairContractDetailsPrivate =
      getTxDetailsPrivate(pkFirstUser, scPair);

    const txToken: TxTokenPairMintContract = getTxTokenPairMintContractStruct(
      pubFirstUser,
      dl,
      pubPairMint
    );
    const sigAdminPairMintContract: Signature =
      getSignatureAdminPairMintContract(pkAdminMint, txToken);

    const sigAdminPairContract: Signature = getSignatureAdminPairContract(
      pkAdmin,
      firstUserBalance
    );

    const witness: MerkleMapWitness = getWitnessFromBalanceId(
      firstUserBalance.id,
      map
    );

    const txTokenPairContractStruct: TxTokenPairContract =
      getTxTokenPairContractStruct(
        sigAdminPairContract,
        witness,
        firstUserBalance,
        dl,
        pubPairMint
      );

    await mintLiquidityToken(
      txPairContractDetailsPrivate,
      sigAdminPairMintContract,
      txTokenPairContractStruct
    );
    expect(scPairMint.totalSupplyLP.get().toString()).toBe("50");
    expect(scPairMint.reservesX.get().toString()).toBe("50");
    expect(scPairMint.reservesY.get().toString()).toBe("50");

    firstUserBalance.supply(dx, dy);
    map.set(firstUserBalance.id, firstUserBalance.hash());
    expect(map.getRoot().toString()).toBe(scPair.root.get().toString());
  });

  it("burns liquidity", async () => {
    const dl: UInt64 = UInt64.from(50);

    const dx: UInt64 = dl;
    const dy: UInt64 = dl;
    const txPairContractDetailsPrivate: TxPairContractDetailsPrivate =
      getTxDetailsPrivate(pkFirstUser, scPair);

    const txToken: TxTokenPairMintContract = getTxTokenPairMintContractStruct(
      pubFirstUser,
      dl,
      pubPairMint
    );
    const sigAdminPairMintContract: Signature =
      getSignatureAdminPairMintContract(pkAdminMint, txToken);

    const sigAdminPairContract: Signature = getSignatureAdminPairContract(
      pkAdmin,
      firstUserBalance
    );

    const witness: MerkleMapWitness = getWitnessFromBalanceId(
      firstUserBalance.id,
      map
    );

    const txTokenPairContractStruct: TxTokenPairContract =
      getTxTokenPairContractStruct(
        sigAdminPairContract,
        witness,
        firstUserBalance,
        dl,
        pubPairMint
      );

    await burnLiquidityToken(
      txPairContractDetailsPrivate,
      sigAdminPairMintContract,
      txTokenPairContractStruct
    );
    expect(scPairMint.totalSupplyLP.get().toString()).toBe("0");

    firstUserBalance.burn(dx, dy);
    map.set(firstUserBalance.id, firstUserBalance.hash());
    expect(map.getRoot().toString()).toBe(scPair.root.get().toString());
  });
});
