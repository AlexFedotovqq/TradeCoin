import { PublicKey, Field, fetchAccount } from "o1js";

export async function getTokenIdBalance(
  pub: PublicKey,
  tokenId: Field = Field(1)
) {
  const data = await fetchAccount({ publicKey: pub, tokenId: tokenId });
  let tokenBalance = 0n;
  if (data.account?.balance) {
    tokenBalance = data.account.balance.toBigInt();
  }
  return tokenBalance;
}
