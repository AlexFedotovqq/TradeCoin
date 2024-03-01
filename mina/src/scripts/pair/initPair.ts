import { PrivateKey, PublicKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { initPairTokens } from "../../pair/pair.js";
dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

const zkAppPrivateKey = PrivateKey.fromBase58(process.env.zkAppPK!);
const pk = PrivateKey.fromBase58(process.env.pk!);

const tokenPK1 = PrivateKey.fromBase58(process.env.tokenPK1!);
const tokenPub1 = PublicKey.fromPrivateKey(tokenPK1);

const tokenPK2 = PrivateKey.fromBase58(process.env.tokenPK2!);
const tokenPub2 = PublicKey.fromPrivateKey(tokenPK2);

await initPairTokens(zkAppPrivateKey, pk, tokenPub1, tokenPub2, compile, live);

console.log("initialised tokens in a pair");
