import { Field, PublicKey } from "o1js";
import { VercelKV } from "@vercel/kv";

export type TokenMetadata = {
  name: string;
  description: string;
  id: Field;
  address: PublicKey;
};

export async function setVercelToken(
  appId: string,
  token: TokenMetadata,
  client: VercelKV
) {
  const key = `${appId}: ${token.id}`;
  const value = {
    ...token,
  };
  await client.set(key, value);
}

export async function getVercelToken(
  appId: string,
  tokenId: number | string,
  client: VercelKV
) {
  const key = `${appId}: ${tokenId}`;
  await client.get(key);
}
