import { PrivateKey } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { getTokenIdBalance, getTokenInfo } from "../src/helpers/token.js";
import {
  burnToken,
  deployToken,
  deployCustomToken,
  mintToken,
  transferToken,
} from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";

const proofsEnabled = false;

describe("Basic Token Contract", () => {
  const testAccounts = startLocalBlockchainClient(proofsEnabled);

  const adminAccount = testAccounts[0].privateKey;
  const adminAddress = testAccounts[0].publicKey;

  const adminAccount1 = testAccounts[1].privateKey;
  const adminAddres1 = testAccounts[1].publicKey;

  const userAccount1 = testAccounts[2].privateKey;
  const userAddress1 = testAccounts[2].publicKey;

  const userAccount2 = testAccounts[3].privateKey;
  const userAddress2 = testAccounts[3].publicKey;

  const zkAppPrivateKey: PrivateKey = PrivateKey.random();

  const zkAppInstance: BasicTokenContract = new BasicTokenContract(
    zkAppPrivateKey.toPublicKey()
  );

  it("deploying token", async () => {
    await deployToken(adminAccount, zkAppPrivateKey, proofsEnabled);
    expect(zkAppInstance.admin.get().toBase58()).toBe(adminAddress.toBase58());
  });

  it("deploying custom token", async () => {
    const { contract } = await deployCustomToken(adminAccount1);
    expect(contract.admin.get().toBase58()).toBe(adminAddres1.toBase58());
  });

  it("minting token", async () => {
    await mintToken(adminAccount, userAddress1, zkAppInstance);
    const balance: string = await getTokenIdBalance(
      userAddress1,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("100000000000");
  });

  it("burning token", async () => {
    await burnToken(adminAccount, userAccount1, zkAppInstance);
    const balance: string = await getTokenIdBalance(
      userAddress1,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("99999999999");
  });

  it("contract token id matches contract instance id", async () => {
    const tokenId: string = getTokenInfo(zkAppInstance);
    expect(tokenId).toBe(zkAppInstance.deriveTokenId().toString());
  });

  it("transfer token to a user", async () => {
    await transferToken(userAccount1, userAddress2, zkAppInstance);
    const balance: string = await getTokenIdBalance(
      userAddress2,
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("1");
  });

  it("transfer token to a contract", async () => {
    await transferToken(
      userAccount2,
      zkAppPrivateKey.toPublicKey(),
      zkAppInstance
    );
    const balance: string = await getTokenIdBalance(
      zkAppPrivateKey.toPublicKey(),
      zkAppInstance.deriveTokenId()
    );
    expect(balance).toBe("1");
  });
});
