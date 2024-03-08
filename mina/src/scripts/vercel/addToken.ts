import {
  TokenMetadata,
  getVercelClient,
  getVercelToken,
  setVercelToken,
} from "../../database/vercel.js";

import { PrivateKey, PublicKey } from "o1js";

const client = getVercelClient();

const appId = "123";

const token: TokenMetadata = {
  name: "",
  description: "",
  id: appId,
  address: PrivateKey.random().toPublicKey().toBase58(),
};

await setVercelToken(appId, token, client);

const res = await getVercelToken(appId, appId, client);

console.log(res);
