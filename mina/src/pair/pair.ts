import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  Signature,
  MerkleMap,
  Field,
  UInt64,
  Poseidon,
} from "o1js";

import { PairContract, PersonalPairBalance } from "../PairContract.js";
import { sendWaitTx } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(proofsEnabled?: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await PairContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployPair(
  zkAppPK: PrivateKey,
  pk: PrivateKey,
  proofsEnabled?: boolean
) {
  const userAddress: PublicKey = pk.toPublicKey();
  const zkDexAppAddress: PublicKey = zkAppPK.toPublicKey();
  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

  const pairSmartContract = new PairContract(zkDexAppAddress);

  const deploy_txn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContract.deploy({ verificationKey, zkappKey: zkAppPK });
  });

  await sendWaitTx(deploy_txn, [pk]);
  return { pairSmartContract: pairSmartContract };
}

export async function initPairTokens(
  zkAppPrivateKey: PrivateKey,
  userPK: PrivateKey,
  tokenX: PublicKey,
  tokenY: PublicKey,
  pairSmartContract: PairContract
) {
  const zkPairAppAddress = zkAppPrivateKey.toPublicKey();
  const userAddress = userPK.toPublicKey();

  const initSignature = Signature.create(
    zkAppPrivateKey,
    zkPairAppAddress.toFields()
  );

  const init_txn = await Mina.transaction(userAddress, () => {
    pairSmartContract.initTokenAddresses(tokenX, tokenY, initSignature);
  });

  await sendWaitTx(init_txn, [userPK]);
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
  balancePairBefore: PersonalPairBalance,
  dx: UInt64,
  pairSmartContract: PairContract,
  userPK: PrivateKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balancePairBefore.id);
  const witness = map.getWitness(idField);

  const balancePairAfter = increaseXBalance(balancePairBefore, dx);

  const supplyXTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenX(
      dx,
      witness,
      balancePairBefore,
      balancePairAfter
    );
  });

  await sendWaitTx(supplyXTxn, [userPK]);

  map.set(
    idField,
    Poseidon.hash(PersonalPairBalance.toFields(balancePairAfter))
  );

  return balancePairAfter;
}

export async function supplyY(
  map: MerkleMap,
  balancePairBefore: PersonalPairBalance,
  dy: UInt64,
  pairSmartContract: PairContract,
  userPK: PrivateKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balancePairBefore.id);
  const witness = map.getWitness(idField);

  const balancePairAfter = increaseYBalance(balancePairBefore, dy);

  const supplyYTxn = await Mina.transaction(userAddress, () => {
    pairSmartContract.supplyTokenY(
      dy,
      witness,
      balancePairBefore,
      balancePairAfter
    );
  });

  await sendWaitTx(supplyYTxn, [userPK]);

  map.set(
    idField,
    Poseidon.hash(PersonalPairBalance.toFields(balancePairAfter))
  );

  return balancePairAfter;
}

export function increaseXBalance(balance: PersonalPairBalance, dx: UInt64) {
  const newBalance: PersonalPairBalance = {
    owner: balance.owner,
    id: balance.id,
    tokenXAmount: balance.tokenXAmount.add(dx),
    tokenYAmount: balance.tokenYAmount,
  };
  return newBalance;
}

export function increaseYBalance(balance: PersonalPairBalance, dy: UInt64) {
  const newBalance: PersonalPairBalance = {
    owner: balance.owner,
    id: balance.id,
    tokenXAmount: balance.tokenXAmount,
    tokenYAmount: balance.tokenYAmount.add(dy),
  };
  return newBalance;
}

export function supplyBalance(balance: PersonalPairBalance, dl: UInt64) {
  const newBalance: PersonalPairBalance = {
    owner: balance.owner,
    id: balance.id,
    tokenXAmount: balance.tokenXAmount.sub(dl),
    tokenYAmount: balance.tokenYAmount.sub(dl),
  };
  return newBalance;
}

export async function mintLiquidityToken(
  map: MerkleMap,
  balancePairBefore: PersonalPairBalance,
  dl: UInt64,
  pairSmartContract: PairContract,
  userPK: PrivateKey,
  pairAddress: PublicKey
) {
  const userAddress: PublicKey = userPK.toPublicKey();

  const idField = Field(balancePairBefore.id);
  const witness = map.getWitness(idField);

  const balancePairAfter = supplyBalance(balancePairBefore, dl);

  const mintLiqTxn = await Mina.transaction(userAddress, () => {
    AccountUpdate.fundNewAccount(userAddress);
    pairSmartContract.mintLiquidityToken(
      dl,
      witness,
      balancePairBefore,
      balancePairAfter,
      pairAddress
    );
  });

  await sendWaitTx(mintLiqTxn, [userPK]);

  map.set(
    idField,
    Poseidon.hash(PersonalPairBalance.toFields(balancePairAfter))
  );
}
