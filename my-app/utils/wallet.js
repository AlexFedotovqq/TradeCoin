import { signal, effect } from "@preact/signals-react";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "MINA";

async function connectWallet() {
  const accounts = await window.mina.requestAccounts();
  const displayAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(
    -4,
  )}`;
  window.localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify(displayAddress),
  );
}

function getWalletAddress() {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (value === null) return;
    return JSON.parse(value);
  }
}

export const WalletButton = () => {
  const [isClient, setIsClient] = useState(false);

  const displayAddress = signal(getWalletAddress());

  useEffect(() => {
    setIsClient(true);
  });

  return (
    <>
      {isClient ? (
        <div className="flex items-center md:ml-12">
          {!displayAddress ? (
            <button
              onClick={() => connectWallet()}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5 "
            >
              Connect Wallet
            </button>
          ) : (
            <button className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5 ">
              {displayAddress}
            </button>
          )}
        </div>
      ) : null}
    </>
  );
};
