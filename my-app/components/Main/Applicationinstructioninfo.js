import Link from "next/link";

export function Applicationinstructioninfo() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-center sm:text-5xl">
        <strong>Application instruction</strong>
      </h1>
      <p className="mt-6 text-lg leading-8 text-black sm:text-center">
        <strong>Faced with the fact that you do not know how to</strong>
        <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          {" "}
          use the application?
        </span>
      </p>
      <p className="mt-4 mb-9 text-lg leading-8 text-gray-900 sm:text-center">
        <strong>Then you can visit and study our </strong>
        <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          {" "}
          documentation!
        </span>
      </p>
      <div className="mt-3 flex items-center gap-x-4 justify-center">
        <div className=" sm:mb-8 sm:flex sm:justify-center">
          <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <span className="text-gray-900">
              <Link
                href="https://alexfedotovqq.github.io/DocsTradeCoin/#/"
                className="font-semibold text-white"
              >
                View our Docs
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
