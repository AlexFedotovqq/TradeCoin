import Image from "next/image";
import { useState } from "react";

import SuccessMessage from "@/components/Exchange/SuccessMessage";
import ExchangeButton from "@/components/Exchange/ExchangeButton";
import TokenSelector from "@/components/Exchange/TokenSelector";
import WarningTransition from "@/components/Exchange/WarningTransition";

import { tokens } from "@/utils/tokens";

export default function Exchange() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // tx status
  const [isSuccess, setIsSuccess] = useState(false);

  const [query, setQuery] = useState("");

  // warning enable via true
  const [show, setShow] = useState(false);

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);

  const [swapAmount, setSwapAmount] = useState(0);

  async function swap() {
    try {
      setLoadingText("Exchanging..."); // Set loading text

      // Simulate an asynchronous operation (e.g., API call)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSuccess(true);
      setLoadingText("Success!"); // Update loading text
      setTimeout(() => {
        setIsSuccess(false);
        setLoadingText(""); // Reset loading text
      }, 5000);
    } catch (error) {
      console.error("Error during swap:", error);
      setLoadingText("Error. Please try again."); // Set error text
    }
  }

  return (
    <div className="overflow-hidden bg-gray-800 py-16 px-8 h-screen">
      <div className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          <WarningTransition show={show} setShow={setShow} />
          <SuccessMessage isSuccess={isSuccess} />
        </div>
      </div>

      <div className="relative mx-auto max-w-sm">
        <h2 className="text-center text-4xl font-bold tracking-tight text-white">
          TradeCoin Exchange
        </h2>

        <div className="rounded-2xl mt-5 bg-gray-700 p-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="number"
              className="block text-lg text-bold text-center mt-2.5 font-medium text-white"
            >
              Exchange cryptocurrency
            </label>
            <div className="flex justify-center mt-2.5 items-center">
              <button
                type="submit"
                onClick={() => setOpenTokenA(true)}
                className="relative inline-flex items-center justify-center right-2 rounded-md border border-transparent bg-white px-3 py-1.5 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                <Image
                  className="h-6 w-6 rounded-full"
                  width={400}
                  height={400}
                  src={tokenA.imageUrl}
                  alt="tokenA"
                />

                <span className="ml-2">{tokenA.name}</span>
                <svg
                  fill="#000000"
                  width="20px"
                  height="25px"
                  viewBox="-8.5 0 32 32"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <g id="SVGRepo_iconCarrier">
                    <title>angle-down</title>
                    <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>{" "}
                  </g>
                </svg>
              </button>

              <input
                onChange={(event) => setSwapAmount(event.target.value)}
                className="relative w-full items-center justify-center block rounded-md border-0 py-2  px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
                placeholder="0"
              />
            </div>

            <label
              htmlFor="number"
              className="block mt-2.5 text-lg text-bold text-center font-medium text-white"
            >
              For cryptocurrency
            </label>
          </div>

          <div className="flex justify-center items-center">
            <div className="relative mt-2.5">
              <div className="flex items-center">
                <button
                  type="submit"
                  onClick={() => setOpenTokenB(true)}
                  className="relative inline-flex items-center justify-center rounded-md border border-transparent bg-white px-3 py-1.5 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  <Image
                    className="h-6 w-6 rounded-full"
                    width={400}
                    height={400}
                    src={tokenB.imageUrl}
                    alt="tokenB"
                  />

                  <span className="ml-2">{tokenB.name}</span>
                  <svg
                    fill="#000000"
                    width="20px"
                    height="25px"
                    viewBox="-8.5 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <g id="SVGRepo_iconCarrier">
                      <title>angle-down</title>
                      <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>{" "}
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="rounded-2xl mt-5 bg-gray-600 p-1">
            <div className="flex justify-center items-center">
              <span className="relative text-white  items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-base font-medium">
                {swapAmount} {tokenA.name} =
              </span>
              <span className="relative right-5 text-white inline-flex items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-base font-medium">
                {tokenB.name}
              </span>
            </div>
          </div>

          <ExchangeButton
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            swap={swap}
          />
        </div>
      </div>

      {/* tokenA */}
      <TokenSelector
        tokens={tokens}
        open={openTokenA}
        setOpen={setOpenTokenA}
        token={tokenA}
        setToken={setTokenA}
        query={query}
        setQuery={setQuery}
      />

      {/* tokenB */}
      <TokenSelector
        tokens={tokens}
        open={openTokenB}
        setOpen={setOpenTokenB}
        token={tokenB}
        setToken={setTokenB}
        query={query}
        setQuery={setQuery}
      />
    </div>
  );
}
