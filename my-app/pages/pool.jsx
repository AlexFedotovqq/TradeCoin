import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example() {
  return (
    <div className="overflow-hidden bg-orange-400 py-16 px-4 sm:px-6 lg:px-8 lg:py-5 h-screen">
      <div className="relative mx-auto max-w-xl">
        <svg
          className="absolute left-full translate-x-1/2 transform"
          width={404}
          height={1104}
          fill="none"
          viewBox="0 0 404 804"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
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
                className="text-black-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={404}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <svg
          className="absolute right-full bottom-0 -translate-x-1/2 transform"
          width={404}
          height={1104}
          fill="none"
          viewBox="0 0 404 1104"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="85737c0e-0916-41d7-917f-596dc7edfa27"
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
                className="text-gray-200"
                fill="currentColor"
              />
            </pattern>
          </defs>
          <rect
            width={404}
            height={1104}
            fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)"
          />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black-900 sm:text-4xl">
            Pools
          </h2>
        </div>
        <div className="bg-orange-400">
          <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-3 lg:px-1">
            <div className="ml-3 inline-flex rounded-md shadow"></div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div className="inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                  >
                    Add Liquidity
                  </a>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
                  >
                    Delete Liquidity
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-28"></div>
        </div>
        <section aria-labelledby="details-heading" className="mt-3">
          <div className="divide-y divide-gray-200 border-t lg:border-black">
            <Disclosure as="div" key="Add new pair">
              {({ open }) => (
                <>
                  <h3>
                    <Disclosure.Button className="group relative flex w-full items-center justify-between py-3 text-left bg-white">
                      <span
                        className={classNames(
                          open ? "text-indigo-600" : "text-gray-900",
                          "text-sm font-medium"
                        )}
                      >
                        Add new pair
                      </span>
                      <span className="ml-6 flex items-center">
                        {open ? (
                          <MinusIcon
                            className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                            aria-hidden="true"
                          />
                        ) : (
                          <PlusIcon
                            className="block h-6 w-6 text-gray-900 group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel as="div" className="prose prose-sm pb-6">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-black-700"
                      >
                        Cryptocurrency
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label htmlFor="country" className="sr-only">
                            Cryptocurrency
                          </label>
                        </div>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          autoComplete="tel"
                          className="block w-full rounded-md border-gray-300 py-3 px-4 pl-20 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="number"
                        className="block text-sm font-medium text-black-700"
                      >
                        Cryptocurrency
                      </label>
                      <div className="relative mt-1 rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 flex items-center">
                          <label htmlFor="country" className="sr-only">
                            Cryptocurrency
                          </label>
                        </div>
                        <input
                          type="text"
                          name="number"
                          id="number"
                          autoComplete="tel"
                          className="block w-full rounded-md border-gray-300 py-3 px-4 pl-20 focus:border-indigo-500 focus:ring-indigo-500"
                          placeholder="0x..."
                        />
                      </div>
                    </div>
                    <div className="mt-9 flex lg:mt-2 lg:flex-shrink-0">
                      <div className="inline-flex rounded-md shadow">
                        <a
                          href="#"
                          className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
                        >
                          Send
                        </a>
                      </div>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          </div>
        </section>
      </div>
    </div>
  );
}
