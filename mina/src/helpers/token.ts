import { PublicKey, Field, Mina } from "o1js";

export async function getTokenIdBalance(
  pub: PublicKey,
  tokenId: Field = Field(1)
) {
  let tokenBalance = "0";
  try {
    tokenBalance = Mina.getBalance(pub, tokenId).value.toString();
  } catch (e) {}
  return tokenBalance;
}
