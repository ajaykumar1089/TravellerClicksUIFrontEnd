/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          //dev branch update required for static export
  trailingSlash: true,       // recommended for Azure
  images: {
    unoptimized: true,
  },
  experimental: {
  appDir: true,
  allowDynamic: true,  // allow dynamic params during export
  serverActions: false,
  dynamicParams: true,   // <-- allow dynamic [id] routes without static params
},
  // IMPORTANT: Disable Turbopack inside CI to avoid WorkerError
  webpack: (config) => {
    return config;
  },
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,


  // or if you want turbopack but with empty config:
  // turbopack: {},
};

module.exports = nextConfig;

