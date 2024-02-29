import { PublicKey, Mina, AccountUpdate, PrivateKey } from "o1js";

import { Dex } from "../DexContract.js";
import { sendWaitTx } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await Dex.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployDex(
  zkDexAppPK: PrivateKey,
  pk: PrivateKey,
  proofsEnabled?: boolean
) {
  const deployerAddress: PublicKey = pk.toPublicKey();
  const zkDexAppAddress: PublicKey = zkDexAppPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

  const dexApp = new Dex(zkDexAppAddress);

  const deploy_dex_txn = await Mina.transaction(deployerAddress, () => {
    AccountUpdate.fundNewAccount(deployerAddress);
    dexApp.deploy({ verificationKey, zkappKey: zkDexAppPK });
  });

  await sendWaitTx(deploy_dex_txn, [pk]);

  return { dexApp: dexApp };
}
