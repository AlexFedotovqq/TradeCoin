import { PrivateKey } from "o1js";

import { startLocalBlockchainClient } from "../src/helpers/client.js";
import { logTokenBalance, logTokenInfo } from "../src/helpers/logs.js";
import { getTokenIdBalance } from "../src/helpers/token.js";
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

  const zkAppInstance = new BasicTokenContract(zkAppPrivateKey.toPublicKey());

  it("deploying token", async () => {
    console.log("deployerAccount: " + deployerAddress.toBase58());
    await deployToken(deployerAccount, zkAppPrivateKey, proofsEnabled);
  });

  it("minting token", async () => {
    await mintToken(deployerAccount, deployerAddress1, zkAppInstance);
    const balance = await getTokenIdBalance(
      deployerAddress1,
      zkAppInstance.token.id
    );
    expect(balance).toBe("100000000000");
  });

  it("check balance for empty account", async () => {
    const balance = await getTokenIdBalance(
      deployerAddress,
      zkAppInstance.token.id
    );
    expect(balance).toBe("0");
  });

  it("logs contract token info", async () => {
    logTokenInfo(zkAppInstance);
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

  it("logs token info for address with no tokens", async () => {
    logTokenBalance(zkAppInstance, deployerAddress);
  });

  it("logs token info for address with tokens", async () => {
    logTokenBalance(zkAppInstance, deployerAddress1);
  });
});
