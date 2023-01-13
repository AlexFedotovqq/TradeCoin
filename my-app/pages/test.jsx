import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'


export default function Example() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="isolate bg-white">

      
      <main>
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-20 pb-32  sm:pb-40">
            <div>
              
              <div>
                
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl">
                XRC-Swap
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                XRC-Swap provides DeFi tools for token holders & businesses to buy, trade, create, and secure crypto assets with confidence.
                </p>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                  <a
                    href="/exchange"
                    className="inline-block rounded-lg bg-indigo-600 px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-indigo-600 hover:bg-indigo-700 hover:ring-indigo-700"
                  >
                    Exchange{' '}
                    <span className="text-indigo-200" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                  <a
                    href="#"
                    className="inline-block rounded-lg px-4 py-1.5 text-base font-semibold leading-7 text-gray-900 ring-1 ring-gray-900/10 hover:ring-gray-900/20"
                  >
                    Live demo video{' '}
                    <span className="text-gray-400" aria-hidden="true">
                      &rarr;
                    </span>
                  </a>
                </div>
              </div>
              
              <div>
                
              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                About "Blog"
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                We have a "Blog" tab on our site.
                </p>
                <p className="mt-3 text-lg leading-3 text-gray-600 sm:text-center">
                On this tab you can read something interesting from the field of crypto and so on.
                </p>
                <div className="mt-3"></div>
                <div className="relative overflow-hidden  flex items-center justify-center">
      <iframe src="/tenor (4).gif" width="580" height="445"  className='justify-center flex items-center' allowFullScreen></iframe>
    </div>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="text-gray-600">
                  Here are the most interesting posts{' '}
                    <a href="/blogs" className="font-semibold text-indigo-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      View our blog <span aria-hidden="true">&rarr;</span>
                    </a>
                  </span>
                </div>
                </div>
              </div>
              </div>
              </div>
              <div>
              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                About "Exchange"
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                We have a "Exchange" tab on our site.
                </p>
                <p className="mt-3 text-lg leading-3 text-gray-600 sm:text-center">
                On this tab you can exchange cryptocurrency
                </p>
                <div className="mt-3"></div>
                <div className="relative overflow-hidden  flex items-center justify-center">
      <iframe src="/tenor.gif" width="480" height="459"  className='justify-center flex items-center' allowFullScreen></iframe>
    </div>
                <div className="mt-3 flex gap-x-4 sm:justify-center">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="text-gray-600">
                  Here are the most interesting exchange{' '}
                    <a href="/exchange" className="font-semibold text-indigo-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      View our Exchange <span aria-hidden="true">&rarr;</span>
                    </a>
                  </span>
                </div>
                </div>
              </div>
              </div>
              </div>
              <div>
              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                About "Pool"
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                We have a "Pool" tab on our site.
                </p>
                <p className="mt-3 text-lg leading-3 text-gray-600 sm:text-center">
                -----------------------------something-----------------------------------------
                </p>
                <div className="mt-3"></div>
                <div className="relative overflow-hidden  flex items-center justify-center">
      <iframe src="/tenor (3).gif" width="580" height="390"  className='justify-center flex items-center' allowFullScreen></iframe>
    </div>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="text-gray-600">
                  Here are the most interesting pool{' '}
                    <a href="/pool" className="font-semibold text-indigo-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      View our pool <span aria-hidden="true">&rarr;</span>
                    </a>
                  </span>
                </div>
                </div>
              </div>
              </div>
              </div>
              <div>
              <div className="mt-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-5xl">
                About "Contact us"
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-center">
                We have a "Contact us" tab on our site.
                </p>
                <p className="mt-3 text-lg leading-3 text-gray-600 sm:text-center">
                -----------------------------something-----------------------------------------
                </p>
                <div className="mt-3"></div>
                <div className="relative overflow-hidden  flex items-center justify-center">
      <iframe src="/tenor (2).gif" width="510" height="400"  className='justify-center flex items-center' allowFullScreen></iframe>
    </div>
                <div className="mt-8 flex gap-x-4 sm:justify-center">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                  <span className="text-gray-600">
                  Here are the most interesting pool{' '}
                    <a href="/pool" className="font-semibold text-indigo-600">
                      <span className="absolute inset-0" aria-hidden="true" />
                      Contact us <span aria-hidden="true">&rarr;</span>
                    </a>
                  </span>
                </div>
                </div>
              </div>
              </div>
              </div>
              <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                <svg
                  className="relative left-[calc(50%+3rem)] h-[21.1875rem] max-w-none -translate-x-1/2 sm:left-[calc(50%+36rem)] sm:h-[42.375rem]"
                  viewBox="0 0 1155 678"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="url(#ecb5b0c9-546c-4772-8c71-4d3f06d544bc)"
                    fillOpacity=".3"
                    d="M317.219 518.975L203.852 678 0 438.341l317.219 80.634 204.172-286.402c1.307 132.337 45.083 346.658 209.733 145.248C936.936 126.058 882.053-94.234 1031.02 41.331c119.18 108.451 130.68 295.337 121.53 375.223L855 299l21.173 362.054-558.954-142.079z"
                  />
                  <defs>
                    <linearGradient
                      id="ecb5b0c9-546c-4772-8c71-4d3f06d544bc"
                      x1="1155.49"
                      x2="-78.208"
                      y1=".177"
                      y2="474.645"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#9089FC" />
                      <stop offset={1} stopColor="#FF80B5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}