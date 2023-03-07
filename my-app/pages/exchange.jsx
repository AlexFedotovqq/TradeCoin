import { BanknotesIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import React, { useState } from "react";
import { useAccount, useSigner, useNetwork } from "wagmi";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";

import { getContractInfo, getERC20, getPair } from "@/utils/contracts";

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

export default function Example() {
  const fetchTxs = async (name) => {
    const res = await fetch(`/api/${name}/txs`);
    return res.json();
  };

  var initialChain = "mantle";
  const { chain } = useNetwork();

  if (chain?.id && (chain.id === 80001 || chain.id === 50)) {
    initialChain = chain.network;
  }

  const { data: transactions, status } = useQuery(["txs"], () =>
    fetchTxs(initialChain)
  );

  const { data: signer } = useSigner();
  const { address } = useAccount();

  const [tokenA, setTokenA] = useState("");
  const [tokenB, setTokenB] = useState("");
  const [swapAmount, setSwapAmount] = useState(0);

  async function swap() {
    const { addressFactory, abiFactory } = getContractInfo(chain.id);
    const { abiPair } = getPair();
    const { abiERC20 } = getERC20();

    const contract = new ethers.Contract(addressFactory, abiFactory, signer);
    const pairAddress = await contract.getPair(tokenA, tokenB);
    const pair = new ethers.Contract(pairAddress, abiPair, signer);

    const orderIn = (await pair.token0()) === tokenA ? 0 : 1;
    const orderOut = (await pair.token1()) === tokenB ? 1 : 0;

    const token = new ethers.Contract(tokenA, abiERC20, signer);

    await token.transfer(pairAddress, expandTo18Decimals(swapAmount), {
      gasLimit: 60000,
    });

    const Preserves = await pair.getReserves();

    var amountInWithFee = expandTo18Decimals(swapAmount).mul(996);

    var numerator = amountInWithFee.mul(Preserves[orderOut]);
    var denominator = Preserves[orderIn].mul(1000).add(amountInWithFee);
    var amountOut = numerator / denominator;

    const expectedOutputAmount = ethers.BigNumber.from(String(amountOut));

    await pair.swap(0, expectedOutputAmount, address, "0x", {
      gasLimit: 200000,
    });
  }

  return (
    <div className="overflow-hidden bg-white  py-16 px-4 sm:px-6 lg:px-8 lg:py-5 h-screen">
      <div className="relative mx-auto max-w-xl">
        <svg
          className="absolute left-full translate-x-1/2 transform"
          width={404}
          height={1104}
          fill="none"
          viewBox="0 0 404 804"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-black-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={404}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <svg
          className="absolute right-full bottom-0 -translate-x-1/2 transform"
          width={404}
          height={1104}
          fill="none"
          viewBox="0 0 404 790"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect
                x={0}
                y={0}
                width={4}
                height={4}
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={404}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black-900 sm:text-4xl">
            Exchange
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-900">
            <strong>Here you can exchange cryptocurrency</strong>
          </p>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="number"
            className="block text-sm mt-4 font-medium text-black-700"
          >
            Exchange cryptocurrency
          </label>
          <div className="relative  mt-1 rounded-md shadow-sm">
            <input
              type="text"
              name="number"
              id="number"
              autoComplete="tel"
              onChange={(event) => setTokenA(event.target.value)}
              className="block w-full rounded-md bg-indigo-100 border-gray-300 py-3 px-4 pl-25 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0x..."
            />

            <input
              type="text"
              name="number"
              id="number"
              onChange={(event) => setSwapAmount(event.target.value)}
              className="block w-full my-2 bg-indigo-100 rounded-md border-gray-300 py-3 px-4 pl-25 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="1"
            />

            <label
              htmlFor="number"
              className="block text-sm font-medium text-black-700"
            >
              for cryptocurrency
            </label>

            <input
              type="text"
              name="number"
              id="number"
              autoComplete="tel"
              onChange={(event) => setTokenB(event.target.value)}
              className="block w-full rounded-md border-gray-300 bg-indigo-100 py-3 px-4 pl-25 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="0x..."
            />
          </div>

          <button
            type="submit"
            onClick={() => swap()}
            className="relative mt-5 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
          >
            Exchange
          </button>
        </div>
        <div className="relative overflow-hidden h-screen">
          <div className="flex flex-1 flex-col  lg:pl-68">
            <main className="flex-1 pb-8">
              <div className="mt-8">
                {/* Activity list */}

                <div className="hidden sm:block">
                  <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-1">
                    <div className="mt-2 flex flex-col">
                      <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
                        {status == "loading" ? (
                          <div className="flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-blue-200 rounded-full animate-spin"></div>
                            <div className="">Loading...</div>
                          </div>
                        ) : (
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                              <tr>
                                <th
                                  className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                                  scope="col"
                                >
                                  Cryptocurrency Pair
                                </th>
                                <th
                                  className="bg-gray-50 px-12 py-3 text-right text-sm font-semibold text-gray-900"
                                  scope="col"
                                >
                                  Reserve Ratio
                                </th>

                                <th
                                  className="bg-gray-50 px-10 py-3 text-right text-sm font-semibold text-gray-900"
                                  scope="col"
                                >
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                              {transactions?.map((transaction) => (
                                <tr key={transaction.id} className="bg-white">
                                  <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                    <div className="flex">
                                      <a className="group inline-flex space-x-2 truncate text-sm">
                                        <BanknotesIcon
                                          className="h-5 w-5 flex-shrink-0 text-black group-hover:text-gray-500"
                                          aria-hidden="true"
                                        />
                                        <p className="text-black group-hover:text-gray-900">
                                          {transaction.token0Symbol} /{" "}
                                          {transaction.token1Symbol}
                                        </p>
                                      </a>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                    <span className="truncate font-medium text-gray-900">
                                      {transaction.reserveRatio}
                                    </span>
                                  </td>

                                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                                    <span className="truncate font-medium text-gray-900">
                                      {transaction.price0}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
