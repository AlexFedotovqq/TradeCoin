import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

import { PairMintContract, TokenTx } from "../PairContractMint.js";
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
  ownerPub: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = zkAppPK.toPublicKey();
  const txn = await Mina.transaction(userAddress, () => {
    pairSmartContractMint.initOwner(ownerPub);
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

export async function mintLP(
  pk: PrivateKey,
  adminPK: PrivateKey,
  dl: UInt64,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const balance = new TokenTx({
    sender: userAddress,
    tokenPub: pairSmartContractMint.address,
    dToken: dl,
  });
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const txn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContractMint.mintLiquidityToken(adminSignature, balance);
  });
  await sendWaitTx(txn, [pk]);
}
