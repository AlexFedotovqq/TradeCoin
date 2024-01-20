const posts = [
  {
    title: "📢 Good news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1747483124890489083",
    description:
      "Our documentation has now been officially completed, and we are pleased to inform you about it. ⚒️",
    imageUrl: "./news/docs.png",
    date: "Jan 17, 2024",
    datetime: "2024-01-15",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Updated documentation 📢",
    href: "https://twitter.com/_TradeCoin_/status/1746886607972544760",
    description:
      "Added information about the pool page ⚒️ We will add information about the rest of the pages soon.📌",
    imageUrl: "./news/1401.jpg",
    date: "Jan 15, 2024",
    datetime: "2024-01-15",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 We have started to develop documentation. 📢",
    href: "https://twitter.com/_TradeCoin_/status/1746657038598382054",
    description:
      "At the moment, we have general information about the project, as well as how the exchange page works! ⚒️ Tomorrow we will add information about the Pool page📌",
    imageUrl: "./news/docs.png",
    date: "Jan 14, 2024",
    datetime: "2024-01-14",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Exciting news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1745963044360876142",
    description:
      "We have just updated our website with a new contact form!📨 Since her debut, our inbox has been literally teeming with messages from wonderful people like you.🌟 We are always glad to reply to your messages!💬",
    imageUrl: "./news/1301.png",
    date: "Jan 13, 2024",
    datetime: "2024-01-13",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title:
      "🚀 Launched a decentralized exchange (DEX) adventure with TypeScript and Node.js!🌐",
    href: "https://twitter.com/_TradeCoin_/status/1745496030810935493",
    description:
      "Minted 2 tokens, initialized DEX, and supplied liquidity.🔄 Swapped tokens successfully and burned liquidity. All smooth in 22.04s!🎉",
    imageUrl: "./news/1101.jpg",
    date: "Jan 11, 2024",
    datetime: "2024-01-11",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "🚀 Launched Yarn testToken script, deploying a BasicTokenContract.",
    href: "https://twitter.com/_TradeCoin_/status/1745123764512112680",
    description:
      "Minted 10 tokens and sent 1 to B62qr2FdbdrVE2RpBLALd6NHpaEFvaQo1d4kkoNDEBLankp6kBUraQy.🌐💰 Explored balances for various addresses. Exciting journey in 18.50s!🚀🔍 ",
    imageUrl: "./news/1001.png",
    date: "Jan 10, 2024",
    datetime: "2024-01-10",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "⚒️ The Pool page has been updated ⚒️",
    href: "https://twitter.com/_TradeCoin_/status/1744112296174006612",
    description:
      "The first photo shows how it used to be. The second photo shows what it looks like at the moment. For more information about the changes, see below📢",
    imageUrl: "./news/701.png",
    date: "Jan 7, 2024",
    datetime: "2024-01-7",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
];

export default function Example() {
  return (
    <div className="overflow-hidden bg-gray-800 py-16 px-8 min-h-screen">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 ">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            TradeCoin News
          </h2>
          <p className="mt-2 text-lg leading-8 text-gray-100">
            Find out our latest news directly from Twitter
          </p>

          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {posts.map((post, index) => (
              <article
                key={index}
                className="relative isolate flex flex-col gap-8 lg:flex-row"
              >
                <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full rounded-2xl bg-gray-50 object-cover object-center"
                  />

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-300" />
                </div>
                <div>
                  <div className="flex items-center gap-x-4 text-xs">
                    <time dateTime={post.datetime} className="text-gray-100">
                      {post.date}
                    </time>
                    <a
                      href={post.category.href}
                      className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-900 hover:bg-gray-100"
                    >
                      {post.category.title}
                    </a>
                  </div>
                  <div className="group relative max-w-xl">
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-100 group-hover:text-gray-100">
                      <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                    <p className="mt-5 text-sm leading-6 text-gray-100">
                      {post.description}
                    </p>
                  </div>
                  <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                    <div className="relative flex items-center gap-x-4">
                      <img
                        src={post.author.imageUrl}
                        alt=""
                        className="h-10 w-10 rounded-full bg-gray-50"
                      />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-100">
                          <a href={post.author.href}>
                            <span className="absolute inset-0" />
                            {post.author.name}
                          </a>
                        </p>
                        <p className="text-gray-100">{post.author.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
