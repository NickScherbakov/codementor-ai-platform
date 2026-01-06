# 🤖 AI Agents Instructions

> **Last Updated**: January 6, 2026

This document provides comprehensive guidelines for AI coding agents (Google Jules, GitHub Copilot Agent, and others) working with the CodeMentor AI codebase.

## 📋 Project Overview

### Project: CodeMentor AI
An AI-powered programming education platform with:
- **Frontend**: Next.js 14+ (TypeScript, Tailwind CSS, Zustand)
- **Backend**: Node.js/Express (MongoDB, JWT, Socket.io)
- **AI Engine**: Python Flask (TinyLlama, CodeT5, local ML models)
- **Infrastructure**: Docker Compose, Nginx, Prometheus/Grafana

### Key Technologies
- **Frontend Framework**: Next.js 14+ with App Router
- **UI Styling**: Tailwind CSS with custom components
- **State Management**: Zustand for client-side state
- **Code Editor**: Monaco Editor with IntelliSense
- **Backend Runtime**: Node.js 18+ with Express
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis for sessions and performance
- **Real-time**: Socket.io for WebSocket connections
- **ML Framework**: TensorFlow, PyTorch, Transformers
- **Containerization**: Docker and Docker Compose
- **Monitoring**: Prometheus and Grafana

## 📁 Repository Structure

```
codementor-ai-platform/
├── src/                    # Frontend source (Next.js App Router)
│   ├── app/               # Next.js pages and layouts
│   ├── components/        # React components
│   ├── store/            # Zustand state management
│   └── types/            # TypeScript type definitions
├── backend/               # Node.js/Express API server
│   ├── middleware/       # Express middleware (auth, validation, etc.)
│   ├── models/           # MongoDB/Mongoose models
│   ├── routes/           # API route handlers
│   └── server.js         # Main server entry point
├── ai-engine/            # Python Flask ML service
│   ├── models.py         # ML model definitions
│   ├── main.py           # Flask application entry
│   ├── init_models.py    # Model initialization script
│   └── requirements.txt  # Python dependencies
├── docs/                 # Comprehensive documentation
│   ├── api/              # API documentation and OpenAPI specs
│   ├── architecture/     # System architecture diagrams
│   ├── deployment/       # Deployment guides
│   └── performance/      # Performance benchmarks
├── monitoring/           # Prometheus/Grafana configurations
├── public/               # Static assets (images, fonts)
├── scripts/              # Utility scripts for development
└── docker-compose.yml    # Multi-container orchestration
```

### Key Files
- `package.json` - Frontend dependencies and npm scripts
- `backend/package.json` - Backend dependencies and scripts
- `ai-engine/requirements.txt` - Python dependencies
- `.env.example` - Environment variable templates
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `docker-compose.yml` - Docker service definitions

## 📝 Code Standards

### TypeScript/JavaScript (Frontend & Backend)

#### Style Guidelines
- Use ESLint + Prettier configuration from repo
- Prefer functional components with hooks (no class components)
- Use TypeScript strict mode (`strict: true`)
- Follow conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`
- Use meaningful variable and function names
- Avoid `any` type - use proper TypeScript types
- Keep functions small and focused (< 50 lines preferred)

#### Import Organization
```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import axios from 'axios';
import { motion } from 'framer-motion';

// 3. Internal components
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// 4. Types and utilities
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
```

#### React Component Structure
```typescript
// Prefer this pattern:
export function ComponentName({ prop1, prop2 }: ComponentProps) {
  const [state, setState] = useState<Type>(initialValue);
  
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  const handleAction = () => {
    // Event handlers
  };
  
  return (
    // JSX
  );
}
```

### Python (AI Engine)

#### Style Guidelines
- Use Black formatter (line length 88)
- Use Flake8 for linting
- Type hints required for all functions
- Docstrings in Google style for all public functions
- Follow PEP 8 naming conventions
- Use `snake_case` for variables and functions
- Use `PascalCase` for classes

#### Function Documentation
```python
def analyze_code(code: str, language: str) -> dict[str, Any]:
    """
    Analyze code quality and provide feedback.
    
    Args:
        code: The source code to analyze
        language: Programming language (e.g., 'python', 'javascript')
    
    Returns:
        Dictionary containing analysis results with keys:
        - 'score': Quality score (0-100)
        - 'issues': List of detected issues
        - 'suggestions': List of improvement suggestions
    
    Raises:
        ValueError: If language is not supported
    """
    # Implementation
