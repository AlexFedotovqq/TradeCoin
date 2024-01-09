import { Dex } from "../DexContract.js";
import { PublicKey, Mina, AccountUpdate, PrivateKey } from "o1js";

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

  await deploy_dex_txn.prove();
  await deploy_dex_txn.sign([pk]).send();

  return { dexApp: dexApp };
}
