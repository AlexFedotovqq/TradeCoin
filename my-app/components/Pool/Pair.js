import { classNames } from "@/utils/classNames";
import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { signal, effect } from "@preact/signals-react";
import { Field, Mina, fetchAccount, PublicKey } from "o1js";

import { Dex } from "tradecoin-mina";

export function Pair() {
  const Berkeley = Mina.Network(
    "https://proxy.berkeley.minaexplorer.com/graphql",
  );

  Mina.setActiveInstance(Berkeley);

  const data = signal([
    {
      pairAddress: "B62qq1DMusFhTJHrcQPUnxVo1xMJK6wKCcurBfNLhACmsmmrzZAyqVE",
      token0Name: "TradeC0",
      token0Address: "B62qmETvJ7c1pWa7sA933UQeR8TrnMXx9iPnKQxLX2kaqVQKSaDPtjG",
      token1Name: "TradeC1",
      token1Address: "B62qo2kpW6HBz77vB7914P5pjDYavHNkjbTTQiQVtmNJTmrrYiFAojj",
    },
    {
      pairAddress: "12",
      token0Name: "TradeC0",
      token0Address: "asd",
      token1Name: "TradeCoin",
      token1Address: "asd",
    },
  ]);

  const withdrawalQuantity = signal(1);
  const tokenAQuantity = signal(1);
  const tokenBQuantity = signal(1);

  async function removeLiquidity() {
    const zkAppAddress = PublicKey.fromBase58(data.value[0].pairAddress);
    console.log(zkAppAddress.toBase58());
    console.log(await fetchAccount({ publicKey: zkAppAddress }));
    //await Dex.compile();
    const zkAppInstance = new Dex(zkAppAddress);
    console.log(zkAppInstance);
    //console.log(zkAppInstance.tokenX.get());
  }

  function addLiquidity() {}

  return (
    <div className="mt-5 overflow-hidden rounded-lg bg-gray-700 shadow p-6">
      <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        {data?.value?.map((pool) => (
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

            <div className="-mt-px flex">
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
                              (tokenAQuantity.value = event.target.value)
                            }
                            className="block w-full rounded-md border-gray-300 mb-2 py-3 px-4 pl-25 bg-red-50"
                            placeholder="1"
                          />

                          <input
                            type="text"
                            name="number"
                            id="number"
                            onChange={(event) =>
                              (tokenBQuantity.value = event.target.value)
                            }
                            className="block w-full rounded-md border-gray-300 py-3 px-4 pl-25 bg-red-50"
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
                              (withdrawalQuantity.value = event.target.value)
                            }
                            className="block w-full rounded-md bg-indigo-50 py-3 px-4 pl-25"
                            placeholder="1"
                          />
                        </div>
                        <div className="ml-2 mt-2 lg:flex-shrink-0 inline-flex rounded-md shadow">
                          <a
                            onClick={() => removeLiquidity(pool.pairAddress)}
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
  );
}
