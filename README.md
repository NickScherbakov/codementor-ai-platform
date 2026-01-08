# CodeMentor AI Platform

[![View Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue?logo=github)](http://104.154.27.195/)

A full-stack application that combines artificial intelligence with proven educational methods to create the most effective programming learning platform. Built with cutting-edge technologies and designed for scalability.

> **Note**: The GitHub Pages demo shows the UI only. For full functionality (AI tutoring, code execution, real-time features), deploy locally with `docker-compose up`. See [GitHub Pages Configuration](.github/GITHUB_PAGES.md) for details.

---

## 🎯 Two Products in One Repository

This repository contains **two distinct applications**:

### 1. 📚 CodeMentor AI - Learning Platform (Next.js)
Intelligent Programming Learning Platform with AI-powered personalized tutoring
- **Main Platform**: Full-stack Next.js application
- **Run with**: `npm run dev` (Next.js)
- **See below** for complete documentation

### 2. 🔴 Hard Code Review - UI System (Vite)
Brutal, senior-level code review platform - UI components and design system
- **Standalone UI**: Built with Vite + React + Tailwind v4
- **Run with**: `npm run dev:vite`
- **Documentation**: See [Hard Code Review README](README_HARD_CODE_REVIEW.md)
- **Components**: 10+ production-ready components in `src/app/components/hard-code-review/`

---

## 🔴 Quick Start: Hard Code Review UI

```bash
# Install dependencies
npm install

# Start Vite dev server for Hard Code Review UI
npm run dev:vite
```

Open http://localhost:5173 and:
1. Navigate to **"App"** tab to try the code review
2. Click **"Try Sample Code Snippets"** to load examples
3. Submit and see brutal feedback in action

**For complete Hard Code Review documentation**: [README_HARD_CODE_REVIEW.md](README_HARD_CODE_REVIEW.md)

---

## 📚 CodeMentor AI - Learning Platform

### 🧭 MVP Focus: Hard Code Review

The current MVP is a focused, monetizable experience centered on **hard code review**. Everything outside this narrow scope is deferred.

**In scope**
- `/review` page for submitting code and receiving hard review feedback.
- `POST /api/review` endpoint with a deterministic reviewer (no external API keys required).
- Free-tier gate: 3 reviews per user, then HTTP 402 with a "Subscribe to continue" message.

**Out of scope**
- Courses, gamification, leaderboards, or social features.
- Multi-step onboarding, learning paths, or analytics dashboards.
- Billing integrations (Stripe) or payments.

### Design / Positioning Reference
- [Money Page reference (marketing-only)](docs/concepts/money-page-reference.md)

## ⚡ MVP Quickstart (Hard Code Review)

### Option A: Docker (Recommended)
```bash
docker-compose up -d
```

Open the app at **http://localhost:3000/review**.

### Option B: Local Dev (Frontend + Backend)
```bash
# Terminal 1 - Frontend
npm install
npm run dev

# Terminal 2 - Backend
cd backend && npm install && npm run dev
```

Set the API base for local dev (so the frontend targets the backend directly):
```bash
export NEXT_PUBLIC_API_BASE=http://localhost:3001/api
```

## 🚀 Features

### 🤖 AI-Powered Learning
- **Adaptive AI Tutors**: Personalized guidance that adapts to your learning style
- **Dynamic Challenge Generation**: AI creates unique coding challenges based on your progress
- **Intelligent Code Analysis**: Real-time feedback on code quality, performance, and best practices
- **Smart Learning Path Recommendations**: ML-driven curriculum that evolves with you

### 💻 Interactive Development Environment
- **Advanced Code Editor**: Monaco Editor with IntelliSense and syntax highlighting
- **Multi-Language Support**: Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more
- **Real-time Code Execution**: Secure sandbox environment for testing code
- **Collaborative Coding**: Pair programming with real-time synchronization

### 🎮 Gamified Learning Experience
- **Achievement System**: Unlock badges and trophies as you progress
- **XP and Leveling**: Gain experience points and level up your skills
- **Leaderboards**: Compete with peers and track your ranking
- **Streak Tracking**: Maintain daily coding streaks for bonus rewards

### 🏗 Enterprise-Grade Architecture
- **Microservices**: Scalable backend with Node.js and Python services
- **Real-time Communication**: WebSocket support for live collaboration
- **Advanced Caching**: Redis for optimal performance
- **Monitoring & Analytics**: Comprehensive tracking with Prometheus and Grafana

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 14+ (App Router) + Vite (Hard Code Review UI)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3 & v4
- **UI Components**: Custom components with Framer Motion
- **State Management**: Zustand
- **Code Editor**: Monaco Editor

### Backend
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **Real-time**: Socket.io
- **API Documentation**: Swagger/OpenAPI

### AI Engine
- **Framework**: Python Flask
- **AI/ML**: Custom ML Models (TinyLlama, CodeT5), TensorFlow, scikit-learn
- **Local Models**: No external API dependencies
- **NLP**: Custom language processing for code analysis
- **Recommendation Engine**: Collaborative filtering algorithms

### DevOps & Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Monitoring**: Prometheus + Grafana
- **Code Execution**: Judge0 sandbox
- **Caching**: Redis
- **CI/CD**: GitHub Actions (configured)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Python 3.9+
- Docker & Docker Compose
- MongoDB (or use Docker)
- Redis (or use Docker)

**📋 For complete system requirements, see [SYSTEM_REQUIREMENTS.md](SYSTEM_REQUIREMENTS.md)**

### 1. Clone and Setup
```bash
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install AI engine dependencies
cd ai-engine && pip install -r requirements.txt && cd ..

# Download ML models (first time only)
cd ai-engine && python init_models.py && cd ..
```

### 2. Environment Configuration

**⚠️ Important**: You need to configure environment variables before running the application.

```bash
# Copy the example environment file
cp .env.example .env
```

**Required Environment Variables:**
- `MONGODB_URI`: MongoDB connection string (or use Docker)
- `JWT_SECRET`: Generate a secure random string
- `REDIS_URL`: Redis connection URL (or use Docker)

**Optional:**
- `OPENAI_API_KEY`: No longer required! Using custom ML models

**Example .env setup:**
```bash
# No OpenAI API key needed anymore!

# Database (use Docker or local MongoDB)
MONGODB_URI=mongodb://localhost:27017/codementor-ai

# Security
JWT_SECRET=your-super-secure-jwt-secret-here

# Cache (use Docker or local Redis)
REDIS_URL=redis://localhost:6379

# Development URLs
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_API_URL=http://localhost:5000
```

💡 **Tip**: See `.env.example` for all available configuration options.

### 3. Start with Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### 4. Manual Development Setup
```bash
# Terminal 1 - Frontend (Next.js)
npm run dev

# OR - Frontend (Vite - Hard Code Review UI)
npm run dev:vite

# Terminal 2 - Backend
npm run backend

# Terminal 3 - AI Engine
npm run ai-engine

# Terminal 4 - Database (if not using Docker)
mongod
redis-server
```

### 5. Access the Applications
- **Next.js Frontend**: http://localhost:3000
- **Vite Frontend (Hard Code Review)**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **AI Engine**: http://localhost:5000
- **Monitoring**: http://localhost:3002 (Grafana)

## 📚 Documentation

### 📖 **Complete Documentation Hub**
- **[📋 Documentation Index](docs/README.md)** - Complete documentation overview and navigation
- **[🚀 Quick Start Tutorial](docs/TUTORIAL.md)** - Step-by-step getting started guide
- **[💡 Examples & Demos](docs/EXAMPLES.md)** - Interactive examples and real-world use cases
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project
- **[🔴 Hard Code Review UI](README_HARD_CODE_REVIEW.md)** - Complete UI system documentation

### 💼 **Business Strategy & Monetization**
- **[💰 Business Strategy](docs/BUSINESS_STRATEGY.md)** - Comprehensive monetization plan and revenue models
- **[💳 Pricing Configuration](docs/PRICING_CONFIG.md)** - Pricing tiers, billing infrastructure, and payment methods
- **[🔒 Compliance Roadmap](docs/COMPLIANCE_ROADMAP.md)** - SOC2, FERPA, GDPR certification plans
- **[🌍 Market Expansion](docs/MARKET_EXPANSION.md)** - Geographic expansion strategy (EN/ES/BR)
- **[🚀 Implementation Priorities](docs/IMPLEMENTATION_PRIORITIES.md)** - 30/60/90-day action plan

### 🏗️ **Architecture & Design**
- **[🏛️ System Architecture](docs/architecture/README.md)** - High-level system overview and design principles
- **[🔄 Service Interactions](docs/architecture/service-interaction.md)** - Microservices communication patterns
- **[📊 Data Flow Diagrams](docs/architecture/data-flow.md)** - Request/response flows and data processing
- **[🗄️ Database Schema](docs/architecture/database-schema.md)** - Data models and relationships

## 🏗 Project Structure

```
codementor-ai-platform/
├── src/                    # Frontend source code (Next.js + Vite)
│   ├── app/               # Next.js app directory
│   │   └── components/
│   │       └── hard-code-review/  # Hard Code Review UI components (14 files)
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── store/            # State management
│   ├── styles/           # CSS and Tailwind config
│   └── types/            # TypeScript definitions
├── backend/               # Node.js backend
├── ai-engine/            # Python AI service
├── docs/                 # 📚 Comprehensive Documentation
├── index.html            # Vite entry point
├── vite.config.ts        # Vite configuration
├── README_HARD_CODE_REVIEW.md  # Hard Code Review docs
└── docker-compose.yml    # Container orchestration
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

**📋 [View Complete Contributing Guide →](CONTRIBUTING.md)**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: See [docs/README.md](docs/README.md) for comprehensive guides
- **Hard Code Review**: See [README_HARD_CODE_REVIEW.md](README_HARD_CODE_REVIEW.md)
- **Issues**: [GitHub Issues](https://github.com/NickScherbakov/codementor-ai-platform/issues)
- **Contributing**: [Contributing Guide](CONTRIBUTING.md)

---

**Built with ❤️ by the CodeMentor AI Team**

*Empowering the next generation of developers through intelligent, adaptive learning.*
