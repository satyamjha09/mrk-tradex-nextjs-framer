import type { NextConfig } from "next";

const vercelApiTraceIncludes = [
  "./apps/ecommerce/server/dist/**/*",
  "./apps/ecommerce/server/prisma/schema.prisma",
  "./apps/ecommerce/server/package.json",
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: process.cwd(),
  outputFileTracingIncludes: {
    "/api/v1/**": vercelApiTraceIncludes,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
    domains: [
      "m.media-amazon.com",
      "www.bestbuy.com",
      "www.dyson.com",
      "store.hp.com",
      "i1.adis.ws",
      "i5.walmartimages.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
      "store.storeimages.cdn-apple.com",
    ],
  },
};

export default nextConfig;