```

### General Rules

#### Code Quality
- All new code must have tests (see Testing Requirements)
- No hardcoded secrets or credentials - use environment variables
- Use environment variables for configuration
- Keep functions small and focused (< 50 lines preferred)
- Write self-documenting code with clear names
- Add comments only when explaining complex logic

#### Error Handling
```typescript
// Frontend/Backend
try {
  const result = await apiCall();
  return result;
} catch (error) {
  console.error('Specific error context:', error);
  throw new Error('User-friendly error message');
}
```

```python
# AI Engine
try:
    result = process_data(input_data)
    return result
except ValueError as e:
    logger.error(f"Invalid input data: {e}")
    raise
except Exception as e:
    logger.error(f"Unexpected error: {e}")
    raise RuntimeError("Processing failed") from e
```

## 🧪 Testing Requirements

### Before Creating PR:

#### Frontend Tests
```bash
npm test                    # Run Jest tests
npm run test:watch         # Watch mode for development
npm run lint               # Check linting errors
npm run type-check         # TypeScript type checking
```

#### Backend Tests
```bash
cd backend && npm test      # Run backend tests
cd backend && npm run lint  # Check linting errors
```

#### AI Engine Tests
```bash
cd ai-engine && pytest      # Run all tests
cd ai-engine && pytest -v   # Verbose output
cd ai-engine && black .     # Format code
cd ai-engine && flake8      # Check linting
```

### Test Coverage Targets
- **Frontend**: > 60% coverage
- **Backend**: > 70% coverage
- **AI Engine**: > 50% coverage

### Writing Tests

#### Frontend (Jest + React Testing Library)
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
  
  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Backend (Jest)
```javascript
const request = require('supertest');
const app = require('../server');

