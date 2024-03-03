import Image from "next/image";
import Link from "next/link";

export function ContactusInfo() {
  return (
    <div className="mt-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-center sm:text-5xl">
        Contact us
      </h1>
      <p className="mt-6 text-lg leading-8 text-black sm:text-center">
        Do you want to
        <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
          {" "}
          contact us?
        </span>
      </p>
      <p className="mt-3 text-lg leading-8 text-gray-900 sm:text-center">
        Go to the tab and write to us, we will be very happy
      </p>

      <div className="mt-4 relative overflow-hidden  flex items-center justify-center">
        <Image
          alt=""
          src="/photo4.jpg"
          width="350"
          height="350"
          className="justify-center flex items-center"
        />
      </div>
      <div className="mt-8 flex gap-x-4 justify-center">
        <div className=" sm:mb-8 flex items-center justify-center">
          <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            <span className="text-gray-600">
              {" "}
              <Link href="/contact" className="font-semibold text-white">
                Contact us
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
