import { createClient } from "@vercel/kv";
import { getAllTokenKeys } from "tradecoin-mina";

const perPage = 6;

export default async function handler(req, res) {
  const { id } = req.query;
  const pageNumber = Number(id);

  const client = createClient({
    url: process.env.NEXT_PUBLIC_KV_URL,
    token: process.env.NEXT_PUBLIC_KV_TOKEN,
  });

  const tokens = await getAllTokenKeys(client);
  const arrayLength = tokens.length;

  let items = [];

  let upperLimit = perPage * (pageNumber + 1);
  if (arrayLength < upperLimit) {
    upperLimit = arrayLength - 1;
  }

  const lowerLimit = upperLimit - perPage;

  try {
    for (let index = lowerLimit; upperLimit >= index; index++) {
      const fetchedToken = await client.get(tokens[index]);
      const uri = await fetch(fetchedToken.uri);
      const uriJson = await uri.json();
      items.push({ ...fetchedToken, ...uriJson });
    }
  } catch (err) {
    res.status(200).json({
      items: items,
      page: pageNumber,
      error: "failed to fetch data" + err,
    });
  }
  res.status(200).json({ items: items });
}