describe('POST /api/auth/login', () => {
  it('should return JWT token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

#### AI Engine (Pytest)
```python
import pytest
from services.code_analyzer import analyze_code

def test_analyze_code_returns_score():
    code = "def hello(): print('Hello, World!')"
    result = analyze_code(code, 'python')
    
    assert 'score' in result
    assert 0 <= result['score'] <= 100
    assert isinstance(result['issues'], list)
```

## 🔀 Pull Request Guidelines

### PR Title Format
Use conventional commit format:
- `feat: Add new feature description`
- `fix: Fix bug description`
- `docs: Update documentation`
- `refactor: Refactor code description`
- `test: Add tests for feature`
- `chore: Maintenance task`
- `perf: Performance improvement`
- `style: Code style changes (formatting, etc.)`

**Examples:**
- `feat: Add real-time code collaboration feature`
- `fix: Resolve JWT token expiration issue`
- `docs: Update API documentation for authentication endpoints`
- `refactor: Improve AI tutor response generation logic`

### PR Description Must Include

Use this template:

```markdown
## 📋 What Changes Were Made
- Bullet list of specific changes
- Include file paths if relevant

## 🎯 Why Changes Were Needed
- Explain the problem being solved
- Reference issue number if applicable

## 🧪 How to Test the Changes
1. Step-by-step testing instructions
2. Expected outcomes
3. Any required test data or setup

## ⚠️ Breaking Changes
- List any breaking changes
- Include migration instructions if needed

## 📸 Screenshots (if UI changes)
- Include before/after screenshots
```

### Branch Naming
- `feat/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation changes
- `refactor/refactoring-description` - Code refactoring
- `test/test-description` - Test additions/modifications
- `chore/maintenance-task` - Maintenance tasks

**Examples:**
- `feat/ai-tutor-chat-interface`
- `fix/authentication-token-refresh`
- `docs/api-endpoint-documentation`
- `refactor/database-query-optimization`

### Review Process
1. Ensure all tests pass
2. Verify code coverage meets targets
3. Run linters and fix all issues
4. Self-review your changes before requesting review
5. Request review from at least one team member
6. Address all review comments before merging

## ⚠️ Security Rules

### NEVER Commit

#### Sensitive Files
- SSH keys (`id_rsa`, `id_ed25519`, `id_ecdsa`, etc.)
- Private keys (`*.pem`, `*.key`, `*.private_key`)
- API keys or tokens
- `.env` files with real credentials
- Private certificates (`*.crt` with private keys)
- Database connection strings with passwords
- OAuth secrets or client secrets

#### Example of What NOT to Commit
```typescript
// ❌ NEVER do this
const API_KEY = 'sk-1234567890abcdef';
const DB_PASSWORD = 'mySecretPassword123';
```

### Always Do

#### Use Environment Variables
```typescript
// ✅ Always do this
const API_KEY = process.env.OPENAI_API_KEY;
const DB_PASSWORD = process.env.MONGODB_PASSWORD;
```

```python
# ✅ Always do this
import os
API_KEY = os.getenv('OPENAI_API_KEY')
DB_PASSWORD = os.getenv('MONGODB_PASSWORD')
```

#### Security Checklist
- [ ] Check `.gitignore` before committing
- [ ] Use environment variables for all secrets
- [ ] Run security scan when adding new dependencies
- [ ] Validate and sanitize all user inputs
- [ ] Use parameterized queries for database operations
- [ ] Implement proper authentication and authorization
- [ ] Keep dependencies up to date
- [ ] Review code for potential security vulnerabilities

#### Input Validation
```typescript
// Frontend/Backend - Always validate inputs
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(20),
});

const validatedData = userSchema.parse(userData);
```

#### MongoDB Injection Prevention
```javascript
// ❌ NEVER use direct string interpolation in queries
const user = await User.findOne({ email: userInput });  // Vulnerable if userInput contains operators

// ✅ Always sanitize inputs and use Mongoose properly
const mongoose = require('mongoose');
const sanitizedEmail = userInput.toString();  // Convert to string
const user = await User.findOne({ email: sanitizedEmail });

// ✅ Even better - use validation
const { body, validationResult } = require('express-validator');
// In route: body('email').isEmail().normalizeEmail()
const errors = validationResult(req);
if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
```

## 🏛️ Architecture Decisions

### AI Tutor Strategy

#### Model Selection Based on User Tier
- **Free users**: Local models (TinyLlama, CodeT5) - $0 cost
- **Paid users**: Can opt-in to use Gemini Pro 3 via Google One subscription
- **Always implement fallback**: If external API fails, fall back to local models

#### Implementation Pattern
```python
def get_ai_response(prompt: str, user_tier: str, user_preferences: dict) -> str:
    """Get AI response with appropriate model based on user tier."""
    try:
        if user_tier == 'premium' and user_preferences.get('gemini_enabled', False):
            return get_gemini_response(prompt)
        else:
            return get_local_model_response(prompt)
    except Exception as e:
        logger.warning(f"Primary model failed: {e}")
        return get_local_model_response(prompt)  # Fallback
```

### Database Strategy

#### MongoDB for Main Data
- User profiles and authentication
- Learning progress and achievements
- Coding challenges and submissions
- AI conversation history
- Use Mongoose for schema validation

#### Redis for Caching
- Session management
- Real-time collaboration state
- API response caching
- Rate limiting counters
- Leaderboard calculations

#### Example Usage
```javascript
// MongoDB for persistent data
const user = await User.findById(userId);

// Redis for caching
const cached = await redis.get(`user:${userId}`);
if (cached) return JSON.parse(cached);

const data = await fetchFromDB();
await redis.setex(`user:${userId}`, 3600, JSON.stringify(data));
```

### Authentication Strategy

#### JWT Tokens
- Access tokens: 15 minutes expiration
- Refresh tokens: 7 days expiration
- Store refresh tokens in httpOnly cookies
- Implement token rotation on refresh

#### Password Security
- Use bcrypt for password hashing
- Minimum 8 characters required
- Salt rounds: 10
- Never log or transmit passwords in plain text

#### Implementation
```javascript
// Password hashing
const bcrypt = require('bcryptjs');
const hashedPassword = await bcrypt.hash(password, 10);

// JWT generation
const jwt = require('jsonwebtoken');
const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);
```

### Real-time Communication

#### Socket.io for WebSockets
- Use for real-time code collaboration
- Implement room-based architecture
- Handle disconnections gracefully
- Implement message queuing for reliability

```javascript
// Server-side
io.on('connection', (socket) => {
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-joined', socket.id);
  });
  
  socket.on('code-change', (data) => {
    socket.to(data.roomId).emit('code-update', data);
  });
});
```

## 🔧 Common Tasks for AI Agents

### Adding a New API Endpoint

1. **Create route file** in `backend/routes/`
   ```javascript
   // backend/routes/challenges.js
   const express = require('express');
   const router = express.Router();
   const challengeController = require('../controllers/challengeController');
   const { authenticate } = require('../middleware/auth');
   
   router.get('/', authenticate, challengeController.getChallenges);
   router.post('/', authenticate, challengeController.createChallenge);
   
   module.exports = router;
   ```

2. **Create controller** in `backend/controllers/`
   ```javascript
   // backend/controllers/challengeController.js
   const Challenge = require('../models/Challenge');
   
   exports.getChallenges = async (req, res) => {
     try {
       const challenges = await Challenge.find({ userId: req.user.id });
       res.json(challenges);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   };
   ```

3. **Add validation middleware**
   ```javascript
   // backend/middleware/validation.js
   const { body, validationResult } = require('express-validator');
   
   exports.validateChallenge = [
     body('title').trim().isLength({ min: 1 }).escape(),
     body('difficulty').isIn(['easy', 'medium', 'hard']),
     (req, res, next) => {
       const errors = validationResult(req);
       if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() });
       }
       next();
     }
   ];
   ```

4. **Update OpenAPI spec** in `docs/api/openapi.yaml`

5. **Add tests**
   ```javascript
   // backend/__tests__/challenges.test.js
   describe('GET /api/challenges', () => {
     it('should return user challenges', async () => {
       const response = await request(app)
         .get('/api/challenges')
         .set('Authorization', `Bearer ${token}`);
       expect(response.status).toBe(200);
       expect(Array.isArray(response.body)).toBe(true);
     });
   });
   ```

### Adding a New Frontend Page

1. **Create page** in `src/app/`
   ```typescript
   // src/app/challenges/page.tsx
   export default function ChallengesPage() {
     return (
       <div>
         <h1>Coding Challenges</h1>
       </div>
     );
   }
   ```

2. **Create components** in `src/components/`
   ```typescript
   // src/components/challenges/ChallengeCard.tsx
   interface ChallengeCardProps {
     title: string;
     difficulty: 'easy' | 'medium' | 'hard';
   }
   
   export function ChallengeCard({ title, difficulty }: ChallengeCardProps) {
     return (
       <div className="border rounded-lg p-4">
         <h3>{title}</h3>
         <span className="badge">{difficulty}</span>
       </div>
     );
   }
   ```

3. **Add to navigation** if needed
   ```typescript
   // src/components/layout/Navigation.tsx
   const navItems = [
     { href: '/dashboard', label: 'Dashboard' },
     { href: '/challenges', label: 'Challenges' },
     { href: '/progress', label: 'Progress' },
   ];
   ```

4. **Add E2E test** (if test infrastructure exists)
   ```typescript
   // __tests__/e2e/challenges.test.tsx
   describe('Challenges Page', () => {
     it('renders challenges list', () => {
       render(<ChallengesPage />);
       expect(screen.getByText('Coding Challenges')).toBeInTheDocument();
     });
   });
   ```

### Adding a New AI Feature

1. **Implement in** `ai-engine/services/`
   ```python
   # ai-engine/services/code_reviewer.py
   from typing import Dict, List, Any
   
   def review_code(code: str, language: str) -> Dict[str, Any]:
       """
       Review code and provide suggestions.
       
       Args:
           code: Source code to review
           language: Programming language
       
       Returns:
           Dictionary with review results
       """
       # Implementation
       return {
           'score': 85,
           'suggestions': ['Use more descriptive variable names'],
           'best_practices': ['Consider error handling']
       }
   ```

2. **Add endpoint** in `ai-engine/main.py`
   ```python
   # ai-engine/main.py
   from flask import Flask, request, jsonify
   from services.code_reviewer import review_code
   
   app = Flask(__name__)
   
   @app.route('/review-code', methods=['POST'])
   def review_code_endpoint():
       data = request.json
       result = review_code(data['code'], data['language'])
       return jsonify(result)
   ```

3. **Update AI engine README**
   ```markdown
   ## New Endpoint: Code Review
   
   POST /review-code
   - Analyzes code quality and provides suggestions
   - Supports Python, JavaScript, Java, C++
   ```

4. **Add tests with pytest**
   ```python
   # ai-engine/test_code_reviewer.py
   from services.code_reviewer import review_code
   
   def test_review_code_returns_score():
       code = "def hello(): return 'Hello'"
       result = review_code(code, 'python')
       assert 'score' in result
       assert 0 <= result['score'] <= 100
   ```

## 📦 Dependencies

### Adding New Dependencies

#### Frontend
```bash
# Check bundle size impact before adding
npm install <package>

