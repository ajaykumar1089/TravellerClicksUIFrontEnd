/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // required for static export
  trailingSlash: true,       // recommended for Azure
  images: {
    unoptimized: true,
  },

  // IMPORTANT: Disable Turbopack inside CI to avoid WorkerError
  webpack: (config) => {
    return config;
  },

  // or if you want turbopack but with empty config:
  // turbopack: {},
};

module.exports = nextConfig;

