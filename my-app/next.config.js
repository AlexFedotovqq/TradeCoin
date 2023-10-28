/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["www.interactivebrokers.com", "www.xdc.dev"],
  },
};

module.exports = nextConfig;
