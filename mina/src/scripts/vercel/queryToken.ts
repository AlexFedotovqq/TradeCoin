import {
  getVercelClient,
  getVercelTokenMetadata,
} from "../../database/vercel.js";

const client = getVercelClient();

const tokenName = "TRADE0";

const res = await getVercelTokenMetadata(tokenName, client);

console.log(res);
