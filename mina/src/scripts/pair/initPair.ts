import { PrivateKey, PublicKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { initPairTokens } from "../../pair/pair.js";
import { getTokenIdBalance } from "../../helpers/token.js";
import { BasicTokenContract } from "../../BasicTokenContract.js";
dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

const zkAppPrivateKey = PrivateKey.fromBase58(process.env.pairPK);

const pk = PrivateKey.fromBase58(process.env.pk!);
const pub = PublicKey.fromPrivateKey(pk);

const tokenPK1 = PrivateKey.fromBase58(process.env.tokenPK1);
const tokenPub1 = PublicKey.fromPrivateKey(tokenPK1);

const contract1 = new BasicTokenContract(tokenPub1);
let tokenBalance = await getTokenIdBalance(pub, contract1.token.id);
console.log("token balance:", tokenBalance);

const tokenPK2 = PrivateKey.fromBase58(process.env.tokenPK2);
const tokenPub2 = PublicKey.fromPrivateKey(tokenPK2);

const contract2 = new BasicTokenContract(tokenPub2);
tokenBalance = await getTokenIdBalance(pub, contract2.token.id);
console.log("token balance:", tokenBalance);

await initPairTokens(zkAppPrivateKey, pk, tokenPub1, tokenPub2, compile, live);

console.log("initialised tokens in a pair");
