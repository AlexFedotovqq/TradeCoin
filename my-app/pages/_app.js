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
  iconUrl:
    "https://imgs.search.brave.com/0UQVup3GSu26EZXQ_LrVuwJV3D-7ORH43soEoDJjL-4/rs:fit:40:40:1/g:ce/aHR0cHM6Ly9hc3Nl/dHMuY29pbmdlY2tv/LmNvbS9jb2lucy9p/bWFnZXMvMjkxMi9s/YXJnZS94ZGMtaWNv/bi5wbmc_MTYzMzcw/MDg5MA",
  nativeCurrency: {
    symbol: "XDC",
  },
  rpcUrls: {
    default: "https://rpc.xinfin.network",
  },
  testnet: false,
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
  [XDC, mumbai],
  [
    publicProvider(),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === XDC.id || chain.id === mumbai.id)
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
