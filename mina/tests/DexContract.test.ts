import { PublicKey, PrivateKey, Field, MerkleTree } from "o1js";

import { deployPair } from "../src/pair/pair.js";
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

  const dexAdminAccount = testAccounts[1].privateKey;
  const dexAdminAddress = testAccounts[1].publicKey;

  const pairAdminAccount = testAccounts[2].privateKey;
  const pairAdminAddress = testAccounts[2].publicKey;

  const pairMintAdminAccount = testAccounts[3].privateKey;
  const pairMintAdminAddress = testAccounts[3].publicKey;

  const tokenXPrivateKey: PrivateKey = PrivateKey.random();
  const tokenYPrivateKey: PrivateKey = PrivateKey.random();

  const tokenX: BasicTokenContract = new BasicTokenContract(
    tokenXPrivateKey.toPublicKey()
  );
  const tokenY: BasicTokenContract = new BasicTokenContract(
    tokenYPrivateKey.toPublicKey()
  );

  const zkDexAppPrivateKey = PrivateKey.random();
  const zkDexAppAddress = zkDexAppPrivateKey.toPublicKey();
  const dexApp = new Dex(zkDexAppAddress);

  const pairPK: PrivateKey = PrivateKey.random();
  const pairPub: PublicKey = pairPK.toPublicKey();
  const pairSC: PairContract = new PairContract(pairPub);

  const pairMintPK: PrivateKey = PrivateKey.random();
  const pairMintPub: PublicKey = pairMintPK.toPublicKey();
  const pairMintSC: PairMintContract = new PairMintContract(pairMintPub);

  it("deployed and minted 2 tokens", async () => {
    await deploy2Tokens(deployerAccount, tokenXPrivateKey, tokenYPrivateKey);
    await mintToken(deployerAccount, deployerAddress, tokenX);
    await mintToken(deployerAccount, deployerAddress, tokenY);
  });

  it("deployed pair contract", async () => {
    await deployPair(pairAdminAccount, pairPK, pairSC);
    expect(pairSC.admin.get().toBase58()).toBe(pairAdminAddress.toBase58());
  });

  it("deployed pair mint contract", async () => {
    await deployPairMint(pairMintAdminAccount, pairMintPK, pairMintSC);
    expect(pairSC.admin.get().toBase58()).toBe(pairAdminAddress.toBase58());
  });

  it("deployed dex", async () => {
    await deployDex(zkDexAppPrivateKey, dexAdminAccount, dexApp);
    expect(dexApp.admin.get().toBase58()).toBe(dexAdminAddress.toBase58());
  });

  it("creating new pool", async () => {
    const firstId = Field(0n);
    const poolIdStruct = createPoolIdStruct(pairPub, pairMintPub, firstId);
    await createPool(
      dexAdminAccount,
      deployerAccount,
      dexApp,
      map,
      poolIdStruct
    );
    expect(dexApp.root.get().toString()).toBe(map.getRoot().toString());
  });
});
