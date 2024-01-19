const posts = [
  {
    title: "📢 Good news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1747483124890489083",
    description:
      "Our documentation has now been officially completed, and we are pleased to inform you about it. ⚒️",
    imageUrl: "/docs.png",
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
    imageUrl: "/1401.jpg",
    date: "Jan 15, 2024",
    datetime: "2024-01-15",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
];

export default function Example() {
  return (
    <div className="bg-gray-800 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
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

                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
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
