import Link from 'next/link'
export default function Example() {
  return (
    <div className="relative overflow-hidden bg-white py-16">
      <div className="hidden lg:absolute lg:inset-y-0 lg:block lg:h-full lg:w-full lg:[overflow-anchor:none]">
        <div className="relative mx-auto h-full max-w-prose text-lg" aria-hidden="true">
          <svg
            className="absolute top-12 left-full translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-900" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
          </svg>
          <svg
            className="absolute top-1/2 right-full -translate-y-1/2 -translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-900" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
          </svg>
          <svg
            className="absolute bottom-12 left-full translate-x-32 transform"
            width={404}
            height={384}
            fill="none"
            viewBox="0 0 404 384"
          >
            <defs>
              <pattern
                id="d3eb07ae-5182-43e6-857d-35c643af9034"
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits="userSpaceOnUse"
              >
                <rect x={0} y={0} width={4} height={4} className="text-gray-900" fill="currentColor" />
              </pattern>
            </defs>
            <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
          </svg>
        </div>
      </div>
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg">
          <h1>
            <span className="block text-center text-lg font-semibold text-indigo-600">Introducing</span>
            <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
            XRC-Swap decentralized Exchange on XDC Blockchain
            </span>
          </h1>
          <p className="mt-8 text-xl leading-8 text-gray-900">
          On the XDC blockchain, cryptocurrencies (XRC-20 tokens) can be exchanged using the peer-to-peer XRC-Swap. In order to promote censorship resistance, security, and self-custody, the protocol is built as a collection of persistent, non-upgradable smart contracts. It is also intended to operate without the use of any trusted intermediaries who might arbitrarily impose access restrictions.
The XRC-Swap is currently open source and MIT-licensed. Once implemented, XRC-Swap in any version will always be operational with 100% uptime as long as the XDC blockchain is active.
How does a normal market compare to XRC-Swap?
It is helpful to first consider two topics: how the automated market maker design differs from conventional central limit order book-based exchanges, and how permissionless systems differ from traditional permissioned systems, in order to understand how XRC-Swap differs from a traditional exchange.
          </p>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          AMM vs. Order Book
            </p>
            <p className="mt-8 text-xl leading-8 text-gray-900">
            The majority of openly accessible markets employ a central limit order book method of trading, in which buyers and sellers create orders arranged by price level that are gradually filled as demand changes. A system known as an order book will be familiar to everyone who has traded equities through brokerage houses.
Instead of employing an order book, the XRC-Swap employs an automated market maker (AMM), also known as a constant function market maker.
At a very high level, an AMM substitutes a liquidity pool of two assets that are both valued in relation to one another for the buy and sell orders in an order book market. The relative prices of the two assets change as they are exchanged, and a new market rate for each is established. Instead of dealing with specific orders placed by different parties, a buyer or seller in this dynamic deals directly with the pool. A rising number of parties are actively researching the advantages and downsides of automated market makers compared to their traditional order book counterparts. On our study page, we&apos;ve compiled a few noteworthy cases.
          </p>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Unauthorized Systems
            </p>
            <p className="mt-8 text-xl leading-8 text-gray-900">
            The immutable and permissionless XRC-Swap is the second departure from conventional markets. The fundamental principles of XDC and our dedication to the ideals of permissionless access and immutability as essential elements of a future in which anyone in the world can access financial services without concern for discrimination or counter-party risk served as the inspiration for these design choices.
The services provided by a protocol with a permissionless architecture cannot be selectively restricted as to who may or may not use them. Anyone may freely trade, offer liquidity, or establish new markets. Traditional financial services usually limit access depending on a person&apos;s location, level of income, and age.
Additionally, the protocol is immutable, meaning it cannot be upgraded. No party is permitted to reverse trade execution, pause contracts, or otherwise alter the protocol&apos;s behavior in any manner.
          </p>
          <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
          Conclusion
            </p>
            <p className="mt-8 text-xl leading-8 text-gray-900">
            On the XDC blockchain, cryptocurrencies (XRC-20 tokens) can be exchanged using the peer-to-peer XRC-Swap. The protocol is built as a collection of persistent, non-upgradable smart contracts. It is intended to operate without the use of any trusted intermediaries. An automated market maker (AMM) is a departure from the traditional order book market. Instead of dealing with specific orders placed by different parties, a buyer or seller deals directly with a pool of assets.
          </p>
        </div>
        <div className="mx-auto mt-10 flex max-w-prose text-base lg:max-w-none">
                <div className="rounded-md shadow">
                <Link href="/blogs"
                                    className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-500 px-5 py-3 text-base font-medium text-white hover:bg-indigo-700"

>
Back to the blog         
                        </Link>
                </div>
              </div> 
      </div>
    </div>
  )
}