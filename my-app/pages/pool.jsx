import { classNames } from "@/utils/classNames";

import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

export default function Pool() {
  const [data, setData] = useState([]);
  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");

  const [tokenAQuantity, setTokenAQuantity] = useState(1);
  const [tokenBQuantity, setTokenBQuantity] = useState(1);

  const [withdrawalQuantity, setWithdrawalQuantity] = useState("");

  return (
    <div className="bg-gray-800 h-screen">
      <div className="overflow-hidden bg-gray-800 py-16 px-8  ">
        <div className="relative mx-auto max-w-4xl">
          <div className="text-center ">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              TradeCoin Pools
            </h2>
          </div>

          <div className="mx-auto flex items-center justify-center py-2 px-4 ">
            <div className="mt-5 flex">
              <Disclosure as="div" key="Add new pair">
                {({ open }) => (
                  <>
                    <h3 className="flex items-center justify-center">
                      <Disclosure.Button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700">
                        <span
                          className={classNames(
                            open ? "text-white-200" : "text-white",
                            "text-sm font-medium",
                          )}
                        >
                          Add new pair
                        </span>

                        <span className="ml-6 flex items-center justify-center">
                          {open ? (
                            <MinusIcon
                              className="block h-6 w-6 text-white group-hover:text-indigo-500"
                              aria-hidden="true"
                            />
                          ) : (
                            <PlusIcon
                              className="block h-6 w-6 text-white group-hover:text-gray-500"
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
                              onChange={(event) =>
                                setTokenA(event.target.value)
                              }
                              className="block w-full bg-white rounded-md py-3 px-4 pl-25"
                              placeholder="…"
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
                              onChange={(event) =>
                                setTokenB(event.target.value)
                              }
                              className="block w-full rounded-md bg-white py-3 px-4 pl-25"
                              placeholder="…"
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

          <div className="mt-5 overflow-hidden rounded-lg bg-gray-700 shadow p-6 ">
            <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2 ">
              {data?.map((pool) => (
                <li
                  key={pool.pairAddress}
                  className="col-span-1 rounded-lg bg-white shadow"
                >
                  <div className="w-full items-center justify-between p-5">
                    <h3 className="flex items-center space-x-3 justify-center text-sm font-medium text-gray-900">
                      {pool.token0Name}
                    </h3>
                    <h3 className="truncate flex items-center space-x-3 justify-center text-sm font-medium text-gray-500">
                      {pool.token0Address}
                    </h3>
                    <h3 className="flex items-center space-x-3 justify-center text-sm font-medium text-gray-900">
                      {pool.token1Name}
                    </h3>
                    <h3 className="truncate flex items-center space-x-3 justify-center text-sm font-medium text-gray-500">
                      {pool.token1Address}
                    </h3>
                    <h3 className="mt-3 mb-6 flex items-center space-x-3 justify-center text-sm font-medium text-gray-900">
                      Total Supply: {pool.totalSupply}
                    </h3>
                  </div>

                  <div className="-mt-px flex divide-x divide-gray-300">
                    <div className="flex flex-1 justify-center">
                      <Disclosure as="div" key="Add new pair">
                        {({ open }) => (
                          <>
                            <div className="flex items-center justify-center py-3">
                              <Disclosure.Button className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-1 py-2 text-base font-medium text-white hover:bg-red-700">
                                <span
                                  className={classNames(
                                    open ? "text-red-200" : "text-white",
                                    "text-sm font-bold",
                                  )}
                                >
                                  Add
                                </span>
                                <span className="ml-5 flex items-center">
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
                            </div>

                            <Disclosure.Panel
                              as="div"
                              className="prose prose-sm pb-6"
                            >
                              <div className="relative mt-1 ml-1 mr-1 rounded-md shadow-sm sm:col-span-2">
                                <input
                                  type="text"
                                  name="number"
                                  id="number"
                                  onChange={(event) =>
                                    setTokenAQuantity(event.target.value)
                                  }
                                  className="block w-full rounded-md border-gray-300 mb-2 py-3 px-4 pl-25 bg-red-50"
                                  placeholder="1"
                                />

                                <input
                                  type="text"
                                  name="number"
                                  id="number"
                                  onChange={(event) =>
                                    setTokenBQuantity(event.target.value)
                                  }
                                  className="block w-full rounded-md border-gray-300 py-3 px-4 pl-25  bg-red-50"
                                  placeholder="1"
                                />
                              </div>

                              <div className="ml-2 mt-2 inline-flex justify-center rounded-md shadow lg:flex-shrink-0">
                                <a
                                  onClick={() =>
                                    addLiquidity(
                                      pool.token0Address,
                                      pool.token1Address,
                                      pool.pairAddress,
                                    )
                                  }
                                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                >
                                  Add
                                </a>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                    <div className="-ml-px flex w-0 flex-1 justify-center">
                      <Disclosure as="div">
                        {({ open }) => (
                          <>
                            <div className="flex items-center justify-center py-3">
                              <Disclosure.Button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-1 py-2 text-base font-medium text-white hover:bg-indigo-700">
                                <span
                                  className={classNames(
                                    open ? "text-indigo-200" : "text-white",
                                    "text-sm font-bold",
                                  )}
                                >
                                  Remove
                                </span>
                                <span className="ml-0 flex items-center">
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
                            </div>
                            <Disclosure.Panel
                              as="div"
                              className="prose prose-sm pb-6"
                            >
                              <div className="relative mt-1 ml-1 mr-1 rounded-md shadow-sm sm:col-span-2">
                                <input
                                  type="text"
                                  name="number"
                                  id="number"
                                  onChange={(event) =>
                                    setWithdrawalQuantity(event.target.value)
                                  }
                                  className="block w-full rounded-md bg-indigo-50 py-3 px-4 pl-25"
                                  placeholder="1"
                                />
                              </div>
                              <div className="ml-2 mt-2 lg:flex-shrink-0 inline-flex rounded-md shadow">
                                <a
                                  onClick={() =>
                                    removeLiquidity(pool.pairAddress)
                                  }
                                  className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                                >
                                  Add
                                </a>
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
