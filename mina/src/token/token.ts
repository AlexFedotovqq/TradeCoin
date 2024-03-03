import {
  PublicKey,
  Mina,
  AccountUpdate,
  PrivateKey,
  UInt64,
  Signature,
} from "o1js";

import {
  BasicTokenContract,
  createCustomToken,
} from "../BasicTokenContract.js";
import { sendWaitTx, createTxOptions } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(compile: boolean) {
  if (compile) {
    const { verificationKey } = await BasicTokenContract.compile();
    console.log("compiled");
    return verificationKey;
  }
  return undefined;
}

export async function deployToken(
  pk: PrivateKey,
  compile: boolean,
  live: boolean = false
) {
  const pubKey: PublicKey = pk.toPublicKey();

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const contract = new BasicTokenContract(zkAppAddress);

  const verificationKey = await compileContractIfProofsEnabled(compile);

  const txOptions = createTxOptions(pubKey, live);

  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
  });

  await sendWaitTx(deploy_txn, [pk], live);
  return { contract: contract, zkAppPrivateKey: zkAppPrivateKey };
}

export async function deployCustomToken(
  pk: PrivateKey,
  symbol: string = "TRADE",
  uri: string = "https://tradecoin.dev",
  compile: boolean = false,
  live: boolean = false
) {
  const pubKey: PublicKey = pk.toPublicKey();

  const zkAppPrivateKey = PrivateKey.random();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();

  const CustomToken = createCustomToken(symbol, uri);
  const contract = new CustomToken(zkAppAddress);

  const verificationKey = await compileContractIfProofsEnabled(compile);

  const txOptions = createTxOptions(pubKey, live);

  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
  });

  await sendWaitTx(deploy_txn, [pk], live);
  return { contract: contract, zkAppPrivateKey: zkAppPrivateKey };
}

export async function deploy2Tokens(
  pk: PrivateKey,
  compile: boolean = false,
  live: boolean = false
) {
  const pubKey: PublicKey = pk.toPublicKey();

  const TokenAddressXPrivateKey = PrivateKey.random();
  const TokenAddressX = TokenAddressXPrivateKey.toPublicKey();

  const TokenAddressYPrivateKey = PrivateKey.random();
  const TokenAddressY = TokenAddressYPrivateKey.toPublicKey();

  const verificationKey = await compileContractIfProofsEnabled(compile);

  const tokenX = new BasicTokenContract(TokenAddressX);
  const tokenY = new BasicTokenContract(TokenAddressY);

  const txOptions = createTxOptions(pubKey, live);

  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender, 2);
    tokenX.deploy({ verificationKey, zkappKey: TokenAddressXPrivateKey });
    tokenY.deploy({ verificationKey, zkappKey: TokenAddressYPrivateKey });
  });

  await sendWaitTx(deploy_txn, [pk], live);
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
  compile: boolean = false,
  live: boolean = false,
  mintAmount: UInt64 = UInt64.from(100_000_000_000)
) {
  await compileContractIfProofsEnabled(compile);
  const deployerAddress = deployerPk.toPublicKey();

  const mintSignature = Signature.create(
    zkAppPrivateKey,
    mintAmount.toFields().concat(receiverPub.toFields())
  );

  const txOptions = createTxOptions(deployerAddress, live);

  const mint_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    contract.mint(receiverPub, mintAmount, mintSignature);
  });

  await sendWaitTx(mint_txn, [deployerPk], live);
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

  await sendWaitTx(send_txn, [deployerPk, zkAppPrivateKey]);
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

    await sendWaitTx(balance_txn, [fromPk]);
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

  await sendWaitTx(send_txn, [pk]);
}
