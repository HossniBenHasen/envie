/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config, context) => {
    if (config.mode === 'development') {
      config.watchOptions = {
        poll: 1000,
        ignored: '/node_modules/',
        aggregateTimeout: 200,
      };
    }
    return config;
  },
  env: {
    API_URL: process.env.URL_API
  }
};

module.exports = nextConfig;
