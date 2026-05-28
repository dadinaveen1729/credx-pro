/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true
  },
  experimental: {
    serverComponentsExternalPackages: ['mongodb', 'openai', 'stripe', 'twilio']
  }
};

module.exports = nextConfig;