import { Transition, Fragment } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/20/solid";

export default function SuccessMessage({ isSuccess }) {
  return (
    <Transition show={isSuccess} as={Fragment}>
      <div className="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-green-50 shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <CheckCircleIcon
                className="h-5 w-5 text-green-400"
                aria-hidden="true"
              />
            </div>
            <p className="ml-3 text-sm font-medium text-green-800">
              The transaction has succeeded.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  );
}
