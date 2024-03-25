import {
  PublicKey,
  Field,
  Mina,
  Signature,
  AccountUpdate,
  PrivateKey,
  MerkleTree,
} from "o1js";

import { createTxOptions, sendWaitTx } from "../helpers/transactions.js";
import { Dex, PoolId, MyMerkleWitness } from "../DexContract.js";

async function compileContractIfProofsEnabled(compile?: boolean) {
  if (compile) {
    const { verificationKey } = await Dex.compile();
    return verificationKey;
  }
  return undefined;
}

export async function deployDex(
  zkDexAppPK: PrivateKey,
  dexAdminPK: PrivateKey,
  dexApp: Dex,
  compile?: boolean,
  live?: boolean
) {
  const deployerAddress: PublicKey = dexAdminPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(compile);
  const txOptions = createTxOptions(deployerAddress, live);
  const deploy_dex_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    dexApp.deploy({ verificationKey, zkappKey: zkDexAppPK });
  });
  await sendWaitTx(deploy_dex_txn, [dexAdminPK], live);
}

export async function createPool(
  dexAdminPK: PrivateKey,
  userPK: PrivateKey,
  dexApp: Dex,
  map: MerkleTree,
  poolStruct: PoolId
) {
  const userPub: PublicKey = userPK.toPublicKey();
  const w = map.getWitness(poolStruct.id.toBigInt());
  const witness = new MyMerkleWitness(w);
  const adminSignature: Signature = Signature.create(
    dexAdminPK,
    poolStruct.toFields()
  );
  const create_user_txn = await Mina.transaction(userPub, () => {
    dexApp.createPool(adminSignature, witness, poolStruct);
  });
  await create_user_txn.prove();
  await create_user_txn.sign([userPK]).send();
  map.setLeaf(poolStruct.id.toBigInt(), poolStruct.hash());
}

export function createPoolIdStruct(
  PairAddress: PublicKey,
  PairMintingAddress: PublicKey,
  id: Field
) {
  const balanceOne: PoolId = new PoolId({
    PairAddress: PairAddress,
    PairMintingAddress: PairMintingAddress,
    id: id,
  });
  return balanceOne;
}
