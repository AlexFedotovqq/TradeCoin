import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'
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
            viewBox="0 0 404 1104"
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
            <rect width={404} height={1104} fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-black-900 sm:text-4xl">Pools</h2>
          </div>
          <div className="bg-orange-400">
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-3 lg:px-1">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-2xl">
          <span className="block">Add new token</span>
        </h2>
        
        <div className="ml-3 inline-flex rounded-md shadow"></div>
        <a
        href="/liquidity"
        type="button"
        className="inline-flex items-center rounded-full border border-transparent bg-gray-600 p-2 text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"  
        >
        <PlusIconOutline className="h-6 w-6" aria-hidden="true" />
        </a>
        
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          

          <div className="inline-flex rounded-md shadow">
            <a
              href="/liquidity"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white hover:bg-indigo-700"
            >
              Add Liquidity
            </a>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-2 text-base font-medium text-indigo-600 hover:bg-indigo-50"
            >
              Delete Liquidity
            </a>
          </div>
        </div>
        </div>
      </div>
    </div>
    
    <div className="overflow-hidden rounded-lg bg-white shadow">
    <div className="p-28">
    </div>
    </div>
              
      </div>
      </div>
    )
  }