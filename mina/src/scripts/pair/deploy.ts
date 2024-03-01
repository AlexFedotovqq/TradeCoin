import { PrivateKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { deployPair } from "../../pair/pair.js";
dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

const pk = PrivateKey.fromBase58(process.env.pk!);

const { zkAppPrivateKey: zkAppPrivateKey, zkAppPub: zkAppPub } =
  await deployPair(pk, compile, live);

console.log("pk", zkAppPrivateKey.toBase58());
console.log("zkAppPub", zkAppPub.toBase58());
