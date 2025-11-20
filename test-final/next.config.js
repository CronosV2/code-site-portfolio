/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/app': require('path').resolve(__dirname, '.vortex/app'),
    };
    return config;
  },
};

module.exports = nextConfig;
