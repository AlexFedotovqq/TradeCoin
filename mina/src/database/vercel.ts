import { createClient, VercelKV } from "@vercel/kv";
import dotenv from "dotenv";
dotenv.config();

export type TokenMetadata = {
  name: string;
  address: string;
  uri?: string;
};

export function createTokenMetadataObject(
  name: string,
  address: string,
  uri?: string
) {
  const token: TokenMetadata = {
    name: name,
    address: address,
    uri: uri,
  };
  return token;
}

export async function setVercelTokenMetadata(
  token: TokenMetadata,
  client: VercelKV
) {
  const key: string = `token: ${token.name}`;
  const existsResult: number = await client.exists(key);

  if (existsResult !== 0) {
    throw new Error("key already exists");
  }
  const value = {
    ...token,
  };

  await client.hset(key, value);
}

export async function getVercelTokenMetadata(
  tokenName: string,
  client: VercelKV
) {
  const key: string = `token: ${tokenName}`;
  const result = await client.hgetall(key);
  return result;
}

export function getVercelClient() {
  const client: VercelKV = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  return client;
}

export async function getAllKeys(client: VercelKV) {
  const keysResult: string[] = await client.keys("*");
  return keysResult;
}

export async function getAllTokenKeys(client: VercelKV) {
  const keysResult: string[] = await client.keys("token:*");
  return keysResult;
}
