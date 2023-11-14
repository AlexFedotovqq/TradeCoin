import React, { useState, useEffect } from "react";

export const WalletButton = () => {
  const [appAddress, setAppAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");

  async function connectWallet() {
    let accounts = await window.mina.requestAccounts();

    setDisplayAddress(`${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`);
  }
  return (
    <>
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
    </>
  );
};
