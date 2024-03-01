import { PrivateKey, fetchAccount } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../helpers/client.js";
import { logDexStates } from "../helpers/logs.js";
import { Dex } from "../DexContract.js";

dotenv.config();

startBerkeleyClient();

const zkDexAppPrivateKey = PrivateKey.fromBase58(process.env.zkAppPK!);
const pub = zkDexAppPrivateKey.toPublicKey();

const dex = new Dex(pub);

await fetchAccount({ publicKey: pub });

logDexStates(dex);
