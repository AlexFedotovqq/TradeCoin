import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  MerkleMap,
  Field,
  UInt64,
  Signature,
  Transaction,
  MerkleMapWitness,
  VerificationKey,
} from "o1js";

import { PersonalPairBalance } from "./PersonalPairBalance.js";
import { TxTokenPairContract } from "./TxTokenPair.js";
import { TxTokenPairMintContract } from "./TxTokenPairMintContract.js";
import {
  createTxOptions,
  sendWaitTx,
  TxOptions,
} from "../helpers/transactions.js";
import { PairContract } from "../PairContract.js";

async function compileContractIfProofsEnabled(
  compile?: boolean
): Promise<VerificationKey | undefined> {
  if (compile) {
    const { verificationKey } = await PairContract.compile();
    return verificationKey;
  }
  return undefined;
}

export async function createDeployPairTx(
  pkPairSmartContract: PrivateKey,
  pairSmartContract: PairContract,
  compile: boolean,
  txOptions: TxOptions
) {
  const verificationKey: VerificationKey | undefined =
    await compileContractIfProofsEnabled(compile);
  const txn: Transaction = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    pairSmartContract.deploy({
      verificationKey,
      zkappKey: pkPairSmartContract,
    });
  });
  return txn;
}

export async function deployPair(
  pkPairSmartContract: PrivateKey,
  TxPairContractDetailsPrivate: TxPairContractDetailsPkSender,
  compile: boolean = false,
  live: boolean = false
) {
  await compileContractIfProofsEnabled(compile);

  const txPairContractDetailsPublic: TxPairContractDetailsPubSender =
    getTxDetailsPublic(TxPairContractDetailsPrivate);
  const txOptions: TxOptions = createTxOptions(
    txPairContractDetailsPublic.pubSender,
    live
  );
  const txn: Transaction = await createDeployPairTx(
    pkPairSmartContract,
    txPairContractDetailsPublic.scPair,
    compile,
    txOptions
  );
  await sendWaitTx(txn, [TxPairContractDetailsPrivate.pkSender], live);
}

export async function createInitContractTx(
  pairSmartContract: PairContract,
  tokenX: PublicKey,
  tokenY: PublicKey,
  compile: boolean,
  txOptions: TxOptions
) {
  await compileContractIfProofsEnabled(compile);
  const txn: Transaction = await Mina.transaction(txOptions, () => {
    pairSmartContract.initContract(tokenX, tokenY);
  });
  return txn;
}

export async function initPairTokens(
  pkAdmin: PrivateKey,
  pairSmartContract: PairContract,
  tokenX: PublicKey,
  tokenY: PublicKey,
  compile: boolean = false,
  live: boolean = false
) {
  const pubAdmin: PublicKey = pkAdmin.toPublicKey();
  const txOptions: TxOptions = createTxOptions(pubAdmin, live);
  const txn: Transaction = await createInitContractTx(
    pairSmartContract,
    tokenX,
    tokenY,
    compile,
    txOptions
  );
  await sendWaitTx(txn, [pkAdmin], live);
}

export async function createUserTx(
  pkAdmin: PrivateKey,
  userAddress: PublicKey,
  pairSmartContract: PairContract,
  map: MerkleMap,
  id: number,
  txOptions: TxOptions
) {
  const idField = Field(id);
  const witness = map.getWitness(idField);
  const balance = new PersonalPairBalance({
    owner: userAddress,
    id: idField,
    tokenXAmount: UInt64.zero,
    tokenYAmount: UInt64.zero,
  });

  const adminSignature: Signature = Signature.create(
    pkAdmin,
    balance.toFields()
  );

  const createUserTxn = await Mina.transaction(txOptions, () => {
    pairSmartContract.createPersonalBalance(adminSignature, witness);
  });
  return { txn: createUserTxn, balance: balance };
}

export async function createUser(
  pkAdmin: PrivateKey,
  pkSender: PrivateKey,
  map: MerkleMap,
  id: number,
  pairSmartContract: PairContract,
  live: boolean = false
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const txOptions = createTxOptions(userAddress, live);
  const { txn: createUserTxn, balance: Balance } = await createUserTx(
    pkAdmin,
    userAddress,
    pairSmartContract,
    map,
    id,
    txOptions
  );
  await sendWaitTx(createUserTxn, [pkSender]);
  const idField = Field(id);
  map.set(idField, Balance.hash());
  return Balance;
}

export async function supplyX(
  pkAdminPairContract: PrivateKey,
  pkAdminPairMintContract: PrivateKey,
  pkSender: PrivateKey,
  userBalance: PersonalPairBalance,
  map: MerkleMap,
  dx: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(userBalance.id);
  const witness = map.getWitness(idField);
  const signatureAdminPairContract: Signature = Signature.create(
    pkAdminPairContract,
    userBalance.toFields()
  );
  const tokenX = pairSmartContract.tokenX.get();
  const tokenTx: TxTokenPairMintContract = new TxTokenPairMintContract({
    sender: userAddress,
    tokenPub: tokenX,
    dToken: dx,
  });
  const signatureAdminPairMintContract: Signature = Signature.create(
    pkAdminPairMintContract,
    tokenTx.toFields()
  );
  const txTokenPairContract: TxTokenPairContract = new TxTokenPairContract({
    signatureAdminPairContract: signatureAdminPairContract,
    userBalance: userBalance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dx,
  });
  const supplyXTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenX(
      signatureAdminPairMintContract,
      txTokenPairContract
    );
  });
  await sendWaitTx(supplyXTxn, [pkSender]);
  userBalance.increaseX(dx);
  map.set(idField, userBalance.hash());
  return userBalance;
}

