import { PublicKey, PrivateKey, Transaction, PendingTransaction } from "o1js";

export async function sendWaitTx(
  tx: Transaction,
  pks: PrivateKey[],
  live: boolean = false
): Promise<PendingTransaction> {
  await tx.prove();
  tx.sign(pks);
  const pendingTx: PendingTransaction = await tx.send();
  if (live) {
    await pendingTx.wait();
    if (pendingTx.status !== "pending") {
      throw new Error("tx not successful");
    }
    return pendingTx;
  }
  return pendingTx;
}

export function createTxOptions(
  pubKey: PublicKey,
  live: boolean = true,
  fee: number = 100_000_000
) {
  const txOptions: TxOptions = {
    sender: pubKey,
  };
  if (live) {
    txOptions.fee = fee;
  }
  return txOptions;
}

export type TxOptions = {
  sender: PublicKey;
  fee?: number;
};
