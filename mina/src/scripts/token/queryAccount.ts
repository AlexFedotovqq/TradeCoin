import { PrivateKey, PublicKey } from "o1js";
import dotenv from "dotenv";
dotenv.config();

import { startBerkeleyClient } from "../../helpers/client.js";
import { getTokenIdBalance } from "../../helpers/token.js";
import { BasicTokenContract } from "../../BasicTokenContract.js";

startBerkeleyClient();

const pk = PrivateKey.fromBase58(process.env.pk);
const pub = PublicKey.fromPrivateKey(pk);

const tokenPK1 = PrivateKey.fromBase58(process.env.tokenPK1);
const tokenPub1 = PublicKey.fromPrivateKey(tokenPK1);

const contract1 = new BasicTokenContract(tokenPub1);

const tokenBalance = await getTokenIdBalance(pub, contract1.token.id);

console.log("token balance:", tokenBalance);

const minaTokenBalance = await getTokenIdBalance(pub);

console.log("Mina token balance:", Number(minaTokenBalance) / 1_000_000_000);
