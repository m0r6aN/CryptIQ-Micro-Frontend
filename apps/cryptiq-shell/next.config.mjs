import { resolve } from 'path'

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve('./'),
      '@/lib': resolve('./lib'),
      '@/components': resolve('./components'),
      '@/features': resolve('./features')
    }
    // Enable Web Workers for heavy calculations
    config.module.rules.push({
      test: /\.worker\.ts$/,
      use: { loader: 'worker-loader' }
    })
    return config
  },
  // For WebSocket connections
  experimental: {
    websocketServerAction: true,
    serverActions: true
  }
}