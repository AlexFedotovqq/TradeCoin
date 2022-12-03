import { Fragment, useState } from 'react'
import { Dialog, Menu, Transition } from '@headlessui/react'
import {
  Bars3CenterLeftIcon,
  ScaleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import {
  BanknotesIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/20/solid'


const transactions = [
  {
    id: 1,
    name: 'ETH',
    href: 'https://coinmarketcap.com/currencies/ethereum/',
    amount: '1 288,57 $',
    currency: 'USD',
    status: 'success',
    date: 'December 3, 2022',
    datetime: '2022-12-3',
    
  },
  {
    id: 2,
    name: 'BNB',
    href: 'https://coinmarketcap.com/currencies/bnb/',
    amount: '291,92 $',
    currency: 'USD',
    status: 'success',
    date: 'December 3, 2022',
    datetime: '2022-12-3',
    
  },
  {
    id: 3,
    name: 'DOT',
    href: 'https://coinmarketcap.com/dexscan/bsc/0xdd5bad8f8b360d76d12fda230f8baf42fe00',
    amount: '5,64 $',
    currency: 'USD',
    status: 'success',
    date: 'December 3, 2022',
    datetime: '2022-12-3',
    
  },
  // More transactions...
]
const statusStyles = {
  success: 'bg-green-100 text-green-800',
  processing: 'bg-yellow-100 text-yellow-800',
  failed: 'bg-gray-100 text-gray-800',
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
                <rect x={0} y={0} width={4} height={4} className="text-black-200" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={404} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <svg
            className="absolute right-full bottom-0 -translate-x-1/2 transform"
            width={404}
            height={1104}
            fill="none"
            viewBox="0 0 404 790"
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
              <div className="relative overflow-hidden bg-orange-400 h-screen">

<div className="flex flex-1 flex-col  lg:pl-68">

<main className="flex-1 pb-8">
  

  <div className="mt-8">
    

    {/* Activity list (smallest breakpoint only) */}
    <div className="shadow sm:hidden">
      <ul role="list" className="mt-2 divide-y divide-gray-200 overflow-hidden shadow sm:hidden">
        {transactions.map((transaction) => (
          <li key={transaction.id}>
            <a href={transaction.href} className="block bg-white px-4 py-4 hover:bg-gray-50">
              <span className="flex items-center space-x-4">
                <span className="flex flex-1 space-x-2 truncate">
                  <BanknotesIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                  <span className="flex flex-col truncate text-sm text-gray-500">
                    <span className="truncate">{transaction.name}</span>
                    <span>
                      <span className="font-medium text-gray-900">{transaction.amount}</span>{' '}
                      {transaction.currency}
                    </span>
                    <time dateTime={transaction.datetime}>{transaction.date}</time>
                  </span>
                </span>
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
              </span>
            </a>
          </li>
        ))}
        
      </ul>

      <nav
        className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3"
        aria-label="Pagination"
      >
        
      </nav>
    </div>

    {/* Activity table (small breakpoint and up) */}
    <div className="hidden sm:block">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-1">
        <div className="mt-2 flex flex-col">
          <div className="min-w-full overflow-hidden overflow-x-auto align-middle shadow sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    className="bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Cryptocurrency
                  </th>
                  <th
                    className="bg-gray-50 px-12 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Cost
                  </th>
                  <th
                    className="hidden bg-gray-50 px-8 py-3 text-left text-sm font-semibold text-gray-900 md:block"
                    scope="col"
                  >
                    Status
                  </th>
                  <th
                    className="bg-gray-50 px-10 py-3 text-right text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Update date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="bg-white">
                    <td className="w-full max-w-0 whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <div className="flex">
                        <a href={transaction.href} className="group inline-flex space-x-2 truncate text-sm">
                          <BanknotesIcon
                            className="h-5 w-5 flex-shrink-0 text-black group-hover:text-gray-500"
                            aria-hidden="true"
                          />
                          <p className="truncate text-black group-hover:text-gray-900">
                            {transaction.name}
                          </p>
                        </a>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      <span className="font-medium text-gray-900">{transaction.amount}</span>
                      {transaction.currency}
                    </td>
                    <td className="hidden whitespace-nowrap px-6 py-4 text-sm text-gray-500 md:block">
                      <span
                        className={classNames(
                          statusStyles[transaction.status],
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize'
                        )}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                      <time dateTime={transaction.datetime}>{transaction.date}</time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* Pagination */}
            
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
          </div>
        </div>
      </div>
      </div>
    )
  }