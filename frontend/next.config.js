/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['monaco-editor'],
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://backend:8080/api/:path*',
      },
      {
        source: '/api/ai-console/:path*',
        destination: 'http://backend:8080/api/ai-console/:path*',
      },
      {
        source: '/ai-tutor/:path*',
        destination: 'http://ai-engine:8080/:path*',
      },
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig
