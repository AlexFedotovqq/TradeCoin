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
  proofsEnabled: boolean
) {
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const contract = new BasicTokenContract(zkAppAddress);

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
  return { contract: contract, zkAppPrivateKey: zkAppPrivateKey };
}

export async function deploy2Tokens(
  pubKey: PublicKey,
  pk: PrivateKey,
  proofsEnabled: boolean
) {
  const TokenAddressXPrivateKey = PrivateKey.random();
  const TokenAddressX = TokenAddressXPrivateKey.toPublicKey();

  const TokenAddressYPrivateKey = PrivateKey.random();
  const TokenAddressY = TokenAddressYPrivateKey.toPublicKey();

  let verificationKey: any;

  if (proofsEnabled) {
    ({ verificationKey } = await BasicTokenContract.compile());
    console.log("compiled");
  }

  const tokenX = new BasicTokenContract(TokenAddressX);
  const tokenY = new BasicTokenContract(TokenAddressY);

  const deploy_txn = await Mina.transaction(pubKey, () => {
    AccountUpdate.fundNewAccount(pubKey, 2);

    tokenX.deploy({ verificationKey, zkappKey: TokenAddressXPrivateKey });
    tokenY.deploy({ verificationKey, zkappKey: TokenAddressYPrivateKey });
  });

  await deploy_txn.prove();
  await deploy_txn.sign([pk]).send();
  return {
    tokenX: tokenX,
    tokenY: tokenY,
    tokenXPK: TokenAddressXPrivateKey,
    tokenYPK: TokenAddressYPrivateKey,
  };
}

export async function mintToken(
  zkAppPrivateKey: PrivateKey,
  deployerPk: PrivateKey,
  receiverPub: PublicKey,
  contract: BasicTokenContract,
  mintAmount: UInt64 = UInt64.from(10)
) {
  const deployerAddress = deployerPk.toPublicKey();

  const mintSignature = Signature.create(
    zkAppPrivateKey,
    mintAmount.toFields().concat(receiverPub.toFields())
  );

  const mint_txn = await Mina.transaction(deployerAddress, () => {
    AccountUpdate.fundNewAccount(deployerAddress);
    contract.mint(receiverPub, mintAmount, mintSignature);
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
