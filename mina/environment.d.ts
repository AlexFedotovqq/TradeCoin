declare global {
  namespace NodeJS {
    interface ProcessEnv {
      zkAppPK: string;
      pk: string;
      Trade1PK: string;
      Trade2PK: string;
      TradePK: string;
      DspytPK: string;
      tokenPK5: string;
      pairPK: string;
      KV_REST_API_TOKEN: string;
      KV_REST_API_URL: string;
    }
  }
}

export {};
