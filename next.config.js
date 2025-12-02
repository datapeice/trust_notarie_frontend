/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // Disabled to allow dynamic routes like /documents/[id]
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.resolve.alias = {
      ...config.resolve.alias,
      '@react-native-async-storage/async-storage': false, // Fix for MetaMask SDK
    };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
};

module.exports = nextConfig;
