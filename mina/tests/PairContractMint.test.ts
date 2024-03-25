import { PrivateKey, UInt64 } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { getTokenIdBalance } from "../src/helpers/token.js";
import {
  deployPairMint,
  setOwner,
  mintLP,
  burnLP,
} from "../src/pair/pairMint.js";
import { PairMintContract } from "../src/PairContractMint.js";

const proofsEnabled = false;

describe("Pair Mint Contract", () => {
  const testAccounts = startLocalBlockchainClient(proofsEnabled);

  const adminAccount = testAccounts[0].privateKey;
  const adminAddress = testAccounts[0].publicKey;

  const ownerAccount = testAccounts[1].privateKey;
  const ownerAddress = testAccounts[1].publicKey;

  const userAccount = testAccounts[2].privateKey;
  const userAddress = testAccounts[2].publicKey;

  const userAccount1 = testAccounts[3].privateKey;
  const userAddress1 = testAccounts[3].publicKey;

  const userAccount2 = testAccounts[4].privateKey;
  const userAddress2 = testAccounts[4].publicKey;

  const zkAppPrivateKey: PrivateKey = PrivateKey.random();
  const zkAppInstance = new PairMintContract(zkAppPrivateKey.toPublicKey());

  it("deploying token", async () => {
    await deployPairMint(
      adminAccount,
      zkAppPrivateKey,
      zkAppInstance,
      proofsEnabled
    );
    expect(zkAppInstance.admin.get().toBase58()).toBe(adminAddress.toBase58());
  });

  it("set contract owner", async () => {
    await setOwner(adminAccount, ownerAddress, zkAppInstance);
    expect(zkAppInstance.owner.get().toBase58()).toBe(ownerAddress.toBase58());
  });

  it("mint liquidity token", async () => {
    const dl = UInt64.one;
    await mintLP(userAccount, adminAccount, dl, zkAppInstance);
    const balance = await getTokenIdBalance(
      userAddress,
      zkAppInstance.token.id
    );
    expect(balance).toBe("1");
    expect(zkAppInstance.totalSupply.get().toString()).toBe("1");
  });

  it("fails to mint liquidity token", async () => {
    try {
      const dl = UInt64.one;
      await mintLP(userAccount2, userAccount1, dl, zkAppInstance);
    } catch (e) {
      const errorMessage = String(e);
      expect(errorMessage.substring(0, 26)).toBe("Error: not admin signature");
    }
    const balance = await getTokenIdBalance(
      userAddress2,
      zkAppInstance.token.id
    );
    expect(balance).toBe("0");
  });

  it("burn liquidity token", async () => {
    const dl = UInt64.one;
    await burnLP(userAccount, adminAccount, dl, zkAppInstance);
    const balance = await getTokenIdBalance(
      userAddress,
      zkAppInstance.token.id
    );
    expect(balance).toBe("0");
    expect(zkAppInstance.totalSupply.get().toString()).toBe("0");
  });
});
