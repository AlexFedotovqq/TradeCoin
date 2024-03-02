declare global {
  namespace NodeJS {
    interface ProcessEnv {
      zkAppPK: string;
      pk: string;
      tokenPK1: string;
      tokenPK2: string;
      tokenPK3: string;
      tokenPK4: string;
      pairPK: string;
    }
  }
}

export {};
