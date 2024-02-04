import { useState, useEffect } from "react";
import { Disclosure } from "@headlessui/react";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  AiFillCopy,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineDisconnect,
} from "react-icons/ai";

const LOCAL_STORAGE_KEY = "MINA";

async function connectWallet(updateDisplayAddress) {
  try {
    const accounts = await window.mina.requestAccounts();
    const displayAddress = `${accounts[0].slice(0, 6)}...${accounts[0].slice(
      -4
    )}`;
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(displayAddress)
    );
    updateDisplayAddress(displayAddress);
  } catch (error) {
    throw new Error("Failed to connect wallet");
  }
}

function disconnectWallet(updateDisplayAddress) {
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  updateDisplayAddress(null);
}

function getWalletAddress() {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (value === null) return;
    return JSON.parse(value);
  }
}

export const WalletButton = () => {
  const [open, setOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [displayedAddress, updateDisplayAddress] = useState(getWalletAddress());
  const [showSettings, setShowSettings] = useState(false);
  const [isAddressHidden, setIsAddressHidden] = useState(false);

  const copyToClipboard = () => {
    if (displayedAddress) {
      navigator.clipboard.writeText(displayedAddress);
    }
  };

  const toggleAddressVisibility = () => {
    setIsAddressHidden(!isAddressHidden);
    if (!isAddressHidden) {
      updateDisplayAddress("************");
    } else {
      updateDisplayAddress(getWalletAddress());
    }
  };

  const handleError = (errorMessage) => {
    setError(errorMessage);
    setTimeout(() => setError(null), 5000);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient && (
        <div className="flex items-center md:ml-12">
          {displayedAddress ? (
            <>
              <button
                className={`flex items-center justify-center rounded-md border border-transparent bg-indigo-500 px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5`}
              >
                {displayedAddress}
              </button>

              <Disclosure as="div" key="Add new pair">
                {({ open }) => (
                  <>
                    <h3 className="flex items-center justify-center">
                      <Disclosure.Button className="p-3">
                        <span className="flex items-center">
                          <button
                            onClick={() => setShowSettings(!showSettings)}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="white"
                              className="w-6 h-6"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                              />
                            </svg>
                          </button>
                        </span>

                        <span className="ml-2 flex items-center justify-center">
                          <Transition.Root show={showSettings} as={Fragment}>
                            <Dialog
                              as="div"
                              className="relative z-10"
                              onClose={() => setShowSettings(false)}
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
                                <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
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
                                            {showSettings && (
                                              <div
                                                style={{
                                                  display: "flex",
                                                  flexDirection: "column",
                                                  gap: "10px",
                                                  maxWidth: "160px",
                                                  margin: "0 auto",
                                                }}
                                              >
                                                <button
                                                  onClick={copyToClipboard}
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "10px",
                                                    backgroundColor: "#4F46E5",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  <AiFillCopy className="mr-2" />
                                                  <span>Copy Address</span>
                                                </button>

                                                <button
                                                  onClick={
                                                    toggleAddressVisibility
                                                  }
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "10px",
                                                    backgroundColor: "#4F46E5",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  {isAddressHidden ? (
                                                    <AiOutlineEye className="mr-2 " />
                                                  ) : (
                                                    <AiOutlineEyeInvisible className="mr-2" />
                                                  )}
                                                  <span>
                                                    {isAddressHidden
                                                      ? "Show Address"
                                                      : "Hide Address"}
                                                  </span>
                                                </button>

                                                <button
                                                  onClick={() =>
                                                    disconnectWallet(
                                                      updateDisplayAddress
                                                    )
                                                  }
                                                  style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    padding: "10px",
                                                    backgroundColor: "#e74c3c",
                                                    color: "#fff",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                  }}
                                                >
                                                  <AiOutlineDisconnect className="mr-2" />
                                                  <span>Disconnect</span>
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </Disclosure.Panel>
                                      </div>
                                      <div className="mt-3 sm:mt-3">
                                        <button
                                          onClick={() => {
                                            setOpen(false);
                                            setShowSettings(false);
                                          }}
                                          className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                          Close
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
            </>
          ) : (
            <>
              {error ? (
                <button
                  className={`flex items-center justify-center rounded-md border border-transparent ${
                    isLoading ? "bg-gray-300 text-gray-500" : "bg-indigo-600"
                  } px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5`}
                  onClick={() => setError(null)}
                >
                  {error}
                </button>
              ) : (
                <button
                  onClick={() => {
                    setLoading(true);
                    connectWallet(updateDisplayAddress)
                      .then(() => setError(null))
                      .catch((err) => handleError(err.message))
                      .finally(() => setLoading(false));
                  }}
                  disabled={isLoading}
                  className={`flex items-center justify-center rounded-md border border-transparent ${
                    isLoading ? "bg-indigo-600 text-gray-500" : "bg-indigo-600"
                  } px-4 py-3 text-base font-medium text-white hover:bg-indigo-700 md:py-2 md:px-5`}
                >
                  {isLoading ? "Connecting..." : "Connect Wallet"}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
