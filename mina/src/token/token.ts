import { PublicKey, Mina, AccountUpdate, PrivateKey, UInt64 } from "o1js";

import {
  BasicTokenContract,
  createCustomToken,
} from "../BasicTokenContract.js";
import { sendWaitTx, createTxOptions } from "../helpers/transactions.js";

async function compileContractIfProofsEnabled(compile: boolean) {
  if (compile) {
    const { verificationKey } = await BasicTokenContract.compile();
    return verificationKey;
  }
  return undefined;
}

export async function deployToken(
  pk: PrivateKey,
  zkAppPrivateKey: PrivateKey,
  compile: boolean,
  live: boolean = false
) {
  const pubKey: PublicKey = pk.toPublicKey();
  const zkAppAddress = zkAppPrivateKey.toPublicKey();
  const contract = new BasicTokenContract(zkAppAddress);
  const verificationKey = await compileContractIfProofsEnabled(compile);
  const txOptions = createTxOptions(pubKey, live);
  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    contract.deploy({ verificationKey, zkappKey: zkAppPrivateKey });
  });
  await sendWaitTx(deploy_txn, [pk], live);
}

export async function deployCustomToken(
  pk: PrivateKey,
  symbol: string = "TRADE",
  uri: string = "https://tradecoin.dev/uri/uri.json",
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
  senderPK: PrivateKey,
  TokenXPrivateKey: PrivateKey,
  TokenYPrivateKey: PrivateKey,
  compile: boolean = false,
  live: boolean = false
) {
  const pubKey: PublicKey = senderPK.toPublicKey();
  const TokenAddressX = TokenXPrivateKey.toPublicKey();
  const TokenAddressY = TokenYPrivateKey.toPublicKey();

  const verificationKey = await compileContractIfProofsEnabled(compile);

  const tokenX = new BasicTokenContract(TokenAddressX);
  const tokenY = new BasicTokenContract(TokenAddressY);

  const txOptions = createTxOptions(pubKey, live);

  const deploy_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender, 2);
    tokenX.deploy({ verificationKey, zkappKey: TokenXPrivateKey });
    tokenY.deploy({ verificationKey, zkappKey: TokenYPrivateKey });
  });

  await sendWaitTx(deploy_txn, [senderPK], live);
}

export async function mintToken(
  deployerPk: PrivateKey,
  receiverPub: PublicKey,
  contract: BasicTokenContract,
  compile: boolean = false,
  live: boolean = false,
  mintAmount: UInt64 = UInt64.from(100_000_000_000)
) {
  await compileContractIfProofsEnabled(compile);
  const deployerAddress = deployerPk.toPublicKey();
  const txOptions = createTxOptions(deployerAddress, live);
  const mint_txn = await Mina.transaction(txOptions, () => {
    AccountUpdate.fundNewAccount(txOptions.sender);
    contract.mint(receiverPub, mintAmount);
  });
  await sendWaitTx(mint_txn, [deployerPk], live);
}

export async function transferToken(
  zkAppPrivateKey: PrivateKey,
  senderPK: PrivateKey,
  receiverPub: PublicKey,
  contract: BasicTokenContract,
  sendAmount: UInt64 = UInt64.from(1)
) {
  const senderPub: PublicKey = senderPK.toPublicKey();
  const send_txn = await Mina.transaction(senderPub, () => {
    AccountUpdate.fundNewAccount(senderPub);
    contract.transfer(senderPub, receiverPub, sendAmount);
  });
  await sendWaitTx(send_txn, [senderPK, zkAppPrivateKey]);
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
