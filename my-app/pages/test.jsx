import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

export default function Example() {
  return (
    <div className=" bg-gradient-to-b from-indigo-200 to-indigo-500 py-16 ">
      <div className="mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-16 divide-y divide-gray-100 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-3">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                Contact us
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2 lg:gap-8">
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Contact with TradeCoin
                </h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-indigo-900">
                  <div>
                    <dt className="sr-only">Email</dt>

                    <dd>
                      <a
                        className="flex text-base  font-semibold text-indigo-600"
                        href="mailto:communication.with.tradecoin@gmail.com"
                      >
                        communication.with.tradecoin@gmail.com
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Our instagram
                </h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dt className="sr-only">instagram</dt>
                    <dd>
                      <a
                        className="font-semibold text-indigo-600"
                        href="https://www.instagram.com/_tradecoin_/"
                      >
                        instagram
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Our twitter
                </h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dt className="sr-only">twitter</dt>
                    <dd>
                      <a
                        className="font-semibold text-indigo-600"
                        href="https://twitter.com/_TradeCoin_"
                      >
                        Twitter
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-2xl bg-gray-50 p-10">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Phone number
                </h3>
                <dl className="mt-3 space-y-1 text-sm leading-6 text-gray-600">
                  <div>
                    <dd className="flex text-base text-indigo-600">
                      <PhoneIcon
                        className="h-6 w-6 flex-shrink-0 text-gray-900"
                        aria-hidden="true"
                      />
                      <span className="ml-3">+34 (674) 849-326</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
