import { PrivateKey, PublicKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { mintToken } from "../../token/token.js";
import { BasicTokenContract } from "../../BasicTokenContract.js";

dotenv.config();

let compile = true;
const live = true;

startBerkeleyClient();

const pk = PrivateKey.fromBase58(process.env.pk!);
const pub = PublicKey.fromPrivateKey(pk);

const tokenPK1 = PrivateKey.fromBase58(process.env.tokenPK1!);
const tokenPub1 = PublicKey.fromPrivateKey(tokenPK1);

const contract1 = new BasicTokenContract(tokenPub1);

await mintToken(tokenPK1, pk, pub, contract1, compile, live);

compile = false;

const tokenPK2 = PrivateKey.fromBase58(process.env.tokenPK2!);
const tokenPub2 = PublicKey.fromPrivateKey(tokenPK2);

const contract2 = new BasicTokenContract(tokenPub2);

await mintToken(tokenPK2, pk, pub, contract2, compile, live);

const tokenPK3 = PrivateKey.fromBase58(process.env.tokenPK3!);
const tokenPub3 = PublicKey.fromPrivateKey(tokenPK3);

const contract3 = new BasicTokenContract(tokenPub3);

await mintToken(tokenPK3, pk, pub, contract3, compile, live);

const tokenPK4 = PrivateKey.fromBase58(process.env.tokenPK4!);
const tokenPub4 = PublicKey.fromPrivateKey(tokenPK4);

const contract4 = new BasicTokenContract(tokenPub4);

await mintToken(tokenPK4, pk, pub, contract4, compile, live);
