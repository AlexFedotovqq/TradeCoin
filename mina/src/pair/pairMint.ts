import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

import { PairMintContract, TokenPairMintTx } from "../PairContractMint.js";
import { sendWaitTx } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await PairMintContract.compile();
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
  adminPK: PrivateKey,
  ownerPub: PublicKey,
  pairSmartContractMint: PairMintContract
) {
  const adminAddress: PublicKey = adminPK.toPublicKey();
  const txn = await Mina.transaction(adminAddress, () => {
    pairSmartContractMint.setOwner(ownerPub);
  });
  await sendWaitTx(txn, [adminPK]);
}

export async function mintLP(
  pk: PrivateKey,
  adminPK: PrivateKey,
  dl: UInt64,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const balance: TokenPairMintTx = new TokenPairMintTx({
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

export async function burnLP(
  pk: PrivateKey,
  adminPK: PrivateKey,
  dl: UInt64,
  pairSmartContractMint: PairMintContract
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const balance: TokenPairMintTx = new TokenPairMintTx({
    sender: userAddress,
    tokenPub: pairSmartContractMint.address,
    dToken: dl,
  });
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const txn = await Mina.transaction(userAddress, () => {
    pairSmartContractMint.burnLiquidityToken(adminSignature, balance);
  });
  await sendWaitTx(txn, [pk]);
}
