import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { ethers } from "ethers";

import { getContractInfo, getERC20, getPair } from "@/utils/contracts";

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

const tokens = [
  {
    id: 1,
    name: "TradeC0",
    address: "41377a640a0bf48d4c5ab79f63d2e4885659b82a29",
    imageUrl: "/TradeC0.jpg",
  },
  {
    id: 2,
    name: "TradeC1",
    address: "4191447b0204cf766eaf5f3f44d31370c870ec3f45",
    imageUrl: "/TradeC1.jpg",
  },
  {
    id: 3,
    name: "Dspyt",
    address: "412baca645bf7d8249eee9fd1b67dd2457dc76cdd6",
    imageUrl: "/Dspyt.png",
  },
  {
    id: 4,
    name: "TradeCoin",
    address: "413e152ac3ebbb60fd4af26fcfa0938189383a38f1",
    imageUrl: "/TradeCoin.png",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Exchange() {
  const [query, setQuery] = useState("");

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);

  const [swapAmount, setSwapAmount] = useState(0);

  const filteredTokens =
    query === ""
      ? tokens
      : tokens.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  async function swap() {
    const { addressFactory, abiFactory } = getContractInfo();
    const { abiPair } = getPair();
    const { abiERC20 } = getERC20();

    const contract = await tronWeb.contract(abiFactory, addressFactory);

    const pairAddress = await contract
      .getPair(tokenA.address, tokenB.address)
      .call();

    const pair = await tronWeb.contract(abiPair, pairAddress);

    const orderIn = (await pair.token0().call()) === tokenA ? 0 : 1;
    const orderOut = (await pair.token1().call()) === tokenB ? 1 : 0;

    const token = await tronWeb.contract(abiERC20, tokenA.address);

    await token.transfer(pairAddress, expandTo18Decimals(swapAmount)).send();

    const Preserves = await pair.getReserves().call();

    var amountInWithFee = expandTo18Decimals(swapAmount).mul(996);

    var numerator = amountInWithFee.mul(Preserves[orderOut]);
    var denominator = Preserves[orderIn].mul(1000).add(amountInWithFee);
    var amountOut = numerator / denominator;

    const expectedOutputAmount = ethers.BigNumber.from(String(amountOut));

    const address = await tronWeb.defaultAddress.base58;

    await pair.swap(0, expectedOutputAmount, address, "0x").send();
  }

  return (
    <div className="overflow-hidden bg-gray-800 py-16 px-8 h-screen">
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
                <img
                  className="h-6 w-6 rounded-full"
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
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <title>angle-down</title>{" "}
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
                className="block rounded-md border-0 py-2  text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
                placeholder=" 0.0"
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
                  <img
                    className="h-6 w-6 rounded-full"
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
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {" "}
                      <title>angle-down</title>{" "}
                      <path d="M7.28 20.040c-0.24 0-0.44-0.080-0.6-0.24l-6.44-6.44c-0.32-0.32-0.32-0.84 0-1.2 0.32-0.32 0.84-0.32 1.2 0l5.84 5.84 5.84-5.84c0.32-0.32 0.84-0.32 1.2 0 0.32 0.32 0.32 0.84 0 1.2l-6.44 6.44c-0.16 0.16-0.4 0.24-0.6 0.24z"></path>{" "}
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            onClick={() => swap()}
            className="relative mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-800 focus:ring-offset-2"
          >
            <span className="button__text">
              <span>E</span>
              <span>x</span>c
            </span>
            <span>
              <span>h</span>
              <span>a</span>
              <span>n</span>
              <span>g</span>
              <span>e</span>
            </span>
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
                  <path d="M249.73,183.76h28.85v274.8H249.73Z" fill="#323c44" />
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
                            displayValue={(person) => person?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-900"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredTokens.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredTokens.map((person) => (
                                <Combobox.Option
                                  key={person.id}
                                  value={person}
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
                                        <img
                                          src={person.imageUrl}
                                          alt=""
                                          className="h-6 w-6 flex-shrink-0  rounded-full"
                                        />
                                        <span
                                          className={classNames(
                                            "ml-3 truncate  ",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {person.name}
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
                        className="text-base font-semibold  text-gray-900"
                      >
                        Tokens
                      </Dialog.Title>
                      <Combobox as="div" value={tokenB} onChange={setTokenB}>
                        <div className="relative mt-2  ">
                          <Combobox.Input
                            className=" rounded-md border-0 bg-white py-1.5 pl-2 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            onChange={(event) => setQuery(event.target.value)}
                            displayValue={(person) => person?.name}
                          />
                          <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                            <ChevronUpDownIcon
                              className="h-5 w-5 text-gray-900"
                              aria-hidden="true"
                            />
                          </Combobox.Button>

                          {filteredTokens.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredTokens.map((person) => (
                                <Combobox.Option
                                  key={person.id}
                                  value={person}
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
                                        <img
                                          src={person.imageUrl}
                                          alt=""
                                          className="h-6 w-6 flex-shrink-0  rounded-full"
                                        />
                                        <span
                                          className={classNames(
                                            "ml-3 truncate  ",
                                            selected && "font-semibold"
                                          )}
                                        >
                                          {person.name}
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
