/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE,
  },
  // Add configuration for handling static files
  async headers() {
    return [
      {
        source: "/locales/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
