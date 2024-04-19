import { PublicKey, PrivateKey, Field, MerkleTree } from "o1js";

import {
  deployPair,
  TxPairContractDetailsPkSender,
  getTxDetailsPrivate,
} from "../src/pair/pair.js";
import { deployPairMint } from "../src/pair/pairMint.js";
import { createPool, deployDex, createPoolIdStruct } from "../src/dex/dex.js";
import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { deploy2Tokens, mintToken } from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";
import { PairMintContract } from "../src/PairContractMint.js";
import { PairContract } from "../src/PairContract.js";
import { Dex } from "../src/DexContract.js";

describe("Dex Contract", () => {
  const testAccounts = startLocalBlockchainClient();

  const map = new MerkleTree(6);

  const deployerAccount = testAccounts[0].privateKey;
  const deployerAddress = testAccounts[0].publicKey;

  const pkDexAdmin = testAccounts[1].privateKey;
  const pubDexAdmin = testAccounts[1].publicKey;

  const pkPairAdmin = testAccounts[2].privateKey;
  const pubPairAdmin = testAccounts[2].publicKey;

  const pkPairMintAdmin = testAccounts[3].privateKey;
  const pubPairMintAdmin = testAccounts[3].publicKey;

  const pkTokenX: PrivateKey = PrivateKey.random();
  const pkTokenY: PrivateKey = PrivateKey.random();

  const tokenX: BasicTokenContract = new BasicTokenContract(
    pkTokenX.toPublicKey()
  );
  const tokenY: BasicTokenContract = new BasicTokenContract(
    pkTokenY.toPublicKey()
  );

  const zkDexAppPrivateKey = PrivateKey.random();
  const zkDexAppAddress = zkDexAppPrivateKey.toPublicKey();
  const dexApp = new Dex(zkDexAppAddress);

  const pkPair: PrivateKey = PrivateKey.random();
  const pubPair: PublicKey = pkPair.toPublicKey();
  const scPair: PairContract = new PairContract(pubPair);

  const pairMintPK: PrivateKey = PrivateKey.random();
  const pairMintPub: PublicKey = pairMintPK.toPublicKey();
  const pairMintSC: PairMintContract = new PairMintContract(pairMintPub);

  it("deployed and minted 2 tokens", async () => {
    await deploy2Tokens(deployerAccount, pkTokenX, pkTokenY);
    await mintToken(deployerAccount, deployerAddress, tokenX);
    await mintToken(deployerAccount, deployerAddress, tokenY);
  });

  it("deployed pair contract", async () => {
    const txPairContractDetailsPkSender: TxPairContractDetailsPkSender =
      getTxDetailsPrivate(pkPairAdmin, scPair);
    await deployPair(pkPair, txPairContractDetailsPkSender);
    expect(scPair.admin.get().toBase58()).toBe(pubPairAdmin.toBase58());
  });

  it("deployed pair mint contract", async () => {
    await deployPairMint(pkPairMintAdmin, pairMintPK, pairMintSC);
    expect(scPair.admin.get().toBase58()).toBe(pubPairAdmin.toBase58());
  });

  it("deployed dex", async () => {
    await deployDex(zkDexAppPrivateKey, pkDexAdmin, dexApp);
    expect(dexApp.admin.get().toBase58()).toBe(pubDexAdmin.toBase58());
  });

  it("creating new pool", async () => {
    const firstId = Field(0n);
    const poolIdStruct = createPoolIdStruct(pubPair, pairMintPub, firstId);
    await createPool(pkDexAdmin, deployerAccount, dexApp, map, poolIdStruct);
    expect(dexApp.root.get().toString()).toBe(map.getRoot().toString());
  });
});
