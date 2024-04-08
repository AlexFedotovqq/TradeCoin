import { PublicKey, Field, Mina } from "o1js";

import { BasicTokenContract } from "../BasicTokenContract.js";

export async function getTokenIdBalance(
  pub: PublicKey,
  tokenId: Field = Field(1)
) {
  let tokenBalance: string = "0";
  try {
    tokenBalance = Mina.getBalance(pub, tokenId).value.toString();
  } catch (e) {}
  return tokenBalance;
}

export function getTokenInfo(contract: BasicTokenContract): string {
  const tokenId: string = contract.deriveTokenId().toString();
  return tokenId;
}
