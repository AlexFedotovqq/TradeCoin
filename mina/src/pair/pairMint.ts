import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

import {
  TxTokenPairMintContract,
  getTxTokenPairMintContractStruct,
} from "./TxTokenPairMintContract.js";
import { sendWaitTx } from "../helpers/transactions.js";
import { PairMintContract } from "../PairContractMint.js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await PairMintContract.compile();
    return verificationKey;
  }
  return undefined;
}

export async function deployPairMint(
  pkSender: PrivateKey,
  zkAppPK: PrivateKey,
  pairSmartContractMint: PairMintContract,
  proofsEnabled?: boolean
) {
  const pubSender: PublicKey = pkSender.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);
  const deploy_txn = await Mina.transaction(pubSender, () => {
    AccountUpdate.fundNewAccount(pubSender);
    pairSmartContractMint.deploy({ verificationKey, zkappKey: zkAppPK });
  });
  await sendWaitTx(deploy_txn, [pkSender]);
}

export async function mintLP(
  pkSender: PrivateKey,
  adminPK: PrivateKey,
  dl: UInt64,
  pairSmartContractMint: PairMintContract
) {
  const pubSender: PublicKey = pkSender.toPublicKey();
  const balance: TxTokenPairMintContract = getTxTokenPairMintContractStruct(
    pubSender,
    dl,
    pairSmartContractMint.address
  );
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const txn = await Mina.transaction(pubSender, () => {
    AccountUpdate.fundNewAccount(pubSender);
    pairSmartContractMint.mintLiquidityToken(adminSignature, balance);
  });
  await sendWaitTx(txn, [pkSender]);
}

export async function burnLP(
  pkSender: PrivateKey,
  adminPK: PrivateKey,
  dl: UInt64,
  pairSmartContractMint: PairMintContract
) {
  const pubSender: PublicKey = pkSender.toPublicKey();
  const balance: TxTokenPairMintContract = getTxTokenPairMintContractStruct(
    pubSender,
    dl,
    pairSmartContractMint.address
  );
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const txn = await Mina.transaction(pubSender, () => {
    pairSmartContractMint.burnLiquidityToken(adminSignature, balance);
  });
  await sendWaitTx(txn, [pkSender]);
}
