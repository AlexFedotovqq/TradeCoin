import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";

import { Layout } from "@/components/Layout";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { useState } from "react";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { polygonMumbai, fantom } from "wagmi/chains";

const XDC = {
  id: 50,
  name: "XDC",
  network: "xdc",
  iconUrl:
    "https://imgs.search.brave.com/0UQVup3GSu26EZXQ_LrVuwJV3D-7ORH43soEoDJjL-4/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvMjkxMi9s/YXJnZS94ZGMtaWNv/bi5wbmc_MTYzMzcw/MDg5MA",
  nativeCurrency: {
    symbol: "XDC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.xinfin.network"],
    },
  },
  testnet: false,
};

const Mantle = {
  id: 5001,
  name: "Mantle",
  network: "mantle",
  iconUrl: "https://www.mantle.xyz/logo-lockup.svg",
  nativeCurrency: {
    symbol: "BIT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.mantle.xyz/"],
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [XDC, polygonMumbai, fantom, Mantle],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === XDC.id || chain.id === Mantle.id)
          return { http: chain.rpcUrls.default.http[0] };
        return null;
      },
    }),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function MyApp({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState} />
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default MyApp;
