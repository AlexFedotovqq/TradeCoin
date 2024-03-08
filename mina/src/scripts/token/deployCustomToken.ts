import { PrivateKey } from "o1js";
import dotenv from "dotenv";
dotenv.config();

import {
  getVercelClient,
  createTokenMetadataObject,
  setVercelTokenMetadata,
} from "../../database/vercel.js";
import { startBerkeleyClient } from "../../helpers/client.js";
import { deployCustomToken } from "../../token/token.js";

const compile = true;
const live = true;

startBerkeleyClient();
const client = getVercelClient();

// maximum 6 bytes
const symbol = "Dspyt";
const uri = `https://tradecoin.dev/uri/${symbol}.json`;

const pk = PrivateKey.fromBase58(process.env.pk);

const { zkAppPrivateKey: zkAppPrivateKey } = await deployCustomToken(
  pk,
  symbol,
  uri,
  compile,
  live
);

const tokenPub = zkAppPrivateKey.toPublicKey().toBase58();

console.log("pk:", zkAppPrivateKey.toBase58());
console.log("pub:", tokenPub);

const tokenMetadata = createTokenMetadataObject(symbol, tokenPub, uri);

await setVercelTokenMetadata(tokenMetadata, client);
