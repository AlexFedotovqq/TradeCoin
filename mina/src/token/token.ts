import { BasicTokenContract } from "../BasicTokenContract.js";

import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

export async function deployToken(
  pubkey: PublicKey,
  pk: PrivateKey,
  contractAddress: PublicKey,
  zkAppPrivateKey: PrivateKey,
  proofsEnabled: boolean
) {
  const contract = new BasicTokenContract(contractAddress);
  let verificationKey: any;

  if (proofsEnabled) {
    ({ verificationKey } = await BasicTokenContract.compile());
    console.log("compiled");
  }

  const deploy_txn = await Mina.transaction(pubkey, () => {
    AccountUpdate.fundNewAccount(pubkey);
    contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
  });

  await deploy_txn.prove();

  await deploy_txn.sign([pk]).send();
  return contract;
}

export async function mintToken(
  zkAppPrivateKey: PrivateKey,
  deployerPk: PrivateKey,
  contract: BasicTokenContract,
  mintAmount: UInt64 = UInt64.from(10)
) {
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const deployerAddress = deployerPk.toPublicKey();

  const mintSignature = Signature.create(
    zkAppPrivateKey,
    mintAmount.toFields().concat(zkAppAddress.toFields())
  );

  const mint_txn = await Mina.transaction(deployerAddress, () => {
    AccountUpdate.fundNewAccount(deployerAddress);
    contract.mint(zkAppAddress, mintAmount, mintSignature);
  });

  await mint_txn.prove();
  await mint_txn.sign([deployerPk]).send();
}

export async function transferToken(
  zkAppPrivateKey: PrivateKey,
  deployerPk: PrivateKey,
  contract: BasicTokenContract,
  sendAmount: UInt64 = UInt64.from(1)
) {
  const deployerAddress = deployerPk.toPublicKey();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const send_txn = await Mina.transaction(deployerAddress, () => {
    AccountUpdate.fundNewAccount(deployerAddress);
    contract.transfer(zkAppAddress, deployerAddress, sendAmount);
  });
  await send_txn.prove();
  await send_txn.sign([deployerPk, zkAppPrivateKey]).send();
}

export async function getBalance(
  fromPk: PrivateKey,
  target: PublicKey,
  contract: BasicTokenContract
) {
  const deployerAddress = fromPk.toPublicKey();
  try {
    const balance_txn = await Mina.transaction(deployerAddress, () => {
      contract.balanceOf(target);
    });
    await balance_txn.prove();
    await balance_txn.sign([fromPk]).send();
  } catch (e) {
    const balance_txn4 = await Mina.transaction(deployerAddress, () => {
      AccountUpdate.fundNewAccount(deployerAddress);
      contract.balanceOf(target);
    });

    await balance_txn4.prove();
    await balance_txn4.sign([fromPk]).send();
  }
}
