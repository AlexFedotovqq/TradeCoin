import Link from 'next/link'
const posts = [
    {
      title: 'XRC Swap: Unlocking Liquidity with a Decentralized Token Exchange Protocol',
      href: '/blogs/unlocking',
      category: { name: 'Article', href: '#' },
      description:
        'The rise of decentralized finance (DeFi) has revolutionized the financial world, allowing anyone to access a variety of financial services and investments without relying on a centralized entity.',
      date: 'Jan 12, 2022',
      datetime: '2022-01-12',
      imageUrl:
        'https://dspyt.com/_next/image?url=%2Fimages%2Fposts%2Fxrcswap%2Fimage.webp&w=640&q=75',
      readingTime: '6 min',
      author: {
        name: 'Our Twitter',
        href: 'https://twitter.com/XrcSwap',
        imageUrl:
          'https://pbs.twimg.com/profile_images/1599419783618904064/1spC1U1G_400x400.jpg',
      },
    },
    {
      title: 'HOW TO ACCESS YOUR XDC NETWORK (XDC) ACCOUNT VIA METAMASK',
      href: '/blogs/access',
      category: { name: 'Article', href: '#' },
      description:
        'Download MetaMask wallet from the App Store or Google Play.',
      date: 'Jan 16, 2022',
      datetime: '2022-01-16',
      imageUrl:
        'https://www.xdc.dev/images/sforPIcEaZSQqArN0fsKq1AXsnkGlnTkKa0xT-bsyeQ/s:1000:420/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L3ZlNmUzZDl0aW56/ZTdma2p5aWZlLnBu/Zw',
      readingTime: '3 min',
      author: {
        name: 'Our Twitter',
        href: 'https://twitter.com/XrcSwap',
        imageUrl:
          'https://pbs.twimg.com/profile_images/1599419783618904064/1spC1U1G_400x400.jpg',
      },
    },
    {
      title: 'XRC-Swap decentralized Exchange on XDC Blockchain',
      href: '/blogs/decentraliz',
      category: { name: 'Article', href: '#' },
      description:
        'On the XDC blockchain, cryptocurrencies (XRC-20 tokens) can be exchanged using the peer-to-peer XRC-Swap. In order to promote censorship resistance, security, and self-custody, the protocol is built as a collection of persistent, non-upgradable smart contracts. ',
      date: 'Jan 17, 2022',
      datetime: '2022-01-17',
      imageUrl:
        'https://www.xdc.dev/images/IBOJm8etmlJM19eT93yZoQ4lMziudzwqXPdJ2_QLTAc/s:1000:420/mb:500000/ar:1/aHR0cHM6Ly93d3cu/eGRjLmRldi91cGxv/YWRzL2FydGljbGVz/L3ZiaTBjYmV6ZW4y/cmpwcGwzZWh5Lmpw/Zw',
      readingTime: '6 min',
      author: {
        name: 'Our Twitter',
        href: 'https://twitter.com/XrcSwap',
        imageUrl:
          'https://pbs.twimg.com/profile_images/1599419783618904064/1spC1U1G_400x400.jpg',
      },
    },
  ]
  
  export default function Example() {
    return (
      <div className="relative bg-white px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
        <div className="absolute inset-0">
          <div className="h-1/3 bg-white  sm:h-2/3" />
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our blogs</h2>
            <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-900 sm:mt-4">
            <strong> Here you can read our posts and learn something new and interesting.</strong>
            </p>
          </div>
          <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map((post) => (
              <div key={post.title} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <img className="h-48 w-full object-cover" src={post.imageUrl} alt="" />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-indigo-600">
                      <a href={post.category.href} className="hover:underline">
                        {post.category.name}
                      </a>
                    </p>
                    <a href={post.href} className="mt-2 block">
                      <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                      <p className="mt-3 text-base text-gray-500">{post.description}</p>
                    </a>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <a href={post.author.href}>
                        <span className="sr-only">{post.author.name}</span>
                        <img className="h-10 w-10 rounded-full" src={post.author.imageUrl} alt="" />
                      </a>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        <Link href={post.author.href} className="hover:underline">
                          {post.author.name}
                        </Link>
                      </p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <time dateTime={post.datetime}>{post.date}</time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.readingTime} read</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }