/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false,        // Disable Turbopack
    optimizeCss: false,  // Disable LightningCSS
  },
};

module.exports = nextConfig;
