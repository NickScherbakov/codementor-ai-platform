/** @type {import('next').NextConfig} */
const repoName = 'codementor-ai-platform'
const isGithubPages = process.env.GITHUB_PAGES === 'true'
const skipRewrites = process.env.SKIP_REWRITES === 'true'

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['monaco-editor'],
  },
  // Enable static export for GitHub Pages demo
  output: 'export',
  webpack: (config, { isServer }) => {
    // Handle Monaco Editor
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    // Handle WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    }

    return config
  },
  async rewrites() {
    // Rewrites are not supported in static export mode
    // They are disabled when SKIP_REWRITES=true (GitHub Pages deployment)
    if (skipRewrites) return []
    return [
      {
        source: '/api/backend/:path*',
        destination: 'http://localhost:3001/api/:path*', // Backend Node.js API
      },
      {
        source: '/ai-tutor/:path*',
        destination: 'http://localhost:5000/:path*', // Python Flask AI Engine
      },
    ]
  },
  images: {
    // For static export on GitHub Pages, disable Next Image optimization
    unoptimized: true,
    domains: ['localhost', 'res.cloudinary.com'],
  },
  trailingSlash: true,
  // Prefix assets/links when published under project pages
  assetPrefix: isGithubPages ? `/${repoName}` : undefined,
  basePath: isGithubPages ? `/${repoName}` : undefined,
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
    MONGODB_URI: process.env.MONGODB_URI,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET,
  },
}

module.exports = nextConfig