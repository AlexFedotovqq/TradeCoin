import Image from "next/image";
import { useState } from "react";

import SuccessMessage from "@/components/Exchange/SuccessMessage";
import ExchangeButton from "@/components/Exchange/ExchangeButton";
import TokenSelector from "@/components/Exchange/TokenSelector";
import WarningTransition from "@/components/Exchange/WarningTransition";

import { useTokensPage } from "@/hooks/tokens";

export default function Exchange() {
  const { data: tokens, isLoading } = useTokensPage(1);

  const [isLoadingSwap, setIsLoadingSwap] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // tx status
  const [isSuccess, setIsSuccess] = useState(false);

  const [query, setQuery] = useState("");

  // warning enable via true
  const [show, setShow] = useState(false);

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [tokenA, setTokenA] = useState({
    id: 1,
    name: "TradeC0",
    address: "41377a640a0bf48d4c5ab79f63d2e4885659b82a29",
    imageUrl: "/TradeC0.jpg",
  });
  const [tokenB, setTokenB] = useState({
    id: 2,
    name: "TradeC1",
    address: "4191447b0204cf766eaf5f3f44d31370c870ec3f45",
    imageUrl: "/TradeC1.jpg",
  });

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
              <div className="flex flex-col items-center justify-center sm:flex-row sm:items-center sm:justify-start">
                <button
                  type="submit"
                  onClick={() => setOpenTokenA(true)}
                  className="relative inline-flex items-center justify-center rounded-md border border-transparent bg-white px-3 py-1.5 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 mb-2 sm:mb-0"
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
                    width="24px"
                    height="24px"
                    viewBox="-2.88 -2.88 29.76 29.76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 rounded-full text-gray-900"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="#11182"
                      strokeWidth="0.144"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M10 6L7 3M7 3L4 6M7 3V17M14 18L17 21M17 21L20 18M17 21V7"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                </button>

                <input
                  onChange={(event) => setSwapAmount(event.target.value)}
                  className="relative block rounded-md border-0 py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm sm:leading-5 ml-0 sm:ml-4"
                  placeholder="0"
                />
              </div>
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
                    width="24px"
                    height="24px"
                    viewBox="-2.88 -2.88 29.76 29.76"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 rounded-full text-gray-900"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="#11182"
                      strokeWidth="0.144"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M10 6L7 3M7 3L4 6M7 3V17M14 18L17 21M17 21L20 18M17 21V7"
                        stroke="#111827"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
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
            isLoading={isLoadingSwap}
            setIsLoading={setIsLoadingSwap}
            swap={swap}
          />
        </div>
      </div>

      {!isLoading ? (
        <div>
          <TokenSelector
            tokens={tokens.items}
            open={openTokenA}
            setOpen={setOpenTokenA}
            token={tokenA}
            setToken={setTokenA}
            query={query}
            setQuery={setQuery}
          />

          <TokenSelector
            tokens={tokens.items}
            open={openTokenB}
            setOpen={setOpenTokenB}
            token={tokenB}
            setToken={setTokenB}
            query={query}
            setQuery={setQuery}
          />
        </div>
      ) : null}
    </div>
  );
}
