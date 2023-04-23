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

const people = [
  {
    id: 1,
    name: "BNB",
    imageUrl:
      "data:image/png;base64,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",
  },
  {
    id: 2,
    name: "FIL",
    imageUrl:
      "data:image/png;base64,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",
  },
  {
    id: 3,
    name: "ETH",
    imageUrl:
      "data:image/png;base64,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",
  },

  // More users...
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
export default function Exchange() {
  const [query, setQuery] = useState("");

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [tokenA, setTokenA] = useState({
    address: "41377a640a0bf48d4c5ab79f63d2e4885659b82a29",
    name: "TradeC0",
    image:
      "data:image/png;base64,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",
  });
  const [tokenB, setTokenB] = useState({
    address: "4191447b0204cf766eaf5f3f44d31370c870ec3f45",
    name: "TradeC1",
    image:
      "data:image/png;base64,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",
  });

  const [swapAmount, setSwapAmount] = useState(0);

  const filteredPeople =
    query === ""
      ? people
      : people.filter((person) => {
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
                className="relative inline-flex items-center justify-center rounded-md border border-transparent bg-white px-3 py-1.5 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
              >
                <img
                  className="h-6 w-6 rounded-full"
                  src={tokenA.image}
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
                className="block rounded-md border-0 py-2 pl-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
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
                    src={tokenB.image}
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

                          {filteredPeople.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredPeople.map((person) => (
                                <Combobox.Option
                                  key={person.id}
                                  value={person.name}
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

                          {filteredPeople.length > 0 && (
                            <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {filteredPeople.map((person) => (
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
