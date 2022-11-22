
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { useState } from 'react'
import { Switch } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [agreed, setAgreed] = useState(false)

  return (
    <div className="overflow-hidden bg-orange-400 py-16 px-4 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto max-w-xl">
        <svg
          className="absolute left-full translate-x-1/2 transform"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
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
              <rect x={0} y={0} width={4} height={4} className="text-black-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <svg
          className="absolute right-full bottom-0 -translate-x-1/2 transform"
          width={404}
          height={404}
          fill="none"
          viewBox="0 0 404 404"
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
              <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
            </pattern>
          </defs>
          <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
        </svg>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-black-900 sm:text-4xl">Exchange</h2>
          <p className="mt-4 text-lg leading-6 text-black-500">
          Here you can exchange currency
          </p>
        </div>
       
            <div className="sm:col-span-2">
              <label htmlFor="number" className="block text-sm font-medium text-black-700">
              Coin 1
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="country" className="sr-only">
                  Coin  1
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-4 pr-3 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option>ETH</option>
                    <option>BNB</option>
                    <option>DOT</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="number"
                  id="number"
                  autoComplete="tel"
                  className="block w-full rounded-md border-gray-300 py-3 px-4 pl-20 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0,232323232"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="number" className="block text-sm font-medium text-black-700">
              Coin 2
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <label htmlFor="country" className="sr-only">
                  Coin
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="h-full rounded-md border-transparent bg-transparent py-0 pl-4 pr-3 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option>ETH</option>
                    <option>BNB</option>
                    <option>DOT</option>
                  </select>
                </div>
                <input
                  type="text"
                  name="number"
                  id="number"
                  autoComplete="tel"
                  className="block w-full rounded-md border-gray-300 py-3 px-4 pl-20 focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="0,22222112"
                />
              </div>
            </div>
           
            
            <div className="sm:col-span-2">
              <button
                type="submit"
                className=" relative mt-5 inline-flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-800 focus:ring-offset-2"
              >
                Exchange
              </button>
            </div>
          
        </div>
      </div>
    
  )
}