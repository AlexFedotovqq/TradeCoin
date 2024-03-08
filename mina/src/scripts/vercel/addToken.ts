import {
  TokenMetadata,
  getVercelClient,
  setVercelTokenMetadata,
} from "../../database/vercel.js";

import { PrivateKey } from "o1js";

const client = getVercelClient();

const token: TokenMetadata = {
  name: "Not Empty",
  address: PrivateKey.random().toPublicKey().toBase58(),
};

await setVercelTokenMetadata(token, client);
