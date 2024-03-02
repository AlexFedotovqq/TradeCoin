import { PrivateKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { logPairStates } from "../../helpers/logs.js";
import { PairContract } from "../../PairContract.js";

dotenv.config();

const live = true;

startBerkeleyClient();

const zkAppPrivateKey = PrivateKey.fromBase58(process.env.pairPK);
const pub = zkAppPrivateKey.toPublicKey();

const dex = new PairContract(pub);

await logPairStates(dex, live);
