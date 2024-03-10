import { getAllTokenKeys } from "tradecoin-mina";

import { fetcher } from "@/utils/fetcher";
import { client } from "@/utils/vercelClient";

const perPage = 6;

export default async function handler(req, res) {
  const { id } = req.query;
  const pageNumber = Number(id);

  const tokens = await getAllTokenKeys(client);
  const arrayLength = tokens.length;

  let items = [];

  let upperLimit = perPage * (pageNumber + 1);
  const lowerLimit = upperLimit - perPage;
  if (arrayLength < upperLimit) {
    upperLimit = arrayLength - 1;
  }

  try {
    for (let index = lowerLimit; upperLimit >= index; index++) {
      const fetchedToken = await client.get(tokens[index]);
      const uriJson = await fetcher(fetchedToken.uri);
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
