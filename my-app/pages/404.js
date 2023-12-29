import { ChevronRightIcon } from "@heroicons/react/20/solid";
import {
  WalletIcon,
  ComputerDesktopIcon,
  QueueListIcon,
  RssIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";

const links = [
  {
    name: "Contact us",
    href: "/contact",
    description: "contact us by clicking on this section.",
    icon: ComputerDesktopIcon,
  },
  {
    name: "Pools",
    href: "/pool",
    description: "Explore the Pool page.",
    icon: QueueListIcon,
  },
  {
    name: "Exchange",
    href: "/exchange",
    description: "Make an exchange.",
    icon: WalletIcon,
  },
  {
    name: "Blog",
    href: "/blogs",
    description: "Read our latest news and articles.",
    icon: RssIcon,
  },
  {
    name: "Docs",
    href: "https://alexfedotovqq.github.io/DocsTradeCoin/#/",
    description: "See our documentation",
    icon: DocumentTextIcon,
  },
];

export default function ErrorPage() {
  return (
    <div className="relative bg-gray-800">
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <div className="mx-auto mt-6 max-w-2xl text-center sm:mt-6">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
            This page does not exist
          </h1>
          <p className="mt-4 text-base leading-7 text-white sm:mt-6 sm:text-lg sm:leading-8">
            Sorry, we could not find the page you are looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul
            role="list"
            className="-mt-6 divide-y divide-white/5 border-b border-white/5"
          >
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg shadow-sm ring-1 ring-white/10">
                  <link.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm font-semibold leading-6 text-white">
                    <a href={link.href}>
                      <span className="absolute inset-0" aria-hidden="true" />
                      {link.name}
                    </a>
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-white">
                    {link.description}
                  </p>
                </div>
                <div className="flex-none self-center">
                  <ChevronRightIcon
                    className="h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="text-xl font-semibold leading-6 text-indigo-400"
            >
              <span aria-hidden="true">&larr;</span>
              Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
