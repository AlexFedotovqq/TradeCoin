import { createClient } from "@vercel/kv";

export const client = createClient({
  url: process.env.NEXT_PUBLIC_KV_URL,
  token: process.env.NEXT_PUBLIC_KV_TOKEN,
});
