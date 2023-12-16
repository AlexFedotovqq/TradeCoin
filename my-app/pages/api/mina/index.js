import { Field, Mina, fetchAccount, PublicKey } from "o1js";

import { Dex } from "tradecoin-mina";

export default async function handler(req, res) {
  try {
    const Berkeley = Mina.Network(
      "https://proxy.berkeley.minaexplorer.com/graphql",
    );

    Mina.setActiveInstance(Berkeley);

    const zkAppAddress = PublicKey.fromBase58(
      "B62qq1DMusFhTJHrcQPUnxVo1xMJK6wKCcurBfNLhACmsmmrzZAyqVE",
    );

    const ass = await fetchAccount({ publicKey: zkAppAddress });
    console.log(ass.account.zkapp.appState[0]);
    console.log(ass.account.zkapp.appState[2]);
    await Dex.compile();
    const zkAppInstance = new Dex(zkAppAddress);
    console.log(zkAppInstance.tokenX.get());

    res.status(200).json({
      tokenX: 123,
    });
  } catch (err) {
    res.status(500).send({ error: "failed to fetch data" + err });
  }
}
