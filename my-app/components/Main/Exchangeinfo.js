import Image from "next/image";
import Link from "next/link";

export function ExchangeInfo() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-center sm:text-5xl">
        Token Exchange
      </h1>
      <p className="mt-6 text-lg leading-8 text-black sm:text-center">
        Do you want to
        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          {" "}
          exchange cryptocurrency?
        </span>
      </p>

      <div className="mt-4 relative overflow-hidden  flex items-center justify-center">
        <Image
          alt=""
          src="/photo3.jpg"
          width="340"
          height="350"
          className="justify-center flex items-center"
        />
      </div>
      <div className="mt-3 flex items-center gap-x-4 justify-center">
        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20 sm:mb-8 sm:flex sm:justify-center">
          <Link href="/exchange" className="font-semibold text-white">
            View our Exchange
          </Link>
        </div>
      </div>
    </div>
  );
}
