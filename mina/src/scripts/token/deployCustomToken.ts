import { PrivateKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { deployCustomToken } from "../../token/token.js";

dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

// maximum 6 bytes
const symbol = "TRADE";
const uri = "https://tradecoin.dev";

const pk = PrivateKey.fromBase58(process.env.pk);

const { zkAppPrivateKey: zkAppPrivateKey } = await deployCustomToken(
  pk,
  symbol,
  uri,
  compile,
  live
);

console.log("pk:", zkAppPrivateKey.toBase58());
console.log("pub:", zkAppPrivateKey.toPublicKey().toBase58());
