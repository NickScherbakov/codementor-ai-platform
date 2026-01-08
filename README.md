# CodeMentor AI Platform

[![View Demo](https://img.shields.io/badge/Demo-Live%20Server-blue?logo=github)](http://104.154.27.195/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A full-stack platform for learning programming that combines artificial intelligence with proven educational methodologies. Built on a modern Next.js 14 stack with unified architecture.

> **Note**: The demo server shows full UI functionality. For local development, use `npm run dev` or `docker-compose up`.

---

## 🎯 Two Products — One Platform

CodeMentor AI Platform combines **two different learning approaches** in a single Next.js application:

### 1. 📚 Learning Platform
Friendly, gamified programming education with AI adaptation

- 🎓 Personalized lessons and learning paths
- 🏆 Achievements, XP, and progress tracking
- 🌍 Language support: Python, JavaScript, TypeScript, Java, C++
- 👶 Perfect for beginners
- **Access**: `/dashboard`

### 2. 🔴 Hard Code Review
Brutal, uncompromising code review at Senior Developer level

- 💀 Interview-style technical expertise
- 🐛 Feedback on bugs, security, performance
- 🔐 3 free reviews, then paywall (HTTP 402)
- ⚡ Real backend API with deterministic analysis engine
- **Access**: `/review`

---

## 🚀 Quick Start

### Requirements
- Node.js 18+
- Python 3.9+ (for AI Engine)
- Docker & Docker Compose (recommended)
- MongoDB (or via Docker)
- Redis (or via Docker)

### Option A: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform

# Start all services
docker-compose up -d
```

Platform Access:
| Service | URL | Description |
|---------|-----|-------------|
| 🏠 Home | http://localhost:3000 | Main page |
| 📚 Dashboard | http://localhost:3000/dashboard | Learning platform |
| 🔴 Code Review | http://localhost:3000/review | Hard Code Review |
| 🔌 Backend API | http://localhost:3001 | REST API |
| 🤖 AI Engine | http://localhost:5000 | Python AI service |

### Option B: Local Development

```bash
# Install dependencies
npm install

# Terminal 1 — Next.js Frontend (with Turbopack)
npm run dev

# Terminal 2 — Backend API
npm run backend

# Terminal 3 — AI Engine (optional)
npm run ai-engine

# Or run everything with one command
npm run dev:all
```

---

## 🔴 Hard Code Review

### Features

| Feature | Description |
|---------|-------------|
| ✅ Real Backend | Connection to `/api/backend/review` endpoint |
| ✅ Pattern Detection | Deterministic pattern detection engine |
| ✅ Multi-language | Python, JavaScript, TypeScript |
| ✅ Brutal Feedback | Senior-level technical expertise |
| ✅ Free Tier Gate | 3 free reviews (IP-based), then HTTP 402 |

### Hard Code Review Pages

| Route | Description |
|-------|-------------|
| `/review` | Main code review application |
| `/review/showcase` | Component library demo |
| `/review/money` | Marketing landing page |
| `/review/tone` | Tone and style reference |
| `/review/tokens` | Design system documentation |

### UI Components (14 total)

```
src/app/components/hard-code-review/
├── HardCodeReviewApp.tsx    # Main application component
├── CodeInputPage.tsx        # Code input page
├── ResultsPage.tsx          # Results page
├── CodeComparison.tsx       # Before/after code comparison
├── FindingCard.tsx          # Issue finding card
├── FindingsContainer.tsx    # Findings container
├── SummaryCard.tsx          # Summary card
├── SeverityBadge.tsx        # Severity level badge
├── NextStepsSection.tsx     # Next steps section
├── HCRButton.tsx            # Custom button
├── LoadingStates.tsx        # Loading states
├── ComponentShowcase.tsx    # Component showcase
├── api.ts                   # API client
└── index.ts                 # Exports
```

### API Endpoint

```bash
POST /api/backend/review
Content-Type: application/json

{
  "language": "javascript",
  "code": "function test() { var x = 1; console.log(x); }",
  "mode": "hard"
}
```

**Response**:
```json
{
  "summary": "Hard review: 2 high-signal issues found in JavaScript code.",
  "severity": "hard",
  "findings": [
    {
      "type": "style",
      "title": "Debug logging left in runtime path",
      "explain": "Console output increases noise and can leak data.",
      "fix": "Remove debug statements or use structured logging."
    }
  ],
  "next_steps": [
    "Add tests that cover edge cases and failure paths."
  ]
}
```

---

## 🛠 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.x | Framework (App Router + Turbopack) |
| TypeScript | 5.7 | Type safety |
| Tailwind CSS | 3.x | Styling |
| Radix UI | Latest | Base UI components |
| Zustand | 4.x | State Management |
| Framer Motion | 10.x | Animations |
| Monaco Editor | 0.44 | Code editor |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express | 4.x | HTTP server |
| MongoDB | 8.x | Database |
| Mongoose | 8.x | ODM |
| Socket.io | 4.x | Real-time |
| JWT | 9.x | Authentication |

### AI Engine
| Technology | Purpose |
|------------|---------|
| Python Flask | HTTP server |
| TinyLlama-1.1B | Chat model |
| CodeT5-Small | Code analysis |
| PyTorch | ML Runtime |

### DevOps
| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Orchestration |
| Nginx | Reverse Proxy |
| GitHub Actions | CI/CD |

---

## 📁 Project Structure

```
codementor-ai-platform/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Home page
│   │   ├── layout.tsx              # Root layout
│   │   ├── review/                 # 🔴 Hard Code Review
│   │   │   ├── page.tsx            # Main application
│   │   │   ├── layout.tsx          # Review navigation
│   │   │   ├── showcase/page.tsx   # Component demo
│   │   │   ├── tokens/page.tsx     # Design system
│   │   │   ├── tone/page.tsx       # Tone reference
│   │   │   └── money/page.tsx      # Marketing page
│   │   ├── components/
│   │   │   ├── hard-code-review/   # 14 HCR UI components
│   │   │   └── ui/                 # Shared UI components
│   │   ├── dashboard/              # 📚 Learning platform
│   │   └── playground/             # Code sandbox
│   ├── styles/                     # Global styles
│   └── lib/                        # Utilities
├── backend/                        # Node.js API
│   ├── routes/
│   │   └── review.js               # Review endpoint
│   └── services/
│       └── reviewEngine.js         # Pattern detector
├── ai-engine/                      # Python AI service
│   ├── main.py                     # Flask application
│   └── requirements.txt            # Python dependencies
├── docs/                           # Documentation
├── docker-compose.yml              # Container orchestration
├── next.config.js                  # Next.js configuration
├── tailwind.config.js              # Tailwind configuration
└── tsconfig.json                   # TypeScript configuration
```

---

## 📜 Scripts

```bash
# Development
npm run dev              # Next.js with Turbopack
npm run dev:all          # Frontend + Backend + AI Engine

# Build and run
npm run build            # Production build
npm run start            # Production server

# Testing
npm test                 # Jest tests
npm run lint             # ESLint check
npm run type-check       # TypeScript check

# Docker
npm run docker:build     # Build images
npm run docker:up        # Start containers
npm run docker:down      # Stop containers

# Documentation
npm run docs:serve       # Local documentation server
npm run docs:validate    # Validate documentation
```

---

## 🔒 Environment Variables

```bash
# Copy example
cp .env.example .env
```

**Required**:
```env
MONGODB_URI=mongodb://localhost:27017/codementor-ai
JWT_SECRET=your-super-secure-secret
REDIS_URL=redis://localhost:6379
```

**Optional**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_API_URL=http://localhost:5000
MODEL_CACHE_DIR=/path/to/model/cache
```

---

## 📚 Documentation

| Section | Description |
|---------|-------------|
| [📋 Documentation Index](docs/README.md) | Full documentation hub |
| [🚀 Tutorial](docs/TUTORIAL.md) | Step-by-step guide |
| [💡 Examples](docs/EXAMPLES.md) | Interactive examples |
| [🏛️ Architecture](docs/architecture/README.md) | System overview |
| [📡 API Reference](docs/api/README.md) | API reference |
| [🚀 Deployment](docs/deployment/README.md) | Deployment guide |

### Business Documentation
| Section | Description |
|---------|-------------|
| [💰 Business Strategy](docs/BUSINESS_STRATEGY.md) | Monetization plan |
| [💳 Pricing Configuration](docs/PRICING_CONFIG.md) | Pricing tiers |
| [🔒 Compliance](docs/COMPLIANCE_ROADMAP.md) | SOC2, FERPA, GDPR |

---

## 🧪 Testing

```bash
# Frontend tests (Jest + React Testing Library)
npm test

# Backend tests
cd backend && npm test

# AI Engine tests
cd ai-engine && pytest

# Run all tests in watch mode
npm run test:watch
```

---

## 🤝 Contributing

We welcome contributors! See [Contributing Guide](CONTRIBUTING.md).

### Quick Start for Contributors

```bash
# 1. Fork the repository
# 2. Clone
git clone https://github.com/YOUR_USERNAME/codementor-ai-platform.git

# 3. Create a branch
git checkout -b feature/amazing-feature

# 4. Make changes and commit
git commit -m "✨ Add amazing feature"

# 5. Push and create PR
git push origin feature/amazing-feature
```

---

## 📝 License

MIT License — see [LICENSE](LICENSE) file.

---

## 🆘 Support

- **📖 Documentation**: [docs/README.md](docs/README.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/NickScherbakov/codementor-ai-platform/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/NickScherbakov/codementor-ai-platform/discussions)

---

## 🔄 Recent Updates

### v1.0.0 (January 2026)
- ✅ Full migration to Next.js 14 (App Router)
- ✅ Hard Code Review integration into unified platform
- ✅ Vite removal, build unification
- ✅ 14 new UI components for Code Review
- ✅ Transition to real API backend
- ✅ Improved project structure

---

**Built with ❤️ by the CodeMentor AI Team**

*Empowering the next generation of developers through intelligent, adaptive learning.*