import Image from "next/image";
import Link from "next/link";

export function Newsinfo() {
  return (
    <div className="mt-8">
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-center sm:text-6xl">
        News
      </h1>
      <p className="mt-4 text-lg leading-8 text-black sm:text-center">
        <strong>You can check out the latest </strong>

        <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          TradeCoin news
        </span>
      </p>
      <div className="mt-3 relative overflow-hidden  flex items-center justify-center">
        <Image
          alt=""
          src="/photo6.jpg"
          width="350"
          height="350"
          className="justify-center flex items-center"
        />
      </div>

      <div
        className="mt-5
                     flex gap-x-4 justify-center"
      >
        <div className="sm:mb-8 flex items-center justify-center">
          <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <span className="text-gray-900">
              <Link href="/news" className="font-semibold text-white">
                View our news
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
