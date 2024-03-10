import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Combobox } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
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
  const filteredTokens =
    query === ""
      ? tokens
      : tokens.filter((userInput) => {
          return userInput.name?.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold  text-gray-900"
                    >
                      Tokens
                    </Dialog.Title>
                    <Combobox as="div" value={token} onChange={setToken}>
                      <div className="relative mt-2">
                        <Combobox.Input
                          className="rounded-md border-0 bg-white py-1.5 pl-2 pr-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                          onChange={(event) => setQuery(event.target.value)}
                          displayValue={(token) => token?.symbol}
                        />
                        <Combobox.Button className="absolute inset-y-0  pl-64 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon
                            className="h-5 w-5 text-gray-900"
                            aria-hidden="true"
                          />
                        </Combobox.Button>

                        {filteredTokens.length > 0 && (
                          <Combobox.Options className="relative z-10 mt-1 max-h-36  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredTokens.map((token) => (
                              <Combobox.Option
                                key={token.id}
                                value={token}
                                className={({ active }) =>
                                  classNames(
                                    "relative cursor-default select-none py-2 pl-4 pr-12",
                                    active
                                      ? "bg-indigo-600 text-white"
                                      : "text-gray-900"
                                  )
                                }
                              >
                                {({ active, selected }) => (
                                  <>
                                    <div className="flex items-center">
                                      <Image
                                        src={token.image}
                                        alt={token.symbol}
                                        className="h-6 w-6 flex-shrink-0 rounded-full"
                                        width={400}
                                        height={400}
                                      />
                                      <span
                                        className={classNames(
                                          "ml-3 truncate  ",
                                          selected && "font-semibold"
                                        )}
                                      >
                                        {token.symbol}
                                      </span>
                                    </div>

                                    {selected && (
                                      <span
                                        className={classNames(
                                          "absolute inset-y-0 right-0 flex items-center pr-4",
                                          active
                                            ? "text-white"
                                            : "text-indigo-600"
                                        )}
                                      >
                                        <CheckIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    )}
                                  </>
                                )}
                              </Combobox.Option>
                            ))}
                          </Combobox.Options>
                        )}
                      </div>
                    </Combobox>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    onClick={() => setOpen(false)}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
