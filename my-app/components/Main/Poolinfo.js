import Image from "next/image";
import Link from "next/link";

export function PoolInfo() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-center sm:text-5xl">
        Pool
      </h1>
      <p className="mt-6 text-lg leading-8 text-black sm:text-center">
        What is an
        <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          {" "}
          Automated Market Maker?
        </span>
      </p>
      <p className="mt-4 text-lg leading-8 text-gray-900 sm:text-center">
        Automated market makers incentivize users to become liquidity providers
        in exchange for a share of transaction fees and free tokens.
      </p>

      <div className="mt-3 relative overflow-hidden  flex items-center justify-center">
        <Image
          alt=""
          src="/photo5.jpg"
          width="350"
          height="350"
          className="justify-center flex items-center"
          allowFullScreen
        />
      </div>
      <div className="mt-3 flex items-center gap-x-4 justify-center sm:mb-8 sm:flex sm:justify-center">
        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
          <Link href="/pool" className="font-semibold text-white">
            View our Pool
          </Link>
        </div>
      </div>
    </div>
  );
}
