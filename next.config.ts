/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    return config;
  },
  
  // Disable Turbopack + LightningCSS
  experimental: {
    turbo: false,
    optimizeCss: false,
   

