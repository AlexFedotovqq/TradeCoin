import { Field, PublicKey } from "o1js";
import { createClient, VercelKV } from "@vercel/kv";
import dotenv from "dotenv";

dotenv.config();

export type TokenMetadata = {
  name: string;
  description: string;
  id: string | number;
  address: string;
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
  try {
    await client.set(key, value);
  } catch (error) {
    console.log(error);
  }
}

export async function getVercelToken(
  appId: string,
  tokenId: number | string,
  client: VercelKV
) {
  const key = `${appId}: ${tokenId}`;
  const result = await client.get(key);
  return result;
}

export function getVercelClient() {
  const client = createClient({
    url: process.env.KV_REST_API_URL as string,
    token: process.env.KV_REST_API_TOKEN as string,
  });
  return client;
}
