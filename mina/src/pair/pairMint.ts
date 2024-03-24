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
  pk: PrivateKey,
  zkAppPK: PrivateKey,
  pairSmartContractMint: PairMintContract,
  proofsEnabled?: boolean
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);
  const deploy_txn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContractMint.deploy({ verificationKey, zkappKey: zkAppPK });
  });
  await sendWaitTx(deploy_txn, [pk]);
}

export async function setOwner(
  zkAppPK: PrivateKey,
  owner: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = zkAppPK.toPublicKey();
  const txn = await Mina.transaction(userAddress, () => {
    pairSmartContractMint.initOwner(owner);
  });
  await sendWaitTx(txn, [zkAppPK]);
}

export async function setAdmin(
  zkOwnerPK: PrivateKey,
  admin: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = zkOwnerPK.toPublicKey();
  const txn = await Mina.transaction(userAddress, () => {
    pairSmartContractMint.setAdmin(admin);
  });
  await sendWaitTx(txn, [zkOwnerPK]);
}

export async function mint(
  adminPK: PrivateKey,
  recipientAddress: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const adminAddress: PublicKey = adminPK.toPublicKey();
  const txn = await Mina.transaction(adminAddress, () => {
    AccountUpdate.fundNewAccount(adminAddress);
    pairSmartContractMint.mintLiquidityToken(UInt64.one, recipientAddress);
  });
  await sendWaitTx(txn, [adminPK]);
}
