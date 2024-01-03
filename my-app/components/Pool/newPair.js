import { Disclosure } from "@headlessui/react";
import { classNames } from "@/utils/classNames";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

export function AddNewPair() {
  const [open, setOpen] = useState(false);
  return (
    <div className="mx-auto flex items-center justify-center py-2 px-4 mt-5">
      <Disclosure as="div" key="Add new pair">
        {({ open }) => (
          <>
            <h3 className="flex items-center justify-center">
              <Disclosure.Button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700">
                <span className="flex items-center">
                  <span
                    className={classNames(
                      open ? "text-white-200" : "text-white",
                      "text-sm font-medium"
                    )}
                  >
                    Add new pair
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-4 w-4 ml-1 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </span>

                <span className="ml-2 flex items-center justify-center">
                  <Transition.Root show={open} as={Fragment}>
                    <Dialog
                      as="div"
                      className="relative z-10"
                      onClose={setOpen}
                    >
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                      </Transition.Child>

                      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
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
                                <Disclosure.Panel
                                  as="div"
                                  className="prose prose-sm pb-6"
                                >
                                  <div className="rounded-2xl mt-1 p-2">
                                    <div className="mt- sm:col-span-2">
                                      <label
                                        htmlFor="number"
                                        className="block text-center font-medium text-black"
                                      >
                                        Cryptocurrency
                                      </label>
                                      <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center">
                                          <label className="sr-only">
                                            Cryptocurrency
                                          </label>
                                        </div>
                                        <input
                                          type="text"
                                          name="number"
                                          id="number"
                                          onChange={(event) =>
                                            setTokenA(event.target.value)
                                          }
                                          className="block w-full bg-gray-300 rounded-md py-3 px-4 pl-25"
                                          placeholder="…"
                                        />
                                      </div>
                                    </div>
                                    <div className="mt-4 sm:col-span-2">
                                      <label
                                        htmlFor="number"
                                        className="block text-center font-medium text-black"
                                      >
                                        Cryptocurrency
                                      </label>
                                      <div className="relative mt-1 rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 flex items-center">
                                          <label className="sr-only">
                                            Cryptocurrency
                                          </label>
                                        </div>
                                        <input
                                          type="text"
                                          name="number"
                                          id="number"
                                          onChange={(event) =>
                                            setTokenB(event.target.value)
                                          }
                                          className="block w-full rounded-md bg-gray-300 py-3 px-4 pl-25"
                                          placeholder="…"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </Disclosure.Panel>
                              </div>
                              <div className="mt-3 sm:mt-3">
                                <button
                                  type="button"
                                  className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                  onClick={() => startUpload()}
                                >
                                  Add new pair
                                </button>
                              </div>
                            </Dialog.Panel>
                          </Transition.Child>
                        </div>
                      </div>
                    </Dialog>
                  </Transition.Root>
                </span>
              </Disclosure.Button>
            </h3>
          </>
        )}
      </Disclosure>
    </div>
  );
}
