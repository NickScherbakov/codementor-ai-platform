/** @type {import('next').NextConfig} */
const backendServiceUrl =
  process.env.INTERNAL_BACKEND_URL ||
  process.env.BACKEND_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.BACKEND_URL ||
  'http://localhost:3001'

const aiEngineServiceUrl =
  process.env.INTERNAL_AI_ENGINE_URL ||
  process.env.NEXT_PUBLIC_AI_API_URL ||
  process.env.PYTHON_AI_ENGINE_URL ||
  process.env.AI_ENGINE_URL ||
  'http://localhost:5000'

const nextConfig = {
  output: 'standalone',
  serverExternalPackages: ['monaco-editor'],
  turbopack: {},
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: `${backendServiceUrl}/api/:path*`,
      },
      {
        source: '/api/ai-console/:path*',
        destination: `${backendServiceUrl}/api/ai-console/:path*`,
      },
      {
        source: '/ai-tutor/:path*',
        destination: `${aiEngineServiceUrl}/:path*`,
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
}

module.exports = nextConfig
