import { tokens } from "@/utils/tokens";
import { classNames } from "@/utils/classNames";
import Image from "next/image";

import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import {
  CheckCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";

export default function Exchange() {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  // tx status
  const [isSuccess, setIsSuccess] = useState(false);

  const [query, setQuery] = useState("");

  // warning
  const [show, setShow] = useState(false);

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);

  const [swapAmount, setSwapAmount] = useState(0);

  const filteredTokens =
    query === ""
      ? tokens
      : tokens.filter((token) => {
          return token.name.toLowerCase().includes(query.toLowerCase());
        });
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
      <>
        <div
          aria-live="assertive"
          className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6"
        >
          <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
            <Transition
              show={show}
              as={Fragment}
              enter="transform ease-out duration-300 transition"
              enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
              enterTo="translate-y-0 opacity-100 sm:translate-x-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-yellow-50 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon
                        className="h-6 w-6 text-yellow-400"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="ml-3 w-0 flex-1 pt-0.5">
                      <p className="text-sm font-medium text-gray-900">
                        Warning!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Don&apos;t forget to connect your wallet
                      </p>
                    </div>

                    <div className="ml-4 flex flex-shrink-0">
                      <button
                        type="button"
                        className="inline-flex rounded-md bg-yellow-50 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={() => {
                          setShow(false);
                        }}
                      >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
            {isSuccess && (
              <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-green-50 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <CheckCircleIcon
                        className="h-5 w-5 text-green-400"
                        aria-hidden="true"
                      />
                    </div>

                    <p className="ml-3 text-sm font-medium text-green-800">
                      The transaction has succeeded.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>

      <div className="relative mx-auto max-w-sm">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white">
            TradeCoin Exchange
          </h2>
        </div>
        <div className="rounded-2xl mt-5  bg-gray-700 p-4">
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
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
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
          <div className="rounded-2xl mt-5  bg-gray-600 p-1">
            <div className="flex justify-center items-center">
              <span className="relative text-white  items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-base font-medium">
                {swapAmount} {tokenA.name} =
              </span>
              <span className="relative right-5 text-white inline-flex items-center justify-center rounded-md border border-transparent px-3 py-1.5 text-base font-medium">
                {tokenB.name}
              </span>
            </div>
          </div>

          <button
            type="submit"
            onClick={async () => {
              setIsLoading(true);
              try {
                await swap();
              } catch (error) {
                console.error("Error during swap:", error);
              } finally {
                setIsLoading(false);
              }
            }}
            className={`relative mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2 ${
              isLoading ? "pointer-events-none" : ""
            }`}
          >
            {isLoading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <span className="button__text">{loadingText || "Exchange"}</span>
            )}

            <>
              <svg
                className="button__svg"
                role="presentational"
                viewBox="0 0 600 600"
              >
                <svg
                  className="button__svg"
                  role="presentational"
                  viewBox="0 0 600 600"
                >
                  <defs>
                    <clipPath id="myClip">
                      <rect x="0" y="0" width="100%" height="50%" />
                    </clipPath>
                  </defs>
                  <g clipPath="url(#myClip)">
                    <g id="money">
                      <path
                        d="M441.9,116.54h-162c-4.66,0-8.49,4.34-8.62,9.83l.85,278.17,178.37,2V126.37C450.38,120.89,446.56,116.52,441.9,116.54Z"
                        fill="#699e64"
                        stroke="#323c44"
                        strokeMiterlimit="10"
                        strokeWidth="14"
                      />
                      <path
                        d="M424.73,165.49c-10-2.53-17.38-12-17.68-24H316.44c-.09,11.58-7,21.53-16.62,23.94-3.24.92-5.54,4.29-5.62,8.21V376.54H430.1V173.71C430.15,169.83,427.93,166.43,424.73,165.49Z"
                        fill="#699e64"
                        stroke="#323c44"
                        strokeMiterlimit="10"
                        strokeWidth="14"
                      />
                    </g>
                    <g id="creditcard">
                      <path
                        d="M372.12,181.59H210.9c-4.64,0-8.45,4.34-8.58,9.83l.85,278.17,177.49,2V191.42C380.55,185.94,376.75,181.57,372.12,181.59Z"
                        fill="#a76fe2"
                        stroke="#323c44"
                        strokeMiterlimit="10"
                        strokeWidth="14"
                      />
                      <path
                        d="M347.55,261.85H332.22c-3.73,0-6.76-3.58-6.76-8v-35.2c0-4.42,3-8,6.76-8h15.33c3.73,0,6.76,3.58,6.76,8v35.2C354.31,258.27,351.28,261.85,347.55,261.85Z"
                        fill="#ffdc67"
                      />
                      <path
                        d="M249.73,183.76h28.85v274.8H249.73Z"
                        fill="#323c44"
                      />
                    </g>
                  </g>
                  <g id="wallet">
                    <path
                      d="M478,288.23h-337A28.93,28.93,0,0,0,112,317.14V546.2a29,29,0,0,0,28.94,28.95H478a29,29,0,0,0,28.95-28.94h0v-229A29,29,0,0,0,478,288.23Z"
                      fill="#a4bdc1"
                      stroke="#323c44"
                      strokeMiterlimit="10"
                      strokeWidth="14"
                    />
                    <path
                      d="M512.83,382.71H416.71a28.93,28.93,0,0,0-28.95,28.94h0V467.8a29,29,0,0,0,28.95,28.95h96.12a19.31,19.31,0,0,0,19.3-19.3V402a19.3,19.3,0,0,0-19.3-19.3Z"
                      fill="#a4bdc1"
                      stroke="#323c44"
                      strokeMiterlimit="10"
                      strokeWidth="14"
                    />
                    <path
                      d="M451.46,435.79v7.88a14.48,14.48,0,1,1-29,0v-7.9a14.48,14.48,0,0,1,29,0Z"
                      fill="#a4bdc1"
                      stroke="#323c44"
                      strokeMiterlimit="10"
                      strokeWidth="14"
                    />
                    <path
                      d="M147.87,541.93V320.84c-.05-13.2,8.25-21.51,21.62-24.27a42.71,42.71,0,0,1,7.14-1.32l-29.36-.63a67.77,67.77,0,0,0-9.13.45c-13.37,2.75-20.32,12.57-20.27,25.77l.38,221.24c-1.57,15.44,8.15,27.08,25.34,26.1l33-.19c-15.9,0-28.78-10.58-28.76-25.93Z"
                      fill="#7b8f91"
                    />
                    <path
                      d="M148.16,343.22a6,6,0,0,0-6,6v92a6,6,0,0,0,12,0v-92A6,6,0,0,0,148.16,343.22Z"
                      fill="#323c44"
                    />
                  </g>
                </svg>
              </svg>
            </>
          </button>
        </div>
      </div>

      {/* tokenA */}
      <Transition.Root show={openTokenA} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenTokenA}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold  text-gray-900"
                      >
                        Tokens
                      </Dialog.Title>
                      <Combobox as="div" value={tokenA} onChange={setTokenA}>
                        <div className="relative mt-2">
                          <Combobox.Input
                            className="rounded-md border-0 bg-white py-1.5 pl-2 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(token) => token?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-900"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredTokens.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredTokens.map((token) => (
                                <Combobox.Option
                                  key={token.id}
                                  value={token}
                                  className={({ active }) =>
                                    classNames(
                                      "relative cursor-default select-none py-2 pl-4 pr-12",
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <div className="flex items-center">
                                        <Image
                                          src={token.imageUrl}
                                          alt={token.name}
                                          className="h-6 w-6 flex-shrink-0 rounded-full"
                                          width={400}
                                          height={400}
                                        />
                                        <span
                                          className={classNames(
                                            "ml-3 truncate  ",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {token.name}
                                        </span>
                                      </div>

                                      {selected && (
                                        <span
                                          className={classNames(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setOpenTokenA(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* tokenB */}
      <Transition.Root show={openTokenB} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpenTokenB}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold text-gray-900"
                      >
                        Tokens
                      </Dialog.Title>
                      <Combobox as="div" value={tokenB} onChange={setTokenB}>
                        <div className="relative mt-2  ">
                          <Combobox.Input
                            className=" rounded-md border-0 bg-white py-1.5 pl-2 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(token) => token?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-900"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredTokens.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredTokens.map((token) => (
                                <Combobox.Option
                                  key={token.id}
                                  value={token}
                                  className={({ active }) =>
                                    classNames(
                                      "relative cursor-default select-none py-2 pl-4 pr-12",
                                      active
                                        ? "bg-indigo-600 text-white"
                                        : "text-gray-900"
                                    )
                                  }
                                >
                                  {({ active, selected }) => (
                                    <>
                                      <div className="flex items-center">
                                        <Image
                                          src={token.imageUrl}
                                          alt={token.name}
                                          className="h-6 w-6 flex-shrink-0 rounded-full"
                                          width={400}
                                          height={400}
                                        />
                                        <span
                                          className={classNames(
                                            "ml-3 truncate",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {token.name}
                                        </span>
                                      </div>

                                      {selected && (
                                        <span
                                          className={classNames(
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                            active
                                              ? "text-white"
                                              : "text-indigo-600"
                                          )}
                                        >
                                          <CheckIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        </span>
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))}
                            </Combobox.Options>
                          )}
                        </div>
                      </Combobox>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      onClick={() => setOpenTokenB(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
