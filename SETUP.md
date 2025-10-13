# CodeMentor AI - Setup Instructions

## Prerequisites Installation

### 1. Install Node.js and npm
Download and install Node.js (v18+) from: https://nodejs.org/
- This will also install npm automatically
- Verify installation: `node --version` and `npm --version`

### 2. Install Python
Download and install Python (v3.9+) from: https://python.org/
- Make sure to check "Add Python to PATH" during installation
- Verify installation: `python --version` and `pip --version`

### 3. Install Git
Download and install Git from: https://git-scm.com/
- Verify installation: `git --version`

## Project Setup

### 1. Install Frontend Dependencies
```bash
npm install
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

### 3. Install AI Engine Dependencies
```bash
cd ai-engine
pip install -r requirements.txt
cd ..
```

### 4. Environment Configuration
Create the following environment files:

**Root .env:**
```env
NODE_ENV=development
NEXTAUTH_SECRET=your-secret-key
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_ENGINE_URL=http://localhost:5000
```

**backend/.env:**
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/codementor-ai
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key
OPENAI_API_KEY=your-openai-api-key
FRONTEND_URL=http://localhost:3000
```

**ai-engine/.env:**
```env
FLASK_ENV=development
PORT=5000
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=mongodb://localhost:27017/codementor-ai
```

## Database Setup

### MongoDB (Recommended: Use Docker)
```bash
# Option 1: Docker (Recommended)
docker run --name mongodb -d -p 27017:27017 mongo:7.0

# Option 2: Install MongoDB locally
# Follow instructions at: https://docs.mongodb.com/manual/installation/
```

### Redis (Recommended: Use Docker)
```bash
# Option 1: Docker (Recommended)
docker run --name redis -d -p 6379:6379 redis:7.2-alpine

# Option 2: Install Redis locally
# Windows: https://github.com/microsoftarchive/redis/releases
# macOS: brew install redis
# Linux: sudo apt-get install redis-server
```

## Development Commands

### Start All Services (Recommended)
```bash
npm run dev:all
```

### Start Services Individually
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run backend

# Terminal 3 - AI Engine
npm run ai-engine
```

### Using Docker (Production-like)
```bash
# Build and start all services
docker-compose up --build

# Start in background
docker-compose up -d

# Stop all services
docker-compose down
```

## Verification

Once all services are running, verify:

1. **Frontend**: http://localhost:3000
2. **Backend API**: http://localhost:3001/health
3. **AI Engine**: http://localhost:5000/health
4. **MongoDB**: Connect using MongoDB Compass to `mongodb://localhost:27017`
5. **Redis**: Test connection using Redis CLI: `redis-cli ping`

## Development Tools

### VS Code Extensions (Auto-installed)
- TypeScript and JavaScript Language Features
- Python
- ESLint
- Prettier Code Formatter
- Tailwind CSS IntelliSense
- Docker
- MongoDB for VS Code

### Recommended Additional Tools
- MongoDB Compass (Database GUI)
- Postman (API Testing)
- Redis Insight (Redis GUI)

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 3001, 5000, 27017, 6379 are available
2. **Permission errors**: Run as administrator if needed (Windows)
3. **Python modules not found**: Make sure Python is in PATH and pip install ran successfully
4. **MongoDB connection failed**: Ensure MongoDB service is running
5. **Redis connection failed**: Ensure Redis service is running

### Getting Help
- Check the logs for detailed error messages
- Refer to the README.md for detailed documentation
- Open an issue on the GitHub repository

## Quick Development Start (After Setup)

```bash
# 1. Start databases (if using Docker)
docker run -d --name mongodb -p 27017:27017 mongo:7.0
docker run -d --name redis -p 6379:6379 redis:7.2-alpine

# 2. Start all development servers
npm run dev:all

# 3. Open browser to http://localhost:3000
```

Enjoy building with CodeMentor AI! 🚀