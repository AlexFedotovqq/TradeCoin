import { PrivateKey } from "o1js";
import dotenv from "dotenv";

import { startBerkeleyClient } from "../../helpers/client.js";
import { deploy2Tokens } from "../../token/token.js";

dotenv.config();

const compile = true;
const live = true;

startBerkeleyClient();

const pk = PrivateKey.fromBase58(process.env.pk!);

const { tokenXPK: TokenAddressXPrivateKey, tokenYPK: TokenAddressYPrivateKey } =
  await deploy2Tokens(pk, compile, live);

console.log("pk 1:", TokenAddressXPrivateKey.toBase58());
console.log("pub 1:", TokenAddressXPrivateKey.toPublicKey().toBase58());
console.log("pk 2:", TokenAddressYPrivateKey.toBase58());
console.log("pub 2:", TokenAddressYPrivateKey.toPublicKey().toBase58());
