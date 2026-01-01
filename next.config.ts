// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   //output: 'export',          //dev branch update required for static export
//   trailingSlash: true,       // recommended for Azure
//   images: {
//     unoptimized: true,
//   },
// //   experimental: {
// //   appDir: true,
// //   allowDynamic: true,  // allow dynamic params during export
// //   serverActions: false,
// //   dynamicParams: true,   // <-- allow dynamic [id] routes without static params
// // },
//   // IMPORTANT: Disable Turbopack inside CI to avoid WorkerError
//   webpack: (config) => {
//     return config;
//   },
//   skipMiddlewareUrlNormalize: true,
//   skipTrailingSlashRedirect: true,


//   // or if you want turbopack but with empty config:
//   // turbopack: {},
// };

// module.exports = nextConfig;




import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone', // REQUIRED for Azure App Service

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig





// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//  output: 'export',  
//  trailingSlash: true, 
//   experimental: {
//     serverActions: {
//       allowedOrigins: ["localhost:3000", "*.onrender.com"],
//     },
//   },

//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "**",
//       },
//     ],
//   },

//   async headers() {
//     return [
//       {
//         source: "/:path*",
//         headers: [
//           { key: "X-Frame-Options", value: "SAMEORIGIN" },
//           { key: "X-Content-Type-Options", value: "nosniff" },
//         ],
//       },
//     ];
//   },

//   // Middleware normalization fix
//   skipProxyUrlNormalize: true,
// };

// export default nextConfig;
