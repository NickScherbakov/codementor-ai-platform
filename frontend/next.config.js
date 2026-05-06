/** @type {import('next').NextConfig} */
const allowLocalServiceFallbacks = process.env.ALLOW_LOCAL_SERVICE_FALLBACKS !== 'false'

function resolveServiceUrl(name, candidates, fallback) {
  const configured = candidates.find(Boolean)
  if (configured) {
    return configured
  }

  if (allowLocalServiceFallbacks) {
    return fallback
  }

  throw new Error(`${name} must be configured when local service fallbacks are disabled.`)
}

const backendServiceUrl = resolveServiceUrl(
  'Backend service URL',
  [
    process.env.INTERNAL_BACKEND_URL,
    process.env.BACKEND_API_URL,
    process.env.NEXT_PUBLIC_API_URL,
    process.env.NEXT_PUBLIC_API_BASE_URL,
    process.env.BACKEND_URL,
  ],
  'http://localhost:3001'
)

const aiEngineServiceUrl = resolveServiceUrl(
  'AI engine service URL',
  [
    process.env.INTERNAL_AI_ENGINE_URL,
    process.env.NEXT_PUBLIC_AI_API_URL,
    process.env.PYTHON_AI_ENGINE_URL,
    process.env.AI_ENGINE_URL,
  ],
  'http://localhost:5000'
)

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
