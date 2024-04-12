import { PrivateKey, PublicKey, UInt64 } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { getTokenIdBalance } from "../src/helpers/token.js";
import { deployPairMint, mintLP, burnLP } from "../src/pair/pairMint.js";
import { PairMintContract } from "../src/PairContractMint.js";

const proofsEnabled = false;

describe("Pair Mint Contract", () => {
  const testAccounts = startLocalBlockchainClient(proofsEnabled);

  const adminAccount = testAccounts[0].privateKey;
  const adminAddress = testAccounts[0].publicKey;

  const userAccount = testAccounts[1].privateKey;
  const userAddress = testAccounts[1].publicKey;

  const userAccount1 = testAccounts[2].privateKey;
  const userAddress1 = testAccounts[2].publicKey;

  const userAccount2 = testAccounts[3].privateKey;
  const userAddress2 = testAccounts[3].publicKey;

  const zkAppPrivateKey: PrivateKey = PrivateKey.random();
  const zkAppPub: PublicKey = zkAppPrivateKey.toPublicKey();
  const zkAppInstance: PairMintContract = new PairMintContract(zkAppPub);

  it("deploying token", async () => {
    await deployPairMint(
      adminAccount,
      zkAppPrivateKey,
      zkAppInstance,
      proofsEnabled
    );
    expect(zkAppInstance.admin.get().toBase58()).toBe(adminAddress.toBase58());
  });

  it("mint liquidity token", async () => {
    const dl: UInt64 = UInt64.one;
    await mintLP(userAccount, adminAccount, dl, zkAppInstance);
    const balance = await getTokenIdBalance(
      userAddress,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("1");
    expect(zkAppInstance.totalSupplyLP.get().toString()).toBe("1");
  });

  it("fails to mint liquidity token: not admin", async () => {
    try {
      const dl: UInt64 = UInt64.one;
      await mintLP(userAccount2, userAccount1, dl, zkAppInstance);
    } catch (e) {
      const errorMessage: string = String(e);
      expect(errorMessage.substring(0, 35)).toBe(
        "Error: mint LP: not admin signature"
      );
    }
    const balance: string = await getTokenIdBalance(
      userAddress2,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("0");
  });

  it("burns liquidity token", async () => {
    const dl: UInt64 = UInt64.one;
    await burnLP(userAccount, adminAccount, dl, zkAppInstance);
    const balance: string = await getTokenIdBalance(
      userAddress,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("0");
    expect(zkAppInstance.totalSupplyLP.get().toString()).toBe("0");
  });
});
