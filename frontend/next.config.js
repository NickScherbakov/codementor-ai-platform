/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['monaco-editor'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }
    return config
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://backend:3001/api/:path*',
      },
      {
        source: '/ai-tutor/:path*',
        destination: 'http://ai-engine:5000/:path*',
      },
    ]
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