# For type definitions
npm install --save-dev @types/<package>
```

**Important**: Always check bundle size impact for frontend dependencies. Use tools like `bundle-analyzer` to verify.

#### Backend
```bash
cd backend
npm install <package>
```

**Important**: Ensure the package is actively maintained and has good security practices.

#### AI Engine
```bash
cd ai-engine
# Add to requirements.txt with pinned version
echo "package-name==1.2.3" >> requirements.txt
pip install -r requirements.txt
```

**Important**: Always pin versions for reproducible builds.

### Dependency Security

#### Before Adding Any Dependency

1. Check npm/PyPI for known vulnerabilities
2. Verify package is actively maintained (updated within last year)
3. Review package license compatibility
4. Check package download statistics and community trust
5. Review package dependencies (avoid heavy dependency trees)

```bash
# Check for vulnerabilities
npm audit
pip-audit  # or pip check

# Review package info
npm info <package>
pip show <package>
```

### Prohibited Dependencies

#### Never Use
- Packages with known security vulnerabilities
- Packages without active maintenance (> 1 year no updates)
- Packages with restrictive licenses incompatible with MIT
- Packages from untrusted sources
- Packages with unnecessarily large dependency trees

#### Restricted Licenses
- **Prohibited**: GPL (copyleft), AGPL, proprietary licenses
- **Allowed**: MIT, Apache 2.0, BSD, ISC
- **Review Required**: LGPL, MPL (consult with team)

### Updating Dependencies

```bash
# Frontend
npm update
npm audit fix

# Backend
cd backend && npm update

# AI Engine
cd ai-engine
pip install --upgrade -r requirements.txt
```

**Important**: Test thoroughly after updating dependencies, especially major version updates.

## 🆘 When to Escalate to Humans

### Always Ask Before

#### Critical Changes
- ⚠️ Changing authentication or authorization logic
- 💳 Modifying payment or billing code
- 🗑️ Deleting user data or database records
- 🗄️ Changing database schema (adding/removing fields)
- 🔌 Adding new third-party integrations or services
- 🔐 Modifying security or encryption implementations
- 📊 Changing analytics or tracking implementations

#### High-Impact Changes
- Modifying Docker or deployment configurations
- Changing environment variable requirements
- Updating major dependencies (e.g., React, Next.js, MongoDB drivers)
- Refactoring core business logic
- Changing API contracts that affect multiple services

### If Unsure

#### When in Doubt
- Add `needs-review` label to PR
- Leave detailed comments explaining uncertainty
- Request human review before merge
- Document assumptions made during implementation
- Provide alternative approaches for consideration

#### Example PR Comment Template
```markdown
## ⚠️ Review Needed

I'm uncertain about the following:

1. **[Specific concern]** - [Detailed explanation]
2. **Alternative approaches**:
   - Option A: [Description, pros, cons]
   - Option B: [Description, pros, cons]

