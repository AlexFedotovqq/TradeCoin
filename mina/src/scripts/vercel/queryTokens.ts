import { getAllTokenKeys, getVercelClient } from "../../database/vercel.js";

const client = getVercelClient();

const res = await getAllTokenKeys(client);

console.log(res);
