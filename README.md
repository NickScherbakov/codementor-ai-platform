# CodeMentor AI - Intelligent Programming Learning Platform

[![View Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue?logo=github)](http:/104.154.27.195/)

A full-stack application that combines artificial intelligence with proven educational methods to create the most effective programming learning platform. Built with cutting-edge technologies and designed for scalability.

> **Note**: The GitHub Pages demo shows the UI only. For full functionality (AI tutoring, code execution, real-time features), deploy locally with `docker-compose up`. See [GitHub Pages Configuration](.github/GITHUB_PAGES.md) for details.

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
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
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
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend

# Terminal 3 - AI Engine
npm run ai-engine

# Terminal 4 - Database (if not using Docker)
mongod
redis-server
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **AI Engine**: http://localhost:5000
- **Monitoring**: http://localhost:3002 (Grafana)

## 📚 Documentation

### 📖 **Complete Documentation Hub**
- **[📋 Documentation Index](docs/README.md)** - Complete documentation overview and navigation
- **[🚀 Quick Start Tutorial](docs/TUTORIAL.md)** - Step-by-step getting started guide
- **[💡 Examples & Demos](docs/EXAMPLES.md)** - Interactive examples and real-world use cases
- **[🤝 Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

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

### 🔌 **API Reference**
- **[📡 Complete API Guide](docs/api/README.md)** - Comprehensive API documentation with examples
- **[⚡ OpenAPI Specification](docs/api/openapi.yaml)** - Machine-readable API specification
- **[🧪 API Examples](docs/api/examples/README.md)** - Code examples for all endpoints

### 🚀 **Deployment & Operations**
- **[🐳 Deployment Guide](docs/deployment/README.md)** - Production deployment instructions
- **[☸️ Kubernetes Setup](docs/deployment/kubernetes.md)** - Enterprise Kubernetes deployment
- **[🔧 Troubleshooting](docs/deployment/troubleshooting.md)** - Common issues and solutions
- **[📊 Performance Metrics](docs/performance/README.md)** - Benchmarks and optimization guides

### 🚀 Quick API Reference
```typescript
POST /api/auth/register     // User registration
POST /api/auth/login        // User login
POST /api/auth/refresh      // Refresh JWT token
POST /api/auth/logout       // User logout
```

```typescript
GET  /api/challenges        // Get coding challenges
POST /api/challenges/generate // Generate adaptive challenge
POST /api/submissions       // Submit solution
GET  /api/progress         // Get learning progress
GET  /api/achievements     // Get user achievements
```

```typescript
POST /ai-tutor/chat        // Chat with AI tutor
POST /code/analyze         // Analyze code quality
POST /learning-path/recommend // Get learning recommendations
```

**📋 [View Complete API Documentation →](docs/api/README.md)**

## 🏗 Project Structure

```
codementor-ai/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── store/            # State management
│   └── types/            # TypeScript definitions
├── backend/               # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
├── ai-engine/            # Python AI service
│   ├── models/           # ML models
│   ├── services/         # AI services
│   └── utils/            # Helper functions
├── docs/                 # 📚 Comprehensive Documentation
│   ├── api/              # API documentation & Swagger UI
│   ├── architecture/     # System architecture diagrams
│   ├── deployment/       # Production deployment guides
│   ├── performance/      # Benchmarks & optimization
│   ├── EXAMPLES.md       # Code examples & demos
│   └── TUTORIAL.md       # Getting started guide
├── public/               # Static assets
├── tests/                # Test suites
└── docker-compose.yml    # Container orchestration
```

**🔍 [Explore Architecture Diagrams →](docs/architecture/README.md)**

## 🧪 Testing

```bash
# Frontend tests
npm test
npm run test:e2e

# Backend tests
cd backend && npm test

# AI engine tests
cd ai-engine && pytest
```

## 📈 Performance & Monitoring

The platform includes enterprise-grade monitoring and performance optimization:

- **📊 [Performance Benchmarks](docs/performance/benchmarks.md)**: Detailed performance metrics and load testing results
- **🎯 Response Time Targets**: < 200ms API responses, < 2s AI responses
- **📈 Throughput**: 1000+ RPS frontend, 500+ RPS backend, 50+ RPS AI engine
- **🔍 Real-time Monitoring**: Prometheus + Grafana dashboards
- **⚡ Auto-scaling**: Kubernetes HPA for dynamic scaling

**Performance Highlights:**
- API P95 Response Time: 156ms
- AI Tutor P95 Response Time: 3.2s  
- Database Query P95: 78ms
- 99.94% Uptime SLA

Access Grafana at `http://localhost:3002` (admin/admin123)

**📋 [View Complete Performance Documentation →](docs/performance/README.md)**

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### 📚 Documentation Contributions
- **API Documentation**: Update OpenAPI specs and examples
- **Architecture Diagrams**: Improve system visualization with Mermaid
- **Performance Benchmarks**: Add new test scenarios and metrics
- **Deployment Guides**: Enhance production setup instructions

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests and update documentation
5. Submit a pull request

### Code Standards
- **Frontend**: ESLint + Prettier
- **Backend**: ESLint + Prettier  
- **Python**: Black + Flake8
- **Commits**: Conventional Commits
- **Documentation**: Markdown with Mermaid diagrams

**📋 [View Complete Contributing Guide →](CONTRIBUTING.md)**

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

### Environment Variables
- **Never commit** `.env` files to version control
- **Use strong secrets** for JWT_SECRET and other sensitive values
- **Rotate API keys** regularly in production
- **Use environment-specific** configurations for different deployments

### Development Security
- All API keys are loaded from environment variables
- No hardcoded secrets in the codebase
- Rate limiting enabled on API endpoints
- Input validation on all user inputs

### Reporting Security Issues
If you discover a security vulnerability, please email security@codementor-ai.com instead of using the public issue tracker.

## 🆘 Support

- **Documentation**: See [docs/README.md](docs/README.md) for comprehensive guides
- **Issues**: [GitHub Issues](https://github.com/NickScherbakov/codementor-ai-platform/issues)
- **Contributing**: [Contributing Guide](CONTRIBUTING.md)

## 🌟 Roadmap

### Phase 1 (Current)
- [x] Core learning platform
- [x] AI-powered tutoring
- [x] Code execution sandbox
- [x] Basic gamification

### Phase 2 (Next)
- [ ] Mobile applications (React Native)
- [ ] Advanced ML recommendations
- [ ] Corporate training modules
- [ ] Integration with popular IDEs

### Phase 3 (Future)
- [ ] VR/AR coding environments
- [ ] Blockchain-based certificates
- [ ] Advanced collaboration tools
- [ ] Multi-tenant enterprise features

---

**Built with ❤️ by the CodeMentor AI Team**

*Empowering the next generation of developers through intelligent, adaptive learning.*
