import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { Fragment, useState } from "react";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";

import { getContractInfo, getERC20, getPair } from "@/utils/contracts";

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

const activityItems = [
  {
    user: {
      asset: "TradeC0",
      address: "41377a640a0bf48d4c5ab79f63d2e4885659b82a29",
      imageUrl: "/TradeC0.jpg",
    },
    apr: "0.018901%",
    balance: "0.0000",
    holdings: "0",
    tvl: "$124,668.43",
  },

  {
    user: {
      asset: "TradeC1",
      address: "4191447b0204cf766eaf5f3f44d31370c870ec3f45",
      imageUrl: "/TradeC1.jpg",
    },
    apr: "0.018901%",
    branch: "main",
    balance: "0.0000",
    holdings: "0",
    tvl: "$124,668.43",
  },
  {
    user: {
      asset: "Dspyt",
      address: "412baca645bf7d8249eee9fd1b67dd2457dc76cdd6",
      imageUrl: "/Dspyt.png",
    },
    apr: "0.018901%",
    branch: "main",
    balance: "0.0000",
    holdings: "0",
    tvl: "$124,668.43",
  },
  {
    user: {
      asset: "TradeCoin",
      address: "413e152ac3ebbb60fd4af26fcfa0938189383a38f1",
      imageUrl: "/TradeCoin.png",
    },
    apr: "0.018901%",
    branch: "main",
    balance: "0.0000",
    holdings: "0",
    tvl: "$124,668.43",
  },
];

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Pool() {
  const fetchPools = async (name) => {
    const res = await fetch(`/api/${name}`);
    return res.json();
  };

  const [query, setQuery] = useState("");

  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);

  const [openTokenA, setOpenTokenA] = useState(false);
  const [openTokenB, setOpenTokenB] = useState(false);

  const [swapAmount, setSwapAmount] = useState(0);

  const { data, status } = useQuery(["pools"], () => fetchPools("test"));

  const [tokenAQuantity, setTokenAQuantity] = useState(1);
  const [tokenBQuantity, setTokenBQuantity] = useState(1);

  const [withdrawalQuantity, setWithdrawalQuantity] = useState("");

  const filteredTokens =
    query === ""
      ? tokens
      : tokens.filter((token) => {
          return token.name.toLowerCase().includes(query.toLowerCase());
        });

  async function startUpload() {
    const { addressFactory, abiFactory } = getContractInfo();
    const contract = await tronWeb.contract(abiFactory, addressFactory);
    await contract.createPair(tokenA, tokenB).send({ feeLimit: 4000000000 });
  }

  async function addLiquidity(address0, address1, pairAddress) {
    const { abiERC20 } = getERC20();
    const { abiPair } = getPair();
    const address = await tronWeb.defaultAddress.base58;

    const token0 = await tronWeb.contract(abiERC20, address0);
    const token1 = await tronWeb.contract(abiERC20, address1);
    const pair = await tronWeb.contract(abiPair, pairAddress);

    await token0
      .transfer(pairAddress, expandTo18Decimals(tokenAQuantity))
      .send();

    await token1
      .transfer(pairAddress, expandTo18Decimals(tokenBQuantity))
      .send();

    await pair.mint(address).send();
  }

  async function removeLiquidity(pairAddress) {
    const { abiPair } = getPair();
    const address = await tronWeb.defaultAddress.base58;

    const pair = await tronWeb.contract(abiPair, pairAddress);

    await pair
      .transfer(pair.address, expandTo18Decimals(withdrawalQuantity))
      .send();

    await pair.burn(address).send();
  }

  return (
    <div className=" bg-gray-800 py-16 px-8 ">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-white">
          TradeCoin Pools
        </h2>
      </div>
      <div className="mx-auto flex items-center justify-center py-2 px-4">
        <div className="mt-5 flex">
          <Disclosure as="div" key="Add new pair">
            {({ open }) => (
              <>
                <h3 className="flex items-center justify-center">
                  <Disclosure.Button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700">
                    <span
                      className={classNames(
                        open ? "text-white-200" : "text-white",
                        "text-sm font-medium"
                      )}
                    >
                      Add new pair
                    </span>

                    <span className="ml-6 flex items-center justify-center">
                      {open ? (
                        <MinusIcon
                          className="block h-6 w-6 text-gray-900 group-hover:text-indigo-500"
                          aria-hidden="true"
                        />
                      ) : (
                        <PlusIcon
                          className="block h-6 w-6 text-gray-900 group-hover:text-gray-500"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </Disclosure.Button>
                </h3>

                <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                  <div className="rounded-2xl mt-5  bg-gray-700 p-4">
                    <div className="mt- sm:col-span-2">
                      <label
                        htmlFor="number"
                        className="block text-center font-medium text-white"
                      >
                        Cryptocurrency
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label className="sr-only">Cryptocurrency</label>
                        </div>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          onChange={(event) => setTokenA(event.target.value)}
                          className="block w-full bg-white rounded-md py-3 px-4 pl-25"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="mt-4 sm:col-span-2">
                      <label
                        htmlFor="number"
                        className="block text-center font-medium text-white"
                      >
                        Cryptocurrency
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label className="sr-only">Cryptocurrency</label>
                        </div>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          onChange={(event) => setTokenB(event.target.value)}
                          className="block w-full rounded-md bg-white py-3 px-4 pl-25"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="mt-9 flex lg:mt-2 lg:flex-shrink-0">
                      <div className="inline-flex rounded-md shadow">
                        <a
                          onClick={() => startUpload()}
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                        >
                          Add
                        </a>
                      </div>
                    </div>
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-gray-700 px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Combobox as="div" value={tokenA} onChange={setTokenA}>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="number"
                            className="block text-lg text-bold text-center mt-2.5 font-medium text-white"
                          >
                            Amount in TradeC1
                          </label>
                          <div className="flex justify-center mt-2.5 items-center">
                            <button
                              type="submit"
                              onClick={() => setOpenTokenB(true)}
                              className="relative inline-flex items-center justify-center right-2 rounded-md border border-transparent bg-white px-3 py-1.5 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
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

                            <input
                              type="tel"
                              name="phone-number"
                              id="phone-number"
                              autoComplete="tel"
                              onChange={(event) =>
                                setSwapAmount(event.target.value)
                              }
                              className="block rounded-md border-0 py-2  px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div className="sm:col-span-2">
                          <label
                            htmlFor="number"
                            className="block text-lg text-bold text-center mt-2.5 font-medium text-white"
                          >
                            Amount in TradeC0
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
                              onChange={(event) =>
                                setSwapAmount(event.target.value)
                              }
                              className="block rounded-md border-0 py-2  px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-5"
                              placeholder="0"
                            />
                          </div>
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

      <table className="mt-6 w-full whitespace-nowrap text-left">
        <colgroup>
          <col className="w-full sm:w-4/12" />
          <col className="lg:w-4/12" />
          <col className="lg:w-2/12" />
          <col className="lg:w-1/12" />
          <col className="lg:w-1/12" />
        </colgroup>

        <thead className="border-b border-white/10 text-sm leading-6 text-white">
          <tr>
            <th
              scope="col"
              className="py-2 pl-4 pr-8 font-semibold sm:pl-6 lg:pl-8"
            >
              ASSET
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold sm:table-cell"
            >
              VARIABLE APR
            </th>
            <th
              scope="col"
              className="py-2 pl-0 pr-4 text-right font-semibold sm:pr-8 sm:text-left lg:pr-20"
            >
              WALLET BALANCE
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-8 font-semibold md:table-cell lg:pr-20"
            >
              YOUR HOLDINGS
            </th>
            <th
              scope="col"
              className="hidden py-2 pl-0 pr-4 text-right font-semibold sm:table-cell sm:pr-6 lg:pr-8"
            >
              TVL
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {activityItems?.map((item) => (
            <tr key={item?.commit}>
              <td className="py-4 pl-4 pr-8 sm:pl-6 lg:pl-8">
                <div className="flex items-center gap-x-4">
                  <div className="flex justify-center mt-2.5 items-center">
                    <img
                      src={item?.user?.imageUrl}
                      alt=""
                      className="h-8 w-8 rounded-full bg-gray-800"
                    />
                    <button type="submit" onClick={() => setOpenTokenA(true)}>
                      <div className="truncate ml-2 text-sm font-medium leading-6 text-white">
                        {item?.user?.asset}
                      </div>
                    </button>
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-4 sm:table-cell sm:pr-8">
                <div className="flex gap-x-3">
                  <div className="font-mono text-sm leading-6 text-gray-400">
                    {item?.apr}
                  </div>
                </div>
              </td>
              <td className="py-4 pl-0 pr-4 text-sm leading-6 sm:pr-8 lg:pr-20">
                <div className="flex items-center justify-end gap-x-2 sm:justify-start">
                  <div className="text-gray-900 sm:hidden">{item?.tvl}</div>

                  <div className="flex gap-x-3">
                    <div className="font-mono text-sm leading-6 text-gray-400">
                      {item?.balance}
                    </div>
                  </div>
                </div>
              </td>
              <td className="hidden py-4 pl-0 pr-8 text-sm leading-6 text-gray-400 md:table-cell lg:pr-20">
                {item?.holdings}
              </td>
              <td className="hidden py-4 pl-0 pr-4 text-right text-sm leading-6 text-gray-400 sm:table-cell sm:pr-6 lg:pr-8">
                <div>{item?.tvl}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
