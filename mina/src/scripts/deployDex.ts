import { PrivateKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../helpers/client.js";
import { deployDex } from "../dex/dex.js";

dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

const zkDexAppPrivateKey = PrivateKey.random();

const pk = PrivateKey.fromBase58(process.env.pk!);

await deployDex(zkDexAppPrivateKey, pk, compile, live);

console.log(zkDexAppPrivateKey.toBase58());
