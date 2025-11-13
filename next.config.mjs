// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    devIndicators: {
      buildActivity: false,
    },
    serverActions: {
      bodySizeLimit: "10mb", // increase limit (e.g., 10 MB)
    },
  },
};

export default nextConfig;
