import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

import { BasicTokenContract } from "../BasicTokenContract.js";

async function compileContractIfProofsEnabled(proofsEnabled: boolean) {
  if (proofsEnabled) {
    const { verificationKey } = await BasicTokenContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployToken(
  pubkey: PublicKey,
  pk: PrivateKey,
  proofsEnabled: boolean
) {
  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const contract = new BasicTokenContract(zkAppAddress);

  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

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
  proofsEnabled: boolean = false
) {
  const TokenAddressXPrivateKey = PrivateKey.random();
  const TokenAddressX = TokenAddressXPrivateKey.toPublicKey();

  const TokenAddressYPrivateKey = PrivateKey.random();
  const TokenAddressY = TokenAddressYPrivateKey.toPublicKey();

  const verificationKey = await compileContractIfProofsEnabled(proofsEnabled);

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
  mintAmount: UInt64 = UInt64.from(10_000_000)
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
    const balance_txn = await Mina.transaction(deployerAddress, () => {
      AccountUpdate.fundNewAccount(deployerAddress);
      contract.balanceOf(target);
    });

    await balance_txn.prove();
    await balance_txn.sign([fromPk]).send();
  }
}

export async function init2TokensSmartContract(
  pk: PrivateKey,
  tokenX: BasicTokenContract,
  tokenY: BasicTokenContract,
  zkDexAppAddress: PublicKey
) {
  const pub: PublicKey = pk.toPublicKey();
  const send_txn = await Mina.transaction(pub, () => {
    AccountUpdate.fundNewAccount(pub, 2);
    tokenX.transfer(pub, zkDexAppAddress, UInt64.zero);
    tokenY.transfer(pub, zkDexAppAddress, UInt64.zero);
  });

  await send_txn.prove();
  await send_txn.sign([pk]).send();
}
