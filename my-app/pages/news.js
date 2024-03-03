import React from "react";

import PostFunction from "../components/News/postFunction";
import posts from "../components/News/postsData";

export default function News() {
  return (
    <div className="overflow-hidden bg-gray-800 py-16 px-8 min-h-screen">
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
              <PostFunction key={index} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
