import { createClient } from "@vercel/kv";
import { getVercelTokenMetadata } from "tradecoin-mina";

export default async function handler(req, res) {
  const { id: id } = req.query;

  const client = createClient({
    url: process.env.NEXT_PUBLIC_KV_URL,
    token: process.env.NEXT_PUBLIC_KV_TOKEN,
  });

  const token = await getVercelTokenMetadata(id, client);
  try {
    res.status(200).json({
      token,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
