import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "TradeCoin", href: "/" },
  { name: "Exchange", href: "/exchange" },
  { name: "Pool", href: "/pool" },
  { name: "Contact us", href: "/contact" },
  { name: "Blog", href: "/blogs" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  async function ffdf() {
    let abi = [
      {
        inputs: [{ name: "_feeToSetter", type: "address" }],
        stateMutability: "Nonpayable",
        type: "Constructor",
      },
      {
        inputs: [
          { indexed: true, name: "token0", type: "address" },
          { indexed: true, name: "token1", type: "address" },
          { name: "pair", type: "address" },
          { type: "uint256" },
        ],
        name: "PairCreated",
        type: "Event",
      },
      {
        outputs: [{ type: "address" }],
        constant: true,
        inputs: [{ type: "uint256" }],
        name: "allPairs",
        stateMutability: "view",
        type: "function",
      },
      {
        outputs: [{ type: "uint256" }],
        constant: true,
        name: "allPairsLength",
        stateMutability: "view",
        type: "function",
      },
      {
        outputs: [{ name: "pair", type: "address" }],
        inputs: [
          { name: "tokenA", type: "address" },
          { name: "tokenB", type: "address" },
        ],
        name: "createPair",
        stateMutability: "Nonpayable",
        type: "Function",
      },
      {
        outputs: [{ type: "address" }],
        constant: true,
        name: "feeTo",
        stateMutability: "view",
        type: "function",
      },
      {
        outputs: [{ type: "address" }],
        constant: true,
        name: "feeToSetter",
        stateMutability: "view",
        type: "function",
      },
      {
        outputs: [{ type: "address" }],
        constant: true,
        inputs: [{ type: "address" }, { type: "address" }],
        name: "getPair",
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ name: "_feeTo", type: "address" }],
        name: "setFeeTo",
        stateMutability: "Nonpayable",
        type: "Function",
      },
      {
        inputs: [{ name: "_feeToSetter", type: "address" }],
        name: "setFeeToSetter",
        stateMutability: "Nonpayable",
        type: "Function",
      },
    ];
    const bla = await tronWeb.contract(
      abi,
      "TBm29AMoKKkxE9z5mwWdVdbt5CPqPhZxTq"
    );
    console.log(bla);
    let s = await bla.allPairsLength().call();
    console.log(s);
  }
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>

                <div className="flex flex-shrink-0 items-center"></div>

                <div className="hidden md:ml-6 md:flex md:items-center md:space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "rounded-md px-3 py-2 text-md font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-center md:ml-12">
                <button
                  onClick={() => ffdf()}
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5 "
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block rounded-md px-3 py-2 text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
