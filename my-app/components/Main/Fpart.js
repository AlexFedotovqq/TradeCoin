import Link from "next/link";

export function Fpart() {
  return (
    <div className="relative overflow-hidden bg-no-repeat bg-cover bg-center bg-[url('/bg3.jpg')]">
      <div className="mx-auto max-w-2xl">
        <div className="xl:pb-32 pb-10 text-center">
          <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-48">
            <div className="sm:text-center lg:text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-sky-100 to-sky-500 ">
                  TradeCoin
                </span>
              </h1>
              <p className="brightness-150 mt-3 font-bold text-base text-white text-center sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg  md:text-2xl lg:mx-0">
                <strong>
                  TradeCoin provides DeFi tools for token holders & businesses
                  to buy, trade, create, and secure crypto assets with
                  confidence.
                </strong>
              </p>

              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center ">
                <div className="rounded-md shadow">
                  <Link
                    href="/pool"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Pool
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Link
                    href="/exchange"
                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-500 px-8 py-3 text-base font-medium text-white hover:bg-pink-700 md:py-4 md:px-10 md:text-lg"
                  >
                    Exchange
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
