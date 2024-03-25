import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  MerkleMap,
  Field,
  UInt64,
  Signature,
} from "o1js";

import { PairContract, PersonalPairBalance } from "../PairContract.js";
import {
  createTxOptions,
  sendWaitTx,
  TxOptions,
} from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(compile?: boolean) {
  if (compile) {
    const { verificationKey } = await PairContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function createDeployPairTx(
  pairSmartContractPK: PrivateKey,
  pairSmartContract: PairContract,
  compile: boolean,
  txOptions: TxOptions
) {
  const verificationKey = await compileContractIfProofsEnabled(compile);
  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    pairSmartContract.deploy({
      verificationKey,
      zkappKey: pairSmartContractPK,
    });
  });
  return deploy_txn;
}

export async function deployPair(
  userPK: PrivateKey,
  pairSmartContractPK: PrivateKey,
  pairSmartContract: PairContract,
  compile: boolean = false,
  live: boolean = false
) {
  await compileContractIfProofsEnabled(compile);
  const userAddress: PublicKey = userPK.toPublicKey();
  const txOptions = createTxOptions(userAddress, live);
  const deploy_txn = await createDeployPairTx(
    pairSmartContractPK,
    pairSmartContract,
    compile,
    txOptions
  );
  await sendWaitTx(deploy_txn, [userPK], live);
}

export async function createInitContractTx(
  pairSmartContract: PairContract,
  tokenX: PublicKey,
  tokenY: PublicKey,
  admin: PublicKey,
  compile: boolean,
  txOptions: TxOptions
) {
  await compileContractIfProofsEnabled(compile);
  const txn = await Mina.transaction(txOptions, () => {
    pairSmartContract.initContract(tokenX, tokenY, admin);
  });
  return txn;
}

export async function initPairTokens(
  zkAppPrivateKey: PrivateKey,
  pairSmartContract: PairContract,
  tokenX: PublicKey,
  tokenY: PublicKey,
  admin: PublicKey,
  compile: boolean = false,
  live: boolean = false
) {
  const zkAppPub = zkAppPrivateKey.toPublicKey();
  const txOptions = createTxOptions(zkAppPub, live);
  const init_txn = await createInitContractTx(
    pairSmartContract,
    tokenX,
    tokenY,
    admin,
    compile,
    txOptions
  );
  await sendWaitTx(init_txn, [zkAppPrivateKey], live);
}

export async function createUserTx(
  adminPK: PrivateKey,
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
    adminPK,
    balance.toFields()
  );

  const createUserTxn = await Mina.transaction(txOptions, () => {
    pairSmartContract.createPersonalBalance(adminSignature, witness);
  });
  return { txn: createUserTxn, balance: balance };
}

export async function createUser(
  adminPK: PrivateKey,
  userPK: PrivateKey,
  map: MerkleMap,
  id: number,
  pairSmartContract: PairContract,
  live: boolean = false
) {
  const userAddress: PublicKey = userPK.toPublicKey();
  const txOptions = createTxOptions(userAddress, live);
  const { txn: createUserTxn, balance: Balance } = await createUserTx(
    adminPK,
    userAddress,
    pairSmartContract,
    map,
    id,
    txOptions
  );
  await sendWaitTx(createUserTxn, [userPK]);
  const idField = Field(id);
  map.set(idField, Balance.hash());
  return Balance;
}

export async function supplyX(
  localAdminPK: PrivateKey,
  adminPK: PrivateKey,
  userPK: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dx: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localAdminPK,
    balance.toFields()
  );
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const supplyXTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenX(
      dx,
      adminSignature,
      localAdminSignature,
      witness,
      balance,
      pairMintingAddress
    );
  });
  await sendWaitTx(supplyXTxn, [userPK]);
  balance.increaseX(dx);
  map.set(idField, balance.hash());
  return balance;
}

export async function supplyY(
  localAdminPK: PrivateKey,
  adminPK: PrivateKey,
  userPK: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dy: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localAdminPK,
    balance.toFields()
  );
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const supplyYTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenY(
      dy,
      adminSignature,
      localAdminSignature,
      witness,
      balance,
      pairMintingAddress
    );
  });
  await sendWaitTx(supplyYTxn, [userPK]);
  balance.increaseY(dy);
  map.set(idField, balance.hash());
  return balance;
}

export async function mintLiquidityToken(
  localAdminPK: PrivateKey,
  adminPK: PrivateKey,
  userPK: PrivateKey,
  map: MerkleMap,
  balance: PersonalPairBalance,
  dl: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();
  const idField = Field(balance.id);
  const witness = map.getWitness(idField);
  const localAdminSignature: Signature = Signature.create(
    localAdminPK,
    balance.toFields()
  );
  const adminSignature: Signature = Signature.create(
    adminPK,
    balance.toFields()
  );
  const mintLiqTxn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContract.mintLiquidityToken(
      dl,
      adminSignature,
      localAdminSignature,
      witness,
      balance,
      pairMintingAddress
    );
  });
  await sendWaitTx(mintLiqTxn, [userPK]);
  balance.increaseX(dl);
  balance.increaseY(dl);
  map.set(idField, balance.hash());
}
