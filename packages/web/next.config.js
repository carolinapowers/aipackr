/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@aipackr/types'],
  images: {
    domains: ['localhost', 's3.amazonaws.com'],
  },
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;