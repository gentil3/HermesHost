import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['stripe'],
  images: {
    remotePatterns: [],
  },
}

export default nextConfig
