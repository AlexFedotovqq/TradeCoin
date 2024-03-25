import { PrivateKey } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { getTokenIdBalance, getTokenInfo } from "../src/helpers/token.js";
import { deployToken, mintToken, transferToken } from "../src/token/token.js";
import { BasicTokenContract } from "../src/BasicTokenContract.js";

const proofsEnabled = false;

describe("Basic Token Contract", () => {
  const testAccounts = startLocalBlockchainClient(proofsEnabled);

  const deployerAccount = testAccounts[0].privateKey;
  const deployerAddress = testAccounts[0].publicKey;

  const deployerAccount1 = testAccounts[1].privateKey;
  const deployerAddress1 = testAccounts[1].publicKey;

  const deployerAccount2 = testAccounts[2].privateKey;
  const deployerAddress2 = testAccounts[2].publicKey;

  const zkAppPrivateKey: PrivateKey = PrivateKey.random();

  const zkAppInstance: BasicTokenContract = new BasicTokenContract(
    zkAppPrivateKey.toPublicKey()
  );

  it("deploying token", async () => {
    await deployToken(deployerAccount, zkAppPrivateKey, proofsEnabled);
    expect(zkAppInstance.admin.get().toBase58()).toBe(
      deployerAddress.toBase58()
    );
  });

  it("minting token", async () => {
    await mintToken(deployerAccount, deployerAddress1, zkAppInstance);
    const balance = await getTokenIdBalance(
      deployerAddress1,
      zkAppInstance.token.id
    );
    expect(balance).toBe("100000000000");
  });

  it("check balance for an empty account", async () => {
    const balance = await getTokenIdBalance(
      deployerAddress,
      zkAppInstance.token.id
    );
    expect(balance).toBe("0");
  });

  it("contract token info matches contract instance", async () => {
    const { tokenId, tokenOwner } = getTokenInfo(zkAppInstance);
    expect(tokenId).toBe(zkAppInstance.token.id.toString());
    expect(tokenOwner).toBe(zkAppInstance.address.toBase58());
  });

  it("transfer token", async () => {
    await transferToken(
      zkAppPrivateKey,
      deployerAccount1,
      deployerAddress2,
      zkAppInstance
    );
    const balance = await getTokenIdBalance(
      deployerAddress2,
      zkAppInstance.token.id
    );
    expect(balance).toBe("1");
  });
});
