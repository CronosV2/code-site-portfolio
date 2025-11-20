/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurer Next.js pour utiliser le dossier .vortex
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  webpack: (config) => {
    // Ajouter un alias pour résoudre les imports depuis .vortex
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/app': require('path').resolve(__dirname, '.vortex/app'),
    };
    return config;
  },
};

module.exports = nextConfig;
