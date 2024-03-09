import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  MerkleMap,
  Field,
  UInt64,
  Poseidon,
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
  zkAppPK: PrivateKey,
  compile: boolean,
  txOptions: TxOptions
) {
  const verificationKey = await compileContractIfProofsEnabled(compile);
  const zkAppAddress: PublicKey = zkAppPK.toPublicKey();
  const pairSmartContract = new PairContract(zkAppAddress);

  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    pairSmartContract.deploy({ verificationKey, zkappKey: zkAppPK });
  });
  return {
    deploy_txn,
    pairSmartContract,
  };
}

export async function deployPair(
  userPK: PrivateKey,
  compile: boolean = false,
  live: boolean = false
) {
  await compileContractIfProofsEnabled(compile);
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppPub = PublicKey.fromPrivateKey(zkAppPrivateKey);

  const userAddress: PublicKey = userPK.toPublicKey();
  const txOptions = createTxOptions(userAddress, live);
  const { deploy_txn, pairSmartContract } = await createDeployPairTx(
    zkAppPrivateKey,
    compile,
    txOptions
  );
  await sendWaitTx(deploy_txn, [userPK], live);
  return {
    zkAppPrivateKey: zkAppPrivateKey,
    zkAppPub: zkAppPub,
    pairSmartContract: pairSmartContract,
  };
}

export async function createInitPairTokensTx(
  pairSmartContract: PairContract,
  tokenX: PublicKey,
  tokenY: PublicKey,
  compile: boolean,
  txOptions: TxOptions
) {
  await compileContractIfProofsEnabled(compile);

  const txn = await Mina.transaction(txOptions, () => {
    pairSmartContract.initTokenAddresses(tokenX, tokenY);
  });
  return txn;
}

export async function initPairTokens(
  zkAppPrivateKey: PrivateKey,
  userPK: PrivateKey,
  tokenX: PublicKey,
  tokenY: PublicKey,
  compile: boolean = false,
  live: boolean = false
) {
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const userAddress = userPK.toPublicKey();

  const pairSmartContract = new PairContract(zkAppAddress);
  const txOptions = createTxOptions(userAddress, live);
  const init_txn = await createInitPairTokensTx(
    pairSmartContract,
    tokenX,
    tokenY,
    compile,
    txOptions
  );

  await sendWaitTx(init_txn, [userPK, zkAppPrivateKey], live);
}

export async function createUserTx(
  pairSmartContract: PairContract,
  map: MerkleMap,
  id: number,
  txOptions: TxOptions
) {
  const idField = Field(id);
  const witness = map.getWitness(idField);

  const createUserTxn = await Mina.transaction(txOptions, () => {
    pairSmartContract.createPersonalBalance(witness);
  });
  return createUserTxn;
}

export async function createUser(
  map: MerkleMap,
  id: number,
  pairSmartContract: PairContract,
  userPK: PrivateKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(id);
  const witness = map.getWitness(idField);

  const Balance = new PersonalPairBalance({
    owner: userAddress,
    id: idField,
    tokenXAmount: UInt64.zero,
    tokenYAmount: UInt64.zero,
  });

  const createUserTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.createPersonalBalance(witness);
  });

  await sendWaitTx(createUserTxn, [userPK]);

  map.set(idField, Poseidon.hash(PersonalPairBalance.toFields(Balance)));
  return Balance;
}

export async function supplyX(
  map: MerkleMap,
  balance: PersonalPairBalance,
  dx: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey,
  userPK: PrivateKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balance.id);
  const witness = map.getWitness(idField);

  const supplyXTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenX(dx, witness, balance, pairMintingAddress);
  });

  await sendWaitTx(supplyXTxn, [userPK]);

  balance.increaseX(dx);
  map.set(idField, balance.hash());
  return balance;
}

export async function supplyY(
  map: MerkleMap,
  balance: PersonalPairBalance,
  dy: UInt64,
  pairSmartContract: PairContract,
  pairMintingAddress: PublicKey,
  userPK: PrivateKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balance.id);
  const witness = map.getWitness(idField);

  const supplyYTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenY(dy, witness, balance, pairMintingAddress);
  });

  await sendWaitTx(supplyYTxn, [userPK]);

  balance.increaseY(dy);
  map.set(idField, balance.hash());
  return balance;
}

export async function mintLiquidityToken(
  map: MerkleMap,
  balance: PersonalPairBalance,
  dl: UInt64,
  pairSmartContract: PairContract,
  userPK: PrivateKey,
  pairMintingAddress: PublicKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balance.id);
  const witness = map.getWitness(idField);

  const mintLiqTxn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContract.mintLiquidityToken(
      dl,
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