**My recommendation**: [Your suggested approach with reasoning]

**Questions for reviewer**:
- [Specific question 1]
- [Specific question 2]

Please review and provide guidance on the best approach.
```

### Emergency Contact

#### Security Issues
- **NEVER** commit security vulnerabilities
- Report security issues immediately through proper channels
- Do not discuss security issues in public GitHub issues

#### Breaking Changes
- Always flag breaking changes in PR description
- Provide migration guide for breaking changes
- Coordinate with team before merging breaking changes

## 🎯 Best Practices Summary

### Security Checklist
- [ ] Code follows style guidelines (ESLint/Prettier/Black)
- [ ] All functions have proper type annotations
- [ ] Tests written and passing (meet coverage targets)
- [ ] No console.log or print statements in production code
- [ ] Error handling implemented properly
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Comments added for complex logic only
- [ ] Code is DRY (Don't Repeat Yourself)
- [ ] Functions are small and focused (< 50 lines)

### PR Checklist
- [ ] Conventional commit title format used
- [ ] PR description includes all required sections
- [ ] All tests pass locally
- [ ] Linting passes with no errors
- [ ] No merge conflicts with main branch
- [ ] Self-reviewed changes
- [ ] Screenshots provided for UI changes
- [ ] Breaking changes documented with migration guide

### Security Checklist
- [ ] No secrets in code or commits
- [ ] Environment variables used for configuration
- [ ] Input validation implemented
- [ ] NoSQL injection prevention (sanitized MongoDB queries)
- [ ] XSS prevention (proper escaping)
- [ ] CSRF protection enabled
- [ ] Rate limiting implemented for APIs
- [ ] Authentication properly implemented

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Project overview and quick start
- [CONTRIBUTING.md](CONTRIBUTING.md) - Detailed contribution guidelines
- [SETUP.md](SETUP.md) - Development environment setup
- [docs/api/README.md](docs/api/README.md) - Complete API documentation
- [docs/architecture/README.md](docs/architecture/README.md) - System architecture

### External Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/)

---

## 🤝 Working Effectively with This Codebase

### Quick Start for AI Agents
1. Read this AGENTS.md file completely
2. Review README.md for project context
3. Explore relevant section of codebase before making changes
4. Follow code style guidelines strictly
5. Write tests for all new functionality
6. Run linters and tests before creating PR
7. Use conventional commit format
8. Document your changes clearly
9. Request review when uncertain

### Communication Style
- Be explicit about assumptions
- Ask clarifying questions when requirements are ambiguous
- Provide multiple options when appropriate
- Document trade-offs in technical decisions
- Flag potential issues proactively

---

**Thank you for contributing to CodeMentor AI! 🚀**

*This document is maintained by the CodeMentor AI team. Last updated: January 6, 2026*