export async function supplyY(
  pkAdminPairContract: PrivateKey,
  pkAdminPairMintContract: PrivateKey,
  pkSender: PrivateKey,
  userBalance: PersonalPairBalance,
  map: MerkleMap,
  dy: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(userBalance.id);
  const witness = map.getWitness(idField);
  const signatureAdminPairContract: Signature = Signature.create(
    pkAdminPairContract,
    userBalance.toFields()
  );
  const tokenY = pairSmartContract.tokenY.get();
  const tokenTx = new TxTokenPairMintContract({
    sender: userAddress,
    tokenPub: tokenY,
    dToken: dy,
  });
  const signatureAdminPairMintContract: Signature = Signature.create(
    pkAdminPairMintContract,
    tokenTx.toFields()
  );
  const txTokenPairContract: TxTokenPairContract = new TxTokenPairContract({
    signatureAdminPairContract: signatureAdminPairContract,
    userBalance: userBalance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dy,
  });
  const supplyYTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenY(
      signatureAdminPairMintContract,
      txTokenPairContract
    );
  });
  await sendWaitTx(supplyYTxn, [pkSender]);
  userBalance.increaseY(dy);
  map.set(idField, userBalance.hash());
  return userBalance;
}

export async function mintLiquidityToken(
  TxPairContractDetailsPrivate: TxPairContractDetailsPkSender,
  signatureAdminPairMintContract: Signature,
  TxTokenPairContract: TxTokenPairContract
) {
  const txPairContractDetailsPublic: TxPairContractDetailsPubSender =
    getTxDetailsPublic(TxPairContractDetailsPrivate);
  const mintLPTxn: Transaction = await mintLiquidityTokenTx(
    signatureAdminPairMintContract,
    TxTokenPairContract,
    txPairContractDetailsPublic
  );
  await sendWaitTx(mintLPTxn, [TxPairContractDetailsPrivate.pkSender]);
}

export async function mintLiquidityTokenTx(
  signatureAdminPairMintContract: Signature,
  TxTokenPairContract: TxTokenPairContract,
  txPairSmartContractDetails: TxPairContractDetailsPubSender
) {
  const mintLiqTxn = await Mina.transaction(
    txPairSmartContractDetails.pubSender,
    () => {
      AccountUpdate.fundNewAccount(txPairSmartContractDetails.pubSender);
      txPairSmartContractDetails.scPair.mintLiquidityToken(
        signatureAdminPairMintContract,
        TxTokenPairContract
      );
    }
  );
  return mintLiqTxn;
}

export async function burnLiquidityToken(
  TxPairContractDetailsPrivate: TxPairContractDetailsPkSender,
  signatureAdminPairMintContract: Signature,
  TxTokenPairContract: TxTokenPairContract
) {
  const txPairContractDetailsPublic: TxPairContractDetailsPubSender =
    getTxDetailsPublic(TxPairContractDetailsPrivate);
  const burnLPTxn: Transaction = await burnLiquidityTokenTx(
    signatureAdminPairMintContract,
    TxTokenPairContract,
    txPairContractDetailsPublic
  );
  await sendWaitTx(burnLPTxn, [TxPairContractDetailsPrivate.pkSender]);
}

export async function burnLiquidityTokenTx(
  signatureAdminPairMintContract: Signature,
  TxTokenPairContract: TxTokenPairContract,
  txPairSmartContractDetails: TxPairContractDetailsPubSender
) {
  const mintLiqTxn = await Mina.transaction(
    txPairSmartContractDetails.pubSender,
    () => {
      txPairSmartContractDetails.scPair.burnLiquidityToken(
        signatureAdminPairMintContract,
        TxTokenPairContract
      );
    }
  );
  return mintLiqTxn;
}

export function getSignatureAdminPairMintContract(
  pkAdminPairMintContract: PrivateKey,
  tokenPairMintTx: TxTokenPairMintContract
) {
  const signatureAdminPairMintContract: Signature = Signature.create(
    pkAdminPairMintContract,
    tokenPairMintTx.toFields()
  );
  return signatureAdminPairMintContract;
}

export function getSignatureAdminPairContract(
  pkAdminPairtContract: PrivateKey,
  userBalance: PersonalPairBalance
) {
  const signatureAdminPairContract: Signature = Signature.create(
    pkAdminPairtContract,
    userBalance.toFields()
  );
  return signatureAdminPairContract;
}

export function getWitnessFromBalanceId(
  idBalanceField: Field,
  map: MerkleMap
): MerkleMapWitness {
  const witness = map.getWitness(idBalanceField);
  return witness;
}

export function getTxDetailsPublic(
  TxPairContractDetailsPrivate: TxPairContractDetailsPkSender
): TxPairContractDetailsPubSender {
  const txDetails: TxPairContractDetailsPubSender = {
    pubSender: TxPairContractDetailsPrivate.pkSender.toPublicKey(),
    scPair: TxPairContractDetailsPrivate.scPair,
  };
  return txDetails;
}

export function getTxDetailsPrivate(
  pkSender: PrivateKey,
  scPair: PairContract
): TxPairContractDetailsPkSender {
  const txDetails: TxPairContractDetailsPkSender = {
    pkSender: pkSender,
    scPair: scPair,
  };
  return txDetails;
}

export type TxPairContractDetailsPubSender = {
  pubSender: PublicKey;
  scPair: PairContract;
};

export type TxPairContractDetailsPkSender = {
  pkSender: PrivateKey;
  scPair: PairContract;
};
