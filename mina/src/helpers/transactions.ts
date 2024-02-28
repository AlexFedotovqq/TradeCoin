import { PublicKey, PrivateKey, Mina } from "o1js";

export async function sendWaitTx(
  tx: Mina.Transaction,
  pks: PrivateKey[],
  live: boolean = false
) {
  await tx.prove();
  tx.sign(pks);

  let pendingTx = await tx.send();

  if (live) {
    console.log(`Got pending transaction with hash ${pendingTx.hash()}`);

    await pendingTx.wait();
    if (!pendingTx.isSuccess) {
      throw new Error("tx not successful");
    }
  }
}

export function createTxOptions(
  pubKey: PublicKey,
  live: boolean = true,
  fee: number = 100_000_000
) {
  const txOptions: { sender: PublicKey; fee?: number } = {
    sender: pubKey,
  };
  if (live) {
    txOptions.fee = fee;
  }
  return txOptions;
}
