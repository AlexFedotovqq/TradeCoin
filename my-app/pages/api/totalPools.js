import { Mina, fetchAccount, PublicKey } from "o1js";

import { Dex } from "tradecoin-mina";

export default async function handler(req, res) {
  try {
    res.status(200).json({
      totalpools: 123,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
