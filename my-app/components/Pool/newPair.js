import { Disclosure } from "@headlessui/react";
import { classNames } from "@/utils/classNames";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

export function AddNewPair() {
  return (
    <div className="mx-auto flex items-center justify-center py-2 px-4 mt-5">
      <Disclosure as="div" key="Add new pair">
        {({ open }) => (
          <>
            <h3 className="flex items-center justify-center">
              <Disclosure.Button className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700">
                <span
                  className={classNames(
                    open ? "text-white-200" : "text-white",
                    "text-sm font-medium"
                  )}
                >
                  Add new pair
                </span>

                <span className="ml-6 flex items-center justify-center">
                  {open ? (
                    <MinusIcon
                      className="block h-6 w-6 text-white group-hover:text-indigo-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <PlusIcon
                      className="block h-6 w-6 text-white group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  )}
                </span>
              </Disclosure.Button>
            </h3>

            <Disclosure.Panel as="div" className="prose prose-sm pb-6">
              <div className="rounded-2xl mt-5  bg-gray-700 p-4">
                <div className="mt- sm:col-span-2">
                  <label
                    htmlFor="number"
                    className="block text-center font-medium text-white"
                  >
                    Cryptocurrency
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <label className="sr-only">Cryptocurrency</label>
                    </div>
                    <input
                      type="text"
                      name="number"
                      id="number"
                      onChange={(event) => setTokenA(event.target.value)}
                      className="block w-full bg-white rounded-md py-3 px-4 pl-25"
                      placeholder="…"
                    />
                  </div>
                </div>
                <div className="mt-4 sm:col-span-2">
                  <label
                    htmlFor="number"
                    className="block text-center font-medium text-white"
                  >
                    Cryptocurrency
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 flex items-center">
                      <label className="sr-only">Cryptocurrency</label>
                    </div>
                    <input
                      type="text"
                      name="number"
                      id="number"
                      onChange={(event) => setTokenB(event.target.value)}
                      className="block w-full rounded-md bg-white py-3 px-4 pl-25"
                      placeholder="…"
                    />
                  </div>
                </div>
                <div className="mt-9 flex lg:mt-2 lg:flex-shrink-0">
                  <div className="inline-flex rounded-md shadow">
                    <a
                      onClick={() => startUpload()}
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
                    >
                      Add
                    </a>
                  </div>
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
