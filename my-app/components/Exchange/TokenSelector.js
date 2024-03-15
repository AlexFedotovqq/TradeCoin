import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CheckIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

import { classNames } from "@/utils/classNames";

export default function TokenSelector({
  tokens,
  open,
  setOpen,
  token,
  setToken,
  query,
  setQuery,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const filteredTokens =
    query === ""
      ? tokens
      : tokens.filter((userInput) => {
          return userInput.name?.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mt-3 text-center sm:mt-5">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900 mb-2"
                  >
                    Select a Token
                  </Dialog.Title>
                  <Combobox as="div" value={token} onChange={setToken}>
                    <div className="relative mt-2">
                      <Combobox.Input
                        className="block w-full pl-3 pr-10 py-2 text-base leading-6 max-h-60 rounded-md border border-gray-300 bg-white divide-y divide-gray-200 overflow-auto focus:outline-none sm:text-sm"
                        onChange={(event) => {
                          setQuery(event.target.value);
                          setIsLoading(true);
                          setTimeout(() => setIsLoading(false), 500);
                        }}
                        placeholder="Search for a token..."
                      />
                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <MagnifyingGlassIcon
                          className="h-5 w-5 text-gray-600"
                          aria-hidden="true"
                        />
                      </span>
                    </div>

                    {isLoading ? (
                      <p className="text-sm text-gray-500 mt-1">Loading...</p>
                    ) : (
                      <Combobox.Options
                        className="mt-1 w-full max-h-60 rounded-md border border-gray-300 bg-white divide-y divide-gray-200 overflow-auto focus:outline-none sm:text-sm"
                        static
                      >
                        {filteredTokens.length === 0 && (
                          <div className="px-4 py-2">
                            No matching tokens found
                          </div>
                        )}
                        {filteredTokens.map((tokenOption) => (
                          <Combobox.Option
                            key={tokenOption.id}
                            value={tokenOption}
                            className={({ active }) =>
                              classNames(
                                "group flex items-center justify-between px-4 py-2 text-sm cursor-pointer",
                                active ? "bg-gray-100" : "",
                                "hover:bg-gray-100"
                              )
                            }
                          >
                            <div className="flex items-center">
                              <Image
                                src={tokenOption.image}
                                alt={tokenOption.symbol}
                                width={24}
                                height={24}
                                className="flex-shrink-0 rounded-full"
                              />
                              <span
                                className={`ml-3 block truncate ${tokenOption === token ? "font-semibold" : ""}`}
                              >
                                {tokenOption.symbol}
                              </span>
                            </div>
                            {tokenOption === token && (
                              <CheckIcon
                                className="text-indigo-600 h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    )}
                  </Combobox>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
