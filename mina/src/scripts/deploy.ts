import { BasicTokenContract } from "../BasicTokenContract.js";
import { Dex } from "../DexContract.js";
import { Mina, PrivateKey } from "o1js";
import dotenv from "dotenv";

const proofsEnabled = true;

dotenv.config();

const Berkeley = Mina.Network(
  "https://proxy.berkeley.minaexplorer.com/graphql"
);
Mina.setActiveInstance(Berkeley);

const transactionFee = 800_000_000;

let verificationKey: any;

if (proofsEnabled) {
  ({ verificationKey } = await Dex.compile());
}

// Create a public/private key pair. The public key is your address and where you deploy the zkApp to
const zkAppPrivateKey = PrivateKey.fromBase58(
  process.env.zkAppPrivateKey as string
);

const zkAppAddress = zkAppPrivateKey.toPublicKey();

const deployerKey = PrivateKey.fromBase58(process.env.deployerKey as string);

const deployerAccount = deployerKey.toPublicKey();

const tokenXKey = PrivateKey.fromBase58(process.env.pkTokenX as string);
const tokenYKey = PrivateKey.fromBase58(process.env.pkTokenY as string);

const tokenXPublic = tokenXKey.toPublicKey();
const tokenYPublic = tokenYKey.toPublicKey();

const tokenX = new BasicTokenContract(tokenXPublic);
const tokenY = new BasicTokenContract(tokenYPublic);

const dexApp = new Dex(zkAppAddress);

const init_txn = await Mina.transaction(
  { sender: deployerAccount, fee: transactionFee },
  () => {
    dexApp.initTokenAddresses(tokenX.address, tokenY.address);
  }
);

await init_txn.prove();

await init_txn.sign([deployerKey]).send();

console.log("initialised tokens in a dex");

console.log(dexApp.tokenX.get());

console.log("finished");
