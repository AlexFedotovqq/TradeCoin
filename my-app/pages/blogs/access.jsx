import Link from "next/link";

export default function BlogAccess() {
  return (
    <div className="relative overflow-hidden bg-gray-800 py-16">
      <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[overflow-anchor:none]">
        <div
          className="relative mx-auto h-full max-w-prose text-lg"
          aria-hidden="true"
        >
          <svg
            className="absolute top-12 left-full translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-white"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)"
            />
          </svg>
          <svg
            className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-white"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)"
            />
          </svg>
          <svg
            className="absolute bottom-12 left-full translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect
                  x={0}
                  y={0}
                  width={4}
                  height={4}
                  className="text-white"
                  fill="currentColor"
                />
              </pattern>
            </defs>
            <rect
              width={404}
              height={384}
              fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)"
            />
          </svg>
        </div>
      </div>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg">
          <h1>
            <span className="block text-center text-lg font-semibold text-indigo-600">
              Introducing
            </span>
            <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
              HOW TO ACCESS YOUR XDC NETWORK (XDC) ACCOUNT VIA METAMASK
            </span>
          </h1>
          <div
            className="mt-2 font-bold leading-8 tracking-tight
          text-white "
          >
            <ul role="list">
              <li>
                1. Download MetaMask wallet from the App Store or Google Play.
              </li>
              <li>
                2. Create and confirm your MetaMask wallet by following the
                instructions provided.
              </li>
              <li>
                3. Now, you need to connect your wallet to the XDC network. To
                do this, click on the three dots in the top right corner of the
                MetaMask wallet and select 'Settings'.
              </li>
              <li>4. In the 'Networks' tab, select 'Add Network'.</li>
              <li>5.Enter the following details in the 'Add Network' form</li>
              <li>
                {" "}
                <strong>Network Name: XDC</strong>
              </li>
              <li>
                {" "}
                <strong>
                  New RPC URL:{" "}
                  <a href="https://rpc.xinfin.network">
                    https://rpc.xinfin.network
                  </a>
                </strong>
              </li>
              <li>
                {" "}
                <strong>ChainID: 50</strong>
              </li>
              <li>
                {" "}
                <strong>Symbol: XDC</strong>
              </li>
              <li>
                {" "}
                <strong>
                  Block Explorer URL:{" "}
                  <a href="https://scan.xinfin.network">
                    https://scan.xinfin.network
                  </a>
                </strong>
              </li>
              <li>6. Click on 'Save'.</li>
              <li>
                7. Now, click on 'Home' and select 'Accounts' from the menu.
              </li>
              <li>
                8. Click on 'Import Account' and select the 'Private Key'
                option.
              </li>
              <li>
                9. Enter your XDC account's private key and click 'Import'.
              </li>
              <li>10. Your XDC account will now</li>
            </ul>
          </div>
          <p className="mt-8 text-xl leading-8 text-white"></p>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
            Сonclusion
          </p>
          <p className="mt-8 text-xl leading-8 text-white">
            In conclusion, XDC is a revolutionary new way of exchanging value
            that has the potential to revolutionize the way we conduct business.
            XDC is a secure and reliable platform that provides users with a
            low-fee, high-speed way to transfer and store value. Additionally,
            XDC provides a marketplace for developers to create and build
            innovative decentralized applications and products. With its
            permissionless and open-source blockchain protocol, XDC is sure to
            be a game-changer in the world of digital currency.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-prose text-base lg:max-w-none">
          <div className="rounded-md shadow">
            <Link
              href="/blogs"
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
            >
              Back to the blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
