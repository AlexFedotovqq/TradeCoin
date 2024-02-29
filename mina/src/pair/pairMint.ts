import { PublicKey, Mina, AccountUpdate, PrivateKey, UInt64 } from "o1js";

import { PairMintContract } from "../PairContractMint.js";
import { sendWaitTx } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await PairMintContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployPairMint(
  zkAppPK: PrivateKey,
  pk: PrivateKey,
  proofsEnabled?: boolean
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const zkDexAppAddress: PublicKey = zkAppPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

  const pairSmartContractMint = new PairMintContract(zkDexAppAddress);

  const deploy_txn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContractMint.deploy({ verificationKey, zkappKey: zkAppPK });
  });

  await sendWaitTx(deploy_txn, [pk]);

  return { pairSmartContractMint: pairSmartContractMint };
}

export async function initOwner(
  pk: PrivateKey,
  owner: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const txn = await Mina.transaction(userAddress, () => {
    pairSmartContractMint.initOwner(owner);
  });

  await sendWaitTx(txn, [pk]);
}

export async function mint(
  pk: PrivateKey,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const txn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContractMint.mintLiquidityToken(UInt64.one, userAddress);
  });

  await sendWaitTx(txn, [pk]);
}
