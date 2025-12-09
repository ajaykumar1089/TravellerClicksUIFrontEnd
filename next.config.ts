/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false,     // disable LightningCSS
  },
  // force webpack instead of Turbopack
  webpack: (config) => {
    return config;
  },
};

module.exports = nextConfig;
