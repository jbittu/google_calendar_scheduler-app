import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' https://accounts.google.com https://www.googleapis.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline';"
          }
        ],
      },
    ];
  }
};

export default nextConfig;
