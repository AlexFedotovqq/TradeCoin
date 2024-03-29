import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { classNames } from "@/utils/classNames";
import { WalletButton } from "@/utils/wallet";

const navigation = [
  { name: "TradeCoin", href: "/" },
  { name: "Exchange", href: "/exchange" },
  { name: "Pool", href: "/pool" },
  { name: "News", href: "/news" },
  { name: "Contact us", href: "/contact" },
];

export default function Navbar() {
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ">
            <div className="flex h-16 justify-between ">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden ">
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

                <div className="hidden md:flex md:items-center md:space-x-4 mt-3.5">
                  <ul
                    className="menu"
                    style={{
                      display: "flex",
                      color: "#FFFFFF",
                    }}
                  >
                    {navigation.map((item) => (
                      <li
                        key={item.name}
                        className="text-xl"
                        style={{
                          width: "125px",
                          height: "50px",
                          textAlign: "center",
                        }}
                      >
                        <a
                          href={item.href}
                          style={{
                            fontSize: "1rem",
                            transition: "all 0.45s",
                          }}
                        >
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* wallet button */}
              <WalletButton />
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
}
