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
            <div className="flex justify-center items-center">
              <div className="relative mt-2.5">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <select
                    onChange={(event) => setTokenA(event.target.value)}
                    className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-1 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
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
                  className="block rounded-md border-0  py-2 pl-24 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
              <div className=" flex items-center ">
                <button
                  type="submit"
                  onChange={(event) => setTokenB(event.target.value)}
                  className="relative  inline-flex  items-center justify-center rounded-md border border-transparent bg-white px-3 py-2 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                >
                  <img
                    className="h-6 w-6 rounded-full"
                    src="data:image/png;base64,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"
                    alt=""
                  />

                  <span className="ml-2">BNB</span>
                  <svg
                    fill="#000000"
                    width="20px"
                    height="20px"
                    viewBox="-8.5 0 32 32"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
    </div>
  );
}
