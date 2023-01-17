import { Popover } from "@headlessui/react";
import Link from "next/link";
import Image from "next/image";

const myLoader = ({ src, width }) => {
  return `https://www.interactivebrokers.com/images/web/${src}?w=${width}&q=${100}`;
};

export default function Index() {
  return (
    <div>
      <div className="relative overflow-hidden bg-orange-400 h-screen">
        <div className="mx-auto max-w-7xl">
          <div className="relative z-10 bg-orange-400 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32">
            <svg
              className="absolute inset-y-0 right-0 hidden h-screen w-48 translate-x-1/2 transform text-orange-400 lg:block"
              fill="currentColor"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100 0,100" />
            </svg>

            <Popover>
              <div className="relative px-4 pt-6 sm:px-6 lg:px-8">
                <nav
                  className="relative flex items-center justify-between sm:h-12 lg:justify-start"
                  aria-label="Global"
                ></nav>
              </div>
            </Popover>

            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-48">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">XRC-Swap</span>{" "}
                </h1>
                <p className="mt-3 text-base text-black sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0">
                  XRC-Swap provides DeFi tools for token holders & businesses to
                  buy, trade, create, and secure crypto assets with confidence.
                </p>

                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      href="/pool"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-4 md:px-10 md:text-lg"
                    >
                      Pool
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      href="/exchange"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-indigo-700 hover:bg-gray-200 md:py-4 md:px-10 md:text-lg"
                    >
                      Exchange
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>

        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <Image
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
            src="cryptocurrency-hero.jpg"
            alt=""
            width="600"
            height="600"
            loader={myLoader}
          />
        </div>
      </div>
      <div className="isolate bg-white">
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 pb-32  sm:pb-40">
              <div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    XRC-Swap
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                    XRC-Swap provides DeFi tools for token holders & businesses
                    to buy, trade, create, and secure crypto assets with
                    confidence.
                  </p>
                  <div className="mt-8 flex gap-x-4 sm:justify-center">
                    <Link
                      href="/exchange"
                      className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                    >
                      Exchange{" "}
                      <span className="text-indigo-200" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>

                    <a
                      href="https://www.youtube.com/watch?v=kDQ0fN4s-Jc&ab_channel=Dspyt"
                      className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                    >
                      Live demo video{" "}
                      <span className="text-gray-400" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>

                <div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      Blog
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-black sm:text-center">
                      Interested in reading something new?
                    </p>
                    <p className="mt-4 text-lg leading-3 text-gray-600 sm:text-center">
                      You can read on our website Blog.
                    </p>
                    <p className="mt-4 text-lg leading-3 text-gray-600 sm:text-center">
                      There you will find a lot of interesting and informative.
                    </p>
                    <div className="mt-3"></div>
                    <div className="relative overflow-hidden  flex items-center justify-center">
                      <iframe
                        src="/tenor (4).gif"
                        width="580"
                        height="445"
                        className="justify-center flex items-center"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-3 flex gap-x-4 sm:justify-center">
                      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-600">
                            Here are the most interesting posts{" "}
                            <Link
                              href="/blogs"
                              className="font-semibold text-indigo-600"
                            >
                              View our blog
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      Exchange
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      Do you want to exchange cryptocurrency?
                    </p>
                    <p className="mt-4 text-lg leading-3 text-gray-600 sm:text-center">
                      Go to the Exchange tab, then start exchanging.
                    </p>
                    <p className="mt-4 text-lg leading-3 text-gray-600 sm:text-center">
                      Don&apos;t know how to start exchanging? All information
                      is below.
                    </p>
                    <div className="mt-3"></div>
                    <div className="relative overflow-hidden  flex items-center justify-center">
                      <iframe
                        src="/tenor.gif"
                        width="480"
                        height="459"
                        className="justify-center flex items-center"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-3 flex gap-x-4 sm:justify-center">
                      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-600">
                            Here are the most interesting exchange{" "}
                            <Link
                              href="/exchange"
                              className="font-semibold text-indigo-600"
                            >
                              View our Exchange
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      Pool
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                      We have a Pool tab on our site.
                    </p>
                    <div className="mt-3"></div>
                    <div className="relative overflow-hidden  flex items-center justify-center">
                      <iframe
                        src="/tenor (3).gif"
                        width="580"
                        height="390"
                        className="justify-center flex items-center"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-3 flex gap-x-4 sm:justify-center">
                      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-600">
                            Here are the most interesting pool{" "}
                            <Link
                              href="/pool"
                              className="font-semibold text-indigo-600"
                            >
                              View our pool
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      Contact us
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      Do you want to contact us?
                    </p>
                    <p className="mt-3 text-lg leading-3 text-gray-600 sm:text-center">
                      Go to the tab and write to us, we will be very happy
                    </p>
                    <div className="mt-3"></div>
                    <div className="relative overflow-hidden  flex items-center justify-center">
                      <iframe
                        src="/tenor (2).gif"
                        width="510"
                        height="400"
                        className="justify-center flex items-center"
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-8 flex gap-x-4 sm:justify-center">
                      <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-600">
                            {" "}
                            <Link
                              href="/contact"
                              className="font-semibold text-indigo-600"
                            >
                              Contact us
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      Application instruction
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      Faced with the fact that you do not know how to use the
                      application?
                    </p>
                    <p className="mt-4 text-lg leading-3 text-gray-600 sm:text-center">
                      Then you can watch the video below. It clearly shows you
                      how to use it.
                    </p>
                    <p className="mt-5 text-lg leading-3 text-gray-600 sm:text-center">
                      How to use XDC-Swap: Unlock liquidity with XRC-Swap -
                      empowering decentralized finance
                    </p>

                    <div className="mt-3 relative overflow-hidden  flex items-center justify-center">
                      <div className="flex justify-center">
                        <iframe
                          width="600"
                          height="350"
                          src="https://www.youtube.com/embed/OlRdaxTm9N0?autoplay=1&mute=1"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;fullscreen"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                  <svg
                    className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                    viewBox="0 0 1155 678"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                      fillOpacity=".3"
                      d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                    />
                    <defs>
                      <linearGradient
                        id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                        x1="1155.49"
                        x2="-78.208"
                        y1=".177"
                        y2="474.645"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#9089FC" />
                        <stop offset={1} stopColor="#FF80B5" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
