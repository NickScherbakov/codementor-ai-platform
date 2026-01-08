# CodeMentor AI Platform

[![View Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue?logo=github)](http://104.154.27.195/)

A full-stack application that combines artificial intelligence with proven educational methods to create the most effective programming learning platform. Built with cutting-edge technologies and designed for scalability.

> **Note**: The GitHub Pages demo shows the UI only. For full functionality (AI tutoring, code execution, real-time features), deploy locally with `docker-compose up`. See [GitHub Pages Configuration](.github/GITHUB_PAGES.md) for details.

---

## 🎯 Two Products, One Platform

CodeMentor AI Platform combines **two distinct learning approaches** in a single Next.js application:

### 1. 📚 Learning Platform
Gentle, gamified programming education with AI-powered adaptive learning
- Personalized tutoring and learning paths
- Achievements, XP, and progress tracking
- Multi-language support (Python, JavaScript, TypeScript, Java, C++)
- Perfect for beginners building foundational skills
- **Access**: `/dashboard` route

### 2. 🔴 Hard Code Review
Brutal, senior-level code review with no sugar-coating
- Interview-style technical judgment
- Production-ready feedback on bugs, security, performance
- 3 free reviews, then paywall (HTTP 402)
- Real backend API with deterministic review engine
- **Access**: `/review` route

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose (recommended)
- MongoDB (or use Docker)
- Redis (or use Docker)

### Option A: Docker (Recommended)

```bash
docker-compose up -d
```

Access the platform:
- **Learning Platform**: http://localhost:3000/
- **Hard Code Review**: http://localhost:3000/review
- **Backend API**: http://localhost:3001
- **AI Engine**: http://localhost:5000

### Option B: Local Development

```bash
# Install dependencies
npm install

# Terminal 1 - Next.js Frontend
npm run dev

# Terminal 2 - Backend API
npm run backend

# Terminal 3 - AI Engine (optional)
npm run ai-engine
```

---

## 🎭 Hard Code Review

### Features

✅ **Real Backend Integration**
- Connects to `/api/backend/review` endpoint
- Deterministic pattern detection engine
- Supports Python, JavaScript, TypeScript

✅ **Brutal Feedback**
- No tutorials, no hand-holding
- Senior-level technical judgment
- Production-ready severity scoring

✅ **Free Tier Gate**
- 3 free reviews per user (IP-based)
- HTTP 402 after limit
- "Subscribe to continue" message

### Pages

- `/review` - Main code review application
- `/review/showcase` - Component library demo
- `/review/money` - Marketing landing page
- `/review/tone` - Voice & tone reference
- `/review/tokens` - Design system documentation

### API Endpoint

```bash
POST /api/backend/review
Content-Type: application/json

{
  "language": "javascript",
  "code": "function test() { var x = 1; }",
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

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **UI Components**: Custom + Radix UI
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Code Editor**: Monaco Editor

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **API Documentation**: Swagger/OpenAPI

### AI Engine
- **Framework**: Python Flask
- **AI/ML**: Custom ML Models (TinyLlama, CodeT5)
- **Local Models**: No external API dependencies
- **Review Engine**: Deterministic pattern detection

### DevOps
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana
- **CI/CD**: GitHub Actions

---

## 📁 Project Structure

```
codementor-ai-platform/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx               # Homepage
│   │   ├── layout.tsx             # Root layout
│   │   ├── review/                # Hard Code Review section
│   │   │   ├── page.tsx           # Main review app
│   │   │   ├── layout.tsx         # Review nav
│   │   │   ├── showcase/page.tsx  # Components demo
│   │   │   ├── tokens/page.tsx    # Design system
│   │   │   ├── tone/page.tsx      # Tone reference
│   │   │   └── money/page.tsx     # Marketing page
│   │   ├── components/
│   │   │   ├── hard-code-review/  # 14 UI components
│   │   │   └── ui/                # Shared UI
│   │   ├── dashboard/             # Learning platform
│   │   └── playground/            # Code editor
│   ├── styles/                   # Global styles
│   └── lib/                      # Utilities
├── backend/                     # Node.js API
│   ├── routes/
│   │   └── review.js             # Review endpoint
│   └── services/
│       └── reviewEngine.js       # Pattern detector
├── ai-engine/                   # Python AI service
├── docs/                        # Documentation
└── docker-compose.yml           # Container orchestration
```

---

## 📚 Documentation

- **[📋 Documentation Index](docs/README.md)** - Complete documentation hub
- **[🚀 Quick Start Tutorial](docs/TUTORIAL.md)** - Step-by-step guide
- **[💡 Examples & Demos](docs/EXAMPLES.md)** - Interactive examples
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute

### Business Strategy
- **[💰 Business Strategy](docs/BUSINESS_STRATEGY.md)** - Monetization plan
- **[💳 Pricing Configuration](docs/PRICING_CONFIG.md)** - Pricing tiers
- **[🔒 Compliance Roadmap](docs/COMPLIANCE_ROADMAP.md)** - SOC2, FERPA, GDPR

### Architecture
- **[🏛️ System Architecture](docs/architecture/README.md)** - System overview
- **[🔄 Service Interactions](docs/architecture/service-interaction.md)** - Microservices
- **[📊 Data Flow Diagrams](docs/architecture/data-flow.md)** - Request flows

### API Reference
- **[📡 Complete API Guide](docs/api/README.md)** - All endpoints
- **[⚡ OpenAPI Specification](docs/api/openapi.yaml)** - Machine-readable spec

---

## 🧪 Testing

```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# AI engine tests
cd ai-engine && pytest
```

---

## 🔒 Environment Variables

```bash
# Copy example
cp .env.example .env
```

**Required**:
```
MONGODB_URI=mongodb://localhost:27017/codementor-ai
JWT_SECRET=your-super-secure-secret
REDIS_URL=redis://localhost:6379
```

**Optional**:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_API_URL=http://localhost:5000
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md).

---

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🆘 Support

- **Documentation**: [docs/README.md](docs/README.md)
- **Issues**: [GitHub Issues](https://github.com/NickScherbakov/codementor-ai-platform/issues)
- **Contributing**: [Contributing Guide](CONTRIBUTING.md)

---

**Built with ❤️ by the CodeMentor AI Team**

*Empowering the next generation of developers through intelligent, adaptive learning.*
