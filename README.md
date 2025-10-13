# CodeMentor AI - Intelligent Programming Learning Platform

![CodeMentor AI Logo](./public/logo.png)

A revolutionary full-stack application that combines artificial intelligence with proven educational methods to create the most effective programming learning platform. Built with cutting-edge technologies and designed for scalability.

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
- **AI/ML**: OpenAI GPT, TensorFlow, scikit-learn
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

### 1. Clone and Setup
```bash
git clone https://github.com/codementor-ai/platform.git
cd platform

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install AI engine dependencies
cd ai-engine && pip install -r requirements.txt && cd ..
```

### 2. Environment Configuration
```bash
# Create .env files
cp .env.example .env
cp backend/.env.example backend/.env
cp ai-engine/.env.example ai-engine/.env

# Configure your environment variables
# - MongoDB connection string
# - OpenAI API key
# - JWT secrets
# - Redis URL
```

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

## 📚 API Documentation

### Authentication Endpoints
```typescript
POST /api/auth/register     // User registration
POST /api/auth/login        // User login
POST /api/auth/refresh      // Refresh JWT token
POST /api/auth/logout       // User logout
```

### Learning Endpoints
```typescript
GET  /api/challenges        // Get coding challenges
POST /api/challenges/generate // Generate adaptive challenge
POST /api/submissions       // Submit solution
GET  /api/progress         // Get learning progress
GET  /api/achievements     // Get user achievements
```

### AI Tutor Endpoints
```typescript
POST /ai-tutor/chat        // Chat with AI tutor
POST /code/analyze         // Analyze code quality
POST /learning-path/recommend // Get learning recommendations
```

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
├── public/               # Static assets
├── docs/                 # Documentation
├── tests/                # Test suites
└── docker-compose.yml    # Container orchestration
```

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

## 📈 Performance Monitoring

The platform includes comprehensive monitoring:

- **Application Metrics**: Response times, error rates, throughput
- **User Analytics**: Learning progress, engagement metrics
- **Infrastructure Monitoring**: CPU, memory, database performance
- **Custom Dashboards**: Real-time visualization of key metrics

Access Grafana at `http://localhost:3002` (admin/admin123)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- **Frontend**: ESLint + Prettier
- **Backend**: ESLint + Prettier  
- **Python**: Black + Flake8
- **Commits**: Conventional Commits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.codementor-ai.com](https://docs.codementor-ai.com)
- **Community Forum**: [community.codementor-ai.com](https://community.codementor-ai.com)
- **Issues**: [GitHub Issues](https://github.com/codementor-ai/platform/issues)
- **Email**: support@codementor-ai.com

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