import { PrivateKey, PublicKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { mintToken } from "../../token/token.js";
import { BasicTokenContract } from "../../BasicTokenContract.js";

dotenv.config();

let compile = true;
const live = true;

startBerkeleyClient();

const pk = PrivateKey.fromBase58(process.env.pk);
const pub = PublicKey.fromPrivateKey(pk);

const tokenPK = PrivateKey.fromBase58(process.env.Trade1PK);
const tokenPub = PublicKey.fromPrivateKey(tokenPK);

const contract = new BasicTokenContract(tokenPub);

await mintToken(pk, pub, contract, compile, live);
