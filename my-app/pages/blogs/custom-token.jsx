import Link from "next/link";
import Image from "next/image";

export default function Example() {
  return (
    <div className="relative overflow-hidden bg-gray-800 py-16">
      <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[overflow-anchor:none]"></div>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg">
          <h1>
            <span className="block text-center text-lg font-semibold text-indigo-600">
              Introducing
            </span>
            <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
              How do I add custom tokens to MetaMask?
            </span>
            <p className="mt-8 text-xl leading-8 text-white">
              If your custom (unlisted) tokens are not showing up automatically
              in MetaMask assets area, this article will explain how to add
              them.
            </p>
            <p className="mt-8 text-3xl font-bold leading-8 tracking-tight text-white sm:text-4xl">
              Add token to MetaMask
            </p>
          </h1>
          <p className="mt-8"></p>{" "}
          <div
            className="mt-2  font-bold leading-8  tracking-tight
            text-white "
          >
            <ul role="list">
              <li>1. Launch the MetaMask browser extension.</li>
              <li>2. Select the Assets tab.</li>
              <li>3. Scroll down and click Import tokens.</li>
            </ul>
            <div className="mt-5 relative overflow-hidden  flex items-center justify-center">
              <Image
                alt=""
                src="https://www.xdc.dev/images/9IEFIUKLnFT0OZGGjWzXjiACa8IBVwtmxlhaXXSAs4U/w:880/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L2xvOXdqdnJjajh3/dzRpNGF2NnowLnBu/Zw"
                width="350"
                height="350"
                className="justify-center flex items-center"
                allowFullScreen
              />
            </div>
            <p className="mt-8"></p>
            <ul role="list">
              <li>4. Select the Custom Token tab</li>
            </ul>
            <div className="mt-5 relative overflow-hidden  flex items-center justify-center">
              <Image
                alt=""
                src="https://www.xdc.dev/images/cIXlemy6rCe9vy4CKD3VZxv68vsfAyrUurquGTRMnzQ/w:880/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/LzZkbXM1N3RnZnpm/OXAzYXN4dTB4LnBu/Zw"
                width="350"
                height="350"
                className="justify-center flex items-center"
                allowFullScreen
              />
            </div>
            <p className="mt-8"></p>
            <ul role="list">
              <li>
                5. Insert the contract address of the token to the field Token
                Contract Address. The token symbol and token decimal will get
                filled automatically. You can edit it if needed.
              </li>
            </ul>
            <div className="mt-5 relative overflow-hidden  flex items-center justify-center">
              <Image
                alt=""
                src="https://www.xdc.dev/images/irPDVF1gx-nn4XPpvkjcDGfXoM20o-A2w5Ss0wsONn8/w:880/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L3c4dzRlOThiZnBl/Zndjam9zbG1pLnBu/Zw"
                width="350"
                height="350"
                className="justify-center flex items-center"
                allowFullScreen
              />
            </div>
            <p className="mt-8"></p>
            <ul role="list">
              <li>
                6. Click Add Custom Token. You will see the token information
                and the balance (if you have these tokens at your address).
              </li>
            </ul>
            <div className="mt-5 relative overflow-hidden  flex items-center justify-center">
              <Image
                alt=""
                src="https://www.xdc.dev/images/A8lwnK31Kdyge4RbZ2U9fdI2eerKBb1EoYIfztHKdo8/w:880/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L2d3bHB1bHJsemFi/bnR0ZTVlNWZ6LnBu/Zw"
                width="350"
                height="350"
                className="justify-center flex items-center"
                allowFullScreen
              />
            </div>
            <p className="mt-8"></p>
            <ul role="list">
              <li>
                7. Click Import Tokens. Congratulations, you added the custom
                token to MetaMask and it will become visible in the Assets tab
                in MetaMask.
              </li>
            </ul>
          </div>
          <div className="mt-5 relative overflow-hidden  flex items-center justify-center">
            <Image
              alt=""
              src="https://www.xdc.dev/images/5ZYxDXWcHKn9mlURMINdKcX4-m7JD0xkRUXGV-7hOPY/w:880/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L3QwZG8zczEwZHE4/Z2R2dGtxeW8wLnBu/Zw"
              width="350"
              height="350"
              className="justify-center flex items-center"
              allowFullScreen
            />
          </div>
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
