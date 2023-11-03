import React, { useState } from "react";

export const WalletButton = () => {
  const [appAddress, setAppAddress] = useState("");
  const [displayAddress, setDisplayAddress] = useState("");

  /*   useEffect(() => {

  const fetchData = async () => {
    const res = await fetch(`/api/login`);

    return res.json();
  };

  //if (appAddress === "") {
  console.log(fetchData());
  //}
}, [appAddress]); */

  async function connectWallet() {
    const address = "132424353";
    setAppAddress(address);
    setDisplayAddress(address.substring(0, 8) + "...");
    // post address
  }
  return (
    <>
      <div className="flex items-center md:ml-12">
        {!appAddress ? (
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
