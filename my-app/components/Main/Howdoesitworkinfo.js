import Image from "next/image";
import Link from "next/link";

export function HowDoesItWorkinfo() {
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-center sm:text-6xl">
          How does it{" "}
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 ">
            Work?
          </span>
        </h1>

        <p className="mt-8 text-lg leading-8 text-gray-900 sm:text-center">
          TradeCoin provides DeFi tools for token holders & businesses to buy,
          trade, create, and secure crypto assets with confidence.
        </p>
        <div className="mt-8 flex items-center gap-x-4 justify-center">
          <Link
            href="/exchange"
            className="inline-block rounded-lg bg-indigo-500 px-2 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-500 hover:bg-indigo-700 hover:ring-indigo-700 "
          >
            Exchange{" "}
            <span className="text-gray-100" aria-hidden="true">
              &rarr;
            </span>
          </Link>
          <a
            href="https://www.youtube.com/watch?v=kCX36jTEUW0&ab_channel=Dspyt"
            className="inline-block bg-pink-500 rounded-lg px-2 py-1.5 text-base font-semibold leading-7 text-white ring-1 ring-pink-500 hover:bg-pink-700 hover:ring-pink-700"
          >
            Live demo video{" "}
            <span className="text-gray-100" aria-hidden="true">
              &rarr;
            </span>
          </a>
        </div>
      </div>
      <div className="mt-1 relative overflow-hidden flex items-center justify-center">
        <Image
          alt=""
          src="/photo1.jpg"
          width="340"
          height="340"
          className="justify-center flex items-center"
        />
      </div>
    </div>
  );
}
