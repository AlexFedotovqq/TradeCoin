import { createClient } from "@vercel/kv";
import { getAllTokenKeys } from "tradecoin-mina";

export default async function handler(req, res) {
  const perPage = 6;
  const { id } = req.query;
  const pageNumber = Number(id);

  const client = createClient({
    url: process.env.NEXT_PUBLIC_KV_URL,
    token: process.env.NEXT_PUBLIC_KV_TOKEN,
  });

  const tokens = await getAllTokenKeys(client);
  const arrayLength = tokens.length;

  let items = [];

  let upperLimit = perPage * pageNumber;
  const lowerLimit = upperLimit - perPage;

  if (arrayLength < upperLimit) {
    upperLimit = arrayLength - 1;
  }

  try {
    for (let index = lowerLimit; upperLimit >= index; index++) {
      const fetchedToken = await client.get(tokens[index]);
      // console.log(fetchedToken);
      const uri = await fetch(fetchedToken.uri);
      const uriJson = await uri.json();
      // console.log(uriJson);
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
