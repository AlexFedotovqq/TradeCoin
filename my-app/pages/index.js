import Image from "next/image";
import Link from "next/link";

export default function Index() {
  return (
    <div>
      <div className="relative overflow-hidden bg-no-repeat bg-cover bg-center bg-[url('/bg2.jpg')]">
        <div className="mx-auto max-w-2xl">
          <div className="xl:pb-32 pb-10 text-center">
            <main className="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-48">
              <div className="sm:text-center lg:text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-sky-100 to-sky-500 ">
                    TradeCoin
                  </span>{" "}
                </h1>
                <p className="mt-3 font-bold text-base text-white text-center sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg  md:text-xl lg:mx-0">
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
      <div className="isolate bg-gradient-to-tl">
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-5 pb-32 mt-4 sm:pb-40">
              <div>
                <div>
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    How does it{" "}
                    <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 ">
                      Work?
                    </span>
                  </h1>

                  <p className="mt-6 text-lg leading-8 text-gray-900 sm:text-center">
                    <strong>
                      TradeCoin provides DeFi tools for token holders &
                      businesses to buy, trade, create, and secure crypto assets
                      with confidence.
                    </strong>
                  </p>
                  <div className="mt-8 flex items-center gap-x-4 justify-center">
                    <Link
                      href="/exchange"
                      className="inline-block rounded-lg bg-indigo-500 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-500 hover:bg-indigo-700 hover:ring-indigo-700 "
                    >
                      Exchange{" "}
                      <span className="text-gray-100" aria-hidden="true">
                        &rarr;
                      </span>
                    </Link>
                    <a
                      href="https://youtu.be/4Ft4wfPhjNw"
                      className="inline-block bg-pink-500 rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-white ring-1 ring-pink-500 hover:bg-pink-700 hover:ring-pink-700"
                    >
                      Live demo video{" "}
                      <span className="text-gray-100" aria-hidden="true">
                        &rarr;
                      </span>
                    </a>
                  </div>
                </div>
                <div className="mt-1 relative overflow-hidden  flex items-center justify-center">
                  <Image
                    alt=""
                    src="/photo1.jpg"
                    width="340"
                    height="340"
                    className="justify-center flex items-center"
                  />
                </div>
                <div>
                  <div className="mt-8">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                      <strong>Pool</strong>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      <strong>What Is an</strong>
                      <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
                        {" "}
                        Automated Market Maker?
                      </span>
                    </p>
                    <p className="mt-4 text-lg leading-8 text-gray-900 sm:text-center">
                      <strong>
                        Automated market makers incentivize users to become
                        liquidity providers in exchange for a share of
                        transaction fees and free tokens.
                      </strong>
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
                    <div className="mt-3 flex items-center gap-x-4 justify-center">
                      <div className=" sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-900 ">
                            <Link
                              href="/pool"
                              className="font-semibold  text-white"
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
                      Token Exchange
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      <strong>Do you want to</strong>
                      <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
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
                      <div className=" sm:mb-8 sm:flex sm:justify-center">
                        <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 bg-gradient-to-br from-pink-400 to-red-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                          <span className="text-gray-900">
                            <Link
                              href="/exchange"
                              className="font-semibold text-white"
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
                      <strong>Application instruction</strong>
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                      <strong>
                        Faced with the fact that you do not know how to
                      </strong>
                      <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
                        {" "}
                        use the application?
                      </span>
                    </p>
                    <p className="mt-4 text-lg leading-8 text-gray-900 sm:text-center">
                      <strong>
                        Then you can watch the video below. It clearly shows you
                        how to use it.
                      </strong>
                    </p>

                    <div className="mt-4 relative overflow-hidden  flex items-center justify-center">
                      <div className="flex justify-center">
                        <iframe
                          width="600"
                          height="350"
                          src="https://www.youtube.com/embed/BUigc1HjJEw?autoplay=1&mute=1"
                          title="YouTube video player"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;fullscreen"
                        />
                      </div>
                    </div>
                    <p className="mt-4 mb-9 text-lg leading-8 text-gray-900 sm:text-center">
                      <strong>
                        How to use TradeCoin: Unlock liquidity with TradeCoin -
                        empowering decentralized finance
                      </strong>
                    </p>
                  </div>
                </div>

                <div>
                  <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                    Blog
                  </h1>
                  <p className="mt-4 text-lg leading-8 text-black sm:text-center">
                    <strong>Interested in reading about </strong>

                    <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
                      automated market makers and TradeCoin.
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
                          <Link
                            href="/blogs"
                            className="font-semibold text-white"
                          >
                            View our blog
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                    Contact us
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-black sm:text-center">
                    <strong>Do you want to</strong>
                    <span className="font-extrabold  text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-red-600 sm:text-center">
                      {" "}
                      contact us?
                    </span>
                  </p>
                  <p className="mt-3 text-lg leading-8 text-gray-900 sm:text-center">
                    <strong>
                      Go to the tab and write to us, we will be very happy
                    </strong>
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
                          <Link
                            href="/contact"
                            className="font-semibold text-white"
                          >
                            Contact us
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white py-24 sm:py-12">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                      <div className="mx-auto grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 sm:gap-y-14 lg:mx-0 lg:max-w-none lg:grid-cols-5">
                        <img
                          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                          src="https://mms.businesswire.com/media/20211123005573/en/929867/23/vercel-logo-freelogovectors.net.jpg"
                          alt="Transistor"
                          width={158}
                          height={48}
                        />
                        <img
                          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                          src="https://cdn.1001vouchercodes.co.uk/logos/uk/tronlink-voucher-codes.png"
                          alt="Reform"
                          width={158}
                          height={48}
                        />
                        <img
                          className="col-span-2 max-h-12 w-full object-contain lg:col-span-1"
                          src="https://logos-download.com/wp-content/uploads/2022/01/TRON_TRX_Logo_full.png"
                          alt="Tuple"
                          width={158}
                          height={48}
                        />
                        <img
                          className="col-span-2 max-h-12 w-full object-contain sm:col-start-2 lg:col-span-1"
                          src="https://fantomfoundation-prod-wp-website.s3.ap-southeast-2.amazonaws.com/wp-content/uploads/2020/04/22185711/fantom-logo-blue.png"
                          alt="SavvyCal"
                          width={158}
                          height={48}
                        />
                        <img
                          className="col-span-2 col-start-2 max-h-12 w-full object-contain sm:col-start-auto lg:col-span-1"
                          src="https://www.bcbitcoin.com/site/assets/files/110712/image-1.png"
                          alt="Statamic"
                          width={158}
                          height={48}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
