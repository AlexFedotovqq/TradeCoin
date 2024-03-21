const posts = [
  {
    title: "📢 Exciting news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1769886995273113763",
    description:
      "We are happy to share some statistical data with you 🔍            We've had 6,000 views on Twitter in the last 30 days 📌 Over the past 12 days, 49 visitors have visited our site, and there have also been 210 page clicks!",
    imageUrl: "/news/exciting.jpg",
    date: "Mar 19, 2024",
    datetime: "2024-03-19",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Update 📢",
    href: "https://twitter.com/_TradeCoin_/status/1768761424422068445",
    description:
      "The interface for choosing tokens has become more convenient, technologically advanced and attractive ⚒️",
    imageUrl: "/news/update.jpg",
    date: "Mar 15, 2024",
    datetime: "2024-03-15",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Exciting news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1766573326799917385",
    description:
      "Just deployed a pair contract for 2 new tokens (tokenX & tokenY) with initial supply of 1 billion each.",
    imageUrl: "/news/exciting.jpg",
    date: "Mar 09, 2024",
    datetime: "2024-03-09",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Exciting news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1762960757862375602",
    description:
      "Initialized tokens tokenX and tokenY into smart contracts. Deployed a pair & initialized tokens within it. Created users & supplied tokens. Deployed pair minting contract & minted liquidity",
    imageUrl: "/news/exciting.jpg",
    date: "Feb 28, 2024",
    datetime: "2024-02-28",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Updated documentation  📢",
    href: "https://twitter.com/_TradeCoin_/status/1756341365753921609",
    description: "Added information about wallet settings ⚒️",
    imageUrl: "/news/update.jpg",
    date: "Feb 10, 2024",
    datetime: "2024-02-10",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Exciting news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1756054878592331881",
    description:
      "We just posted a new video! Check out our latest download to get a detailed overview of the TradeCoin project",
    imageUrl: "/news/exciting.jpg",
    date: "Feb 9, 2024",
    datetime: "2024-02-09",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Exciting Update! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1754249788105650286",
    description:
      "Our wallet just got even better with new functions 1)Hide address🙌 2)Copy address📋 3)Disable wallet🔒",
    imageUrl: "/news/update.jpg",
    date: "Feb 4, 2024",
    datetime: "2024-02-04",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "More than 18.9 thousand impressions! 🚀",
    href: "https://twitter.com/_TradeCoin_/status/1752362105297133924",
    description:
      "Thank you all for the incredible support!🙌 Your engagement and interaction mean a lot to us🤗",
    imageUrl: "/news/exciting.jpg",
    date: "Jan 30, 2024",
    datetime: "2024-01-30",
    category: { title: "Exciting" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 A new News page has been added 📢",
    href: "https://twitter.com/_TradeCoin_/status/1748692516960940344",
    description:
      "This page was added instead of the blog page. Now you can find out our latest news directly on the website! ⚒️",
    imageUrl: "/news/update.jpg",
    date: "Jan 20, 2024",
    datetime: "2024-01-20",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
  {
    title: "📢 Good news! 📢",
    href: "https://twitter.com/_TradeCoin_/status/1747483124890489083",
    description:
      "Our documentation has now been officially completed, and we are pleased to inform you about it. ⚒️",
    imageUrl: "/news/update.jpg",
    date: "Jan 17, 2024",
    datetime: "2024-01-17",
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
    imageUrl: "/news/update.jpg",
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
    imageUrl: "/news/update.jpg",
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
    imageUrl: "/news/update.jpg",
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
    imageUrl: "/news/exciting.jpg",
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
    imageUrl: "/news/exciting.jpg",
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
    imageUrl: "/news/update.jpg",
    date: "Jan 7, 2024",
    datetime: "2024-01-7",
    category: { title: "Update" },
    author: {
      name: "TradeCoin",
      href: "https://twitter.com/_TradeCoin_",
      imageUrl: "/logo2.jpg",
    },
  },
];

export default posts;
