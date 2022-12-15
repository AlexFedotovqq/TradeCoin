import "../styles/globals.css";

import { Layout } from "../components/Layout";

import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";

const XDC = {
  id: 50,
  name: "XDC",
  network: "XDC",
  nativeCurrency: {
    symbol: "XDC",
  },
  rpcUrls: {
    default: "https://rpc.xinfin.network",
  },
  testnet: false,
};

const XDCt = {
  id: 51,
  name: "XDC testnet",
  network: "XDCt",
  nativeCurrency: {
    symbol: "XDCt",
  },
  rpcUrls: {
    default: "https://rpc.apothem.network/",
  },
  testnet: true,
};

const mumbai = {
  id: 80001,
  name: "Mumbai",
  network: "MATIC",
  nativeCurrency: {
    symbol: "MATIC",
  },
  rpcUrls: {
    default: "https://rpc-mumbai.maticvigil.com",
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [XDC, XDCt, mumbai],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (
          chain.id === XDC.id ||
          chain.id === XDCt.id ||
          chain.id === mumbai.id
        )
          return { http: chain.rpcUrls.default };
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
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
