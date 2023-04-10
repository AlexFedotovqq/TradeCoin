import React, { useState } from "react";
import { ethers } from "ethers";

import { getContractInfo, getERC20, getPair } from "@/utils/contracts";

function expandTo18Decimals(n) {
  return ethers.BigNumber.from(n).mul(ethers.BigNumber.from(10).pow(18));
}

export default function Exchange() {
  const [tokenA, setTokenA] = useState(
    "41377a640a0bf48d4c5ab79f63d2e4885659b82a29"
  );
  const [tokenB, setTokenB] = useState(
    "41377a640a0bf48d4c5ab79f63d2e4885659b82a29"
  );
  const [swapAmount, setSwapAmount] = useState(0);

  // price display in useEffect with 2 tokens

  async function swap() {
    const { addressFactory, abiFactory } = getContractInfo();
    const { abiPair } = getPair();
    const { abiERC20 } = getERC20();

    const contract = await tronWeb.contract(abiFactory, addressFactory);

    const pairAddress = await contract.getPair(tokenA, tokenB).call();

    const pair = await tronWeb.contract(abiPair, pairAddress);

    const orderIn = (await pair.token0().call()) === tokenA ? 0 : 1;
    const orderOut = (await pair.token1().call()) === tokenB ? 1 : 0;

    const token = await tronWeb.contract(abiERC20, tokenA);

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
    <div className="overflow-hidden bg-gradient-to-b from-indigo-200 to-indigo-500 py-16 px-8 h-screen">
      <div className="relative mx-auto max-w-sm">
        <div className="text-center">
          <h2 className="text-4xl font-bold tracking-tight text-black-900">
            TradeCoin Exchange
          </h2>
          <p className="mt-8 text-xl leading-8 text-gray-900">
            <strong>Here you can exchange your TRX20 tokens</strong>
          </p>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="number"
            className="block text-lg text-bold text-center mt-6 font-medium text-black-700"
          >
            Exchange cryptocurrency
          </label>
          <div className="flex justify-center items-center">
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <select
                  onChange={(event) => setTokenA(event.target.value)}
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-1 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                >
                  <option value="41377a640a0bf48d4c5ab79f63d2e4885659b82a29">
                    TradeC0
                  </option>
                  <option value="4191447b0204cf766eaf5f3f44d31370c870ec3f45">
                    TradeC1
                  </option>
                  <option value="412baca645bf7d8249eee9fd1b67dd2457dc76cdd6">
                    Dspyt
                  </option>
                  <option value="413e152ac3ebbb60fd4af26fcfa0938189383a38f1">
                    TradeCoin
                  </option>
                </select>
              </div>
              <input
                type="tel"
                name="phone-number"
                id="phone-number"
                autoComplete="tel"
                onChange={(event) => setSwapAmount(event.target.value)}
                className="block rounded-md border-0 px-3.5 py-2 pl-32 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <label
            htmlFor="number"
            className="block mt-5 text-lg text-bold text-center font-medium text-black-700"
          >
            For cryptocurrency
          </label>
        </div>

        <div className="flex justify-center items-center">
          <div className="relative mt-2.5">
            <div className=" flex items-center ">
              <div className="overflow-hidden rounded-lg bg-white shadow mt-2 py-2">
                <select
                  id="country"
                  name="country"
                  onChange={(event) => setTokenB(event.target.value)}
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-1 text-gray-900 sm:text-sm"
                >
                  <option value="41377a640a0bf48d4c5ab79f63d2e4885659b82a29">
                    TradeC0
                  </option>
                  <option value="4191447b0204cf766eaf5f3f44d31370c870ec3f45">
                    TradeC1
                  </option>
                  <option value="412baca645bf7d8249eee9fd1b67dd2457dc76cdd6">
                    Dspyt
                  </option>
                  <option value="413e152ac3ebbb60fd4af26fcfa0938189383a38f1">
                    TradeCoin
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={() => swap()}
          className="relative mt-4 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
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
  );
}
