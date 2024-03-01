import { PublicKey, Mina, AccountUpdate, PrivateKey } from "o1js";

import { Dex } from "../DexContract.js";
import { createTxOptions, sendWaitTx } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(compile?: boolean) {
  if (compile) {
    const { verificationKey } = await Dex.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployDex(
  zkDexAppPK: PrivateKey,
  pk: PrivateKey,
  compile?: boolean,
  live?: boolean
) {
  const deployerAddress: PublicKey = pk.toPublicKey();
  const zkDexAppAddress: PublicKey = zkDexAppPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(compile);

  const dexApp = new Dex(zkDexAppAddress);

  const txOptions = createTxOptions(deployerAddress, live);

  const deploy_dex_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    dexApp.deploy({ verificationKey, zkappKey: zkDexAppPK });
  });

  await sendWaitTx(deploy_dex_txn, [pk], live);

  return { dexApp: dexApp };
}
