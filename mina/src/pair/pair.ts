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
} from "o1js";

import {
  PairContract,
  PersonalPairBalance,
  TokenPairTx,
} from "../PairContract.js";
import {
  createTxOptions,
  sendWaitTx,
  TxOptions,
} from "../helpers/transactions.js";
import { TokenPairMintTx } from "../PairContractMint.js";

async function compileContractIfProofsEnabled(compile?: boolean) {
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
  const verificationKey = await compileContractIfProofsEnabled(compile);
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
  pkSender: PrivateKey,
  pkPairSmartContract: PrivateKey,
  pairSmartContract: PairContract,
  compile: boolean = false,
  live: boolean = false
) {
  await compileContractIfProofsEnabled(compile);
  const userAddress: PublicKey = pkSender.toPublicKey();
  const txOptions: TxOptions = createTxOptions(userAddress, live);
  const txn: Transaction = await createDeployPairTx(
    pkPairSmartContract,
    pairSmartContract,
    compile,
    txOptions
  );
  await sendWaitTx(txn, [pkSender], live);
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
  localpkAdmin: PrivateKey,
  pkAdmin: PrivateKey,
  pkSender: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dx: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localpkAdmin,
    balance.toFields()
  );
  const tokenX = pairSmartContract.tokenX.get();
  const tokenTx: TokenPairMintTx = new TokenPairMintTx({
    sender: userAddress,
    tokenPub: tokenX,
    dToken: dx,
  });
  const adminSignature: Signature = Signature.create(
    pkAdmin,
    tokenTx.toFields()
  );
  const tokenPairTx: TokenPairTx = new TokenPairTx({
    pairAdminSignature: localAdminSignature,
    balance: balance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dx,
  });
  const supplyXTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenX(tokenPairTx, adminSignature);
  });
  await sendWaitTx(supplyXTxn, [pkSender]);
  balance.increaseX(dx);
  map.set(idField, balance.hash());
  return balance;
}

export async function supplyY(
  localpkAdmin: PrivateKey,
  pkAdmin: PrivateKey,
  pkSender: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dy: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localpkAdmin,
    balance.toFields()
  );
  const tokenY = pairSmartContract.tokenY.get();
  const tokenTx = new TokenPairMintTx({
    sender: userAddress,
    tokenPub: tokenY,
    dToken: dy,
  });
  const adminSignature: Signature = Signature.create(
    pkAdmin,
    tokenTx.toFields()
  );
  const tokenPairTx: TokenPairTx = new TokenPairTx({
    pairAdminSignature: localAdminSignature,
    balance: balance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dy,
  });
  const supplyYTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenY(tokenPairTx, adminSignature);
  });
  await sendWaitTx(supplyYTxn, [pkSender]);
  balance.increaseY(dy);
  map.set(idField, balance.hash());
  return balance;
}

export async function mintLiquidityToken(
  localpkAdmin: PrivateKey,
  pkAdmin: PrivateKey,
  pkSender: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dl: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localpkAdmin,
    balance.toFields()
  );
  const tokenTx = new TokenPairMintTx({
    sender: userAddress,
    tokenPub: pairMintingAddress,
    dToken: dl,
  });
  const adminSignature: Signature = Signature.create(
    pkAdmin,
    tokenTx.toFields()
  );
  const tokenPairTx: TokenPairTx = new TokenPairTx({
    pairAdminSignature: localAdminSignature,
    balance: balance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dl,
  });
  const mintLiqTxn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContract.mintLiquidityToken(tokenPairTx, adminSignature);
  });
  await sendWaitTx(mintLiqTxn, [pkSender]);
  balance.supply(dl);
  map.set(idField, balance.hash());
}

export async function burnLiquidityToken(
  localpkAdmin: PrivateKey,
  pkAdmin: PrivateKey,
  pkSender: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dl: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = pkSender.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localpkAdmin,
    balance.toFields()
  );
  const tokenTx = new TokenPairMintTx({
    sender: userAddress,
    tokenPub: pairMintingAddress,
    dToken: dl,
  });
  const adminSignature: Signature = Signature.create(
    pkAdmin,
    tokenTx.toFields()
  );
  const tokenPairTx: TokenPairTx = new TokenPairTx({
    pairAdminSignature: localAdminSignature,
    balance: balance,
    keyWitness: witness,
    tokenPub: pairMintingAddress,
    dToken: dl,
  });
  const mintLiqTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.burnLiquidityToken(tokenPairTx, adminSignature);
  });
  await sendWaitTx(mintLiqTxn, [pkSender]);
  balance.burn(dl);
  map.set(idField, balance.hash());
}
