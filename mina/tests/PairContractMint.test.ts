import { PrivateKey, UInt64 } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { getTokenIdBalance } from "../src/helpers/token.js";
import {
  deployPairMint,
  setOwner,
  setAdmin,
  mintLP,
} from "../src/pair/pairMint.js";
import { PairMintContract } from "../src/PairContractMint.js";

const proofsEnabled = false;

describe("Pair Mint Contract", () => {
  const testAccounts = startLocalBlockchainClient(proofsEnabled);

  const deployerAccount = testAccounts[0].privateKey;
  const deployerAddress = testAccounts[0].publicKey;

  const ownerAccount = testAccounts[1].privateKey;
  const ownerAddress = testAccounts[1].publicKey;

  const adminAccount = testAccounts[2].privateKey;
  const adminAddress = testAccounts[2].publicKey;

  const userAccount = testAccounts[3].privateKey;
  const userAddress = testAccounts[3].publicKey;

  const userAccount1 = testAccounts[4].privateKey;
  const userAddress1 = testAccounts[4].publicKey;

  const userAccount2 = testAccounts[5].privateKey;
  const userAddress2 = testAccounts[5].publicKey;

  const zkAppPrivateKey: PrivateKey = PrivateKey.random();
  const zkAppInstance = new PairMintContract(zkAppPrivateKey.toPublicKey());

  it("deploying token", async () => {
    await deployPairMint(
      deployerAccount,
      zkAppPrivateKey,
      zkAppInstance,
      proofsEnabled
    );
  });

  it("set contract owner", async () => {
    await setOwner(zkAppPrivateKey, ownerAddress, zkAppInstance);
    expect(zkAppInstance.owner.get().toBase58()).toBe(ownerAddress.toBase58());
  });

  it("set contract admin", async () => {
    await setAdmin(ownerAccount, adminAddress, zkAppInstance);
    const admin = zkAppInstance.admin.get().toBase58();
    expect(admin).toBe(adminAddress.toBase58());
  });

  it("mint liquidity token", async () => {
    const dl = UInt64.one;
    await mintLP(userAccount, adminAccount, dl, zkAppInstance);
    const balance = await getTokenIdBalance(
      userAddress,
      zkAppInstance.token.id
    );
    expect(balance).toBe("1");
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
});
