import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "nexvrasolutions.com",
          },
        ],
        destination: "https://www.nexvrasolutions.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;