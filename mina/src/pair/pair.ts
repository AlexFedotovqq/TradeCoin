import { PairContract } from "../PairContract.js";
import { PublicKey, Mina, AccountUpdate, PrivateKey } from "o1js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await PairContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployPair(
  zkDexAppPK: PrivateKey,
  pk: PrivateKey,
  proofsEnabled?: boolean
) {
  const deployerAddress: PublicKey = pk.toPublicKey();
  const zkDexAppAddress: PublicKey = zkDexAppPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

  const pairSmartContract = new PairContract(zkDexAppAddress);

  const deploy_txn = await Mina.transaction(deployerAddress, () => {
    AccountUpdate.fundNewAccount(deployerAddress);
    pairSmartContract.deploy({ verificationKey, zkappKey: zkDexAppPK });
  });

  await deploy_txn.prove();
  await deploy_txn.sign([pk]).send();

  return { pairSmartContract: pairSmartContract };
}
