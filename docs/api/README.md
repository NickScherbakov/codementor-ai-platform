# CodeMentor AI - API Documentation

Welcome to the CodeMentor AI API documentation. This comprehensive guide provides everything you need to integrate with our intelligent programming learning platform.

## 🚀 Quick Start

### Base URL
```
Development: http://localhost:3001/api
Production: https://api.codementor-ai.com/api
```

### Authentication
All API requests require authentication using JWT tokens:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     https://api.codementor-ai.com/api/users/profile
```

### Rate Limiting
- **Development**: 100 requests per 15 minutes per IP
- **Production**: 1000 requests per hour per authenticated user

## 📚 API Overview

### Core Services

| Service | Description | Base Path |
|---------|-------------|-----------|
| **Authentication** | User registration, login, token management | `/auth` |
| **Users** | User profiles, preferences, progress tracking | `/users` |
| **Challenges** | Programming challenges and problem sets | `/challenges` |
| **AI Tutor** | Intelligent tutoring and code assistance | `/ai-tutor` |
| **Code Execution** | Secure code execution and testing | `/code-execution` |
| **Submissions** | Solution submissions and evaluations | `/submissions` |
| **Progress** | Learning analytics and progress tracking | `/progress` |
| **Achievements** | Gamification system and badges | `/achievements` |

### Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {
    // Response payload
  },
  "message": "Operation completed successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Error responses:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "coder123",
  "password": "SecurePass123!",
  "name": "John Doe",
  "preferences": {
    "learningStyle": "visual",
    "preferredLanguages": ["python", "javascript"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_12345",
      "email": "user@example.com",
      "username": "coder123",
      "name": "John Doe"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": 3600
    }
  }
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

## 👤 User Management

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user_12345",
    "email": "user@example.com",
    "username": "coder123",
    "name": "John Doe",
    "level": 8,
    "xp": 2450,
    "streak": 12,
    "preferences": {
      "learningStyle": "visual",
      "tutorPersonality": "encouraging",
      "preferredLanguages": ["python", "javascript"]
    },
    "stats": {
      "challengesCompleted": 45,
      "averageScore": 87,
      "totalCodeLines": 1250
    }
  }
}
```

### Update User Preferences
```http
PUT /api/users/preferences
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "learningStyle": "kinesthetic",
  "tutorPersonality": "analytical",
  "preferredLanguages": ["python", "java", "cpp"]
}
```

## 🎯 Challenges API

### Get Challenges
```http
GET /api/challenges?difficulty=medium&language=python&topic=algorithms&page=1&limit=10
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `difficulty`: `easy` | `medium` | `hard` | `expert`
- `language`: `python` | `javascript` | `java` | `cpp` | `rust`
- `topic`: `algorithms` | `data-structures` | `arrays` | `strings` | `graphs`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)

**Response:**
```json
{
  "success": true,
  "data": {
    "challenges": [
      {
        "id": "challenge_67890",
        "title": "Two Sum Problem",
        "description": "Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
        "difficulty": "easy",
        "language": "python",
        "topics": ["arrays", "hash-tables"],
        "xpReward": 100,
        "estimatedTime": "15 minutes",
        "successRate": 0.78,
        "starterCode": "def two_sum(nums, target):\n    # Your code here\n    pass"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 156,
      "totalPages": 16
    }
  }
}
```

### Get Challenge Details
```http
GET /api/challenges/challenge_67890
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "challenge_67890",
    "title": "Two Sum Problem",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "difficulty": "easy",
    "language": "python",
    "topics": ["arrays", "hash-tables"],
    "xpReward": 100,
    "estimatedTime": "15 minutes",
    "starterCode": "def two_sum(nums, target):\n    # Your code here\n    pass",
    "testCases": [
      {
        "id": "test_1",
        "input": {
          "nums": [2, 7, 11, 15],
          "target": 9
        },
        "expectedOutput": [0, 1],
        "hidden": false
      }
    ],
    "hints": [
      {
        "order": 1,
        "text": "Think about using a hash table to store complements",
        "xpCost": 10
      }
    ],
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists"
    ]
  }
}
```

## 🤖 AI Tutor API

### Chat with AI Tutor
```http
POST /api/ai-tutor/chat
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "message": "I'm stuck on this binary search implementation. Can you help?",
  "context": {
    "challengeId": "challenge_12345",
    "currentCode": "def binary_search(arr, target):\n    # I'm not sure how to start",
    "language": "python"
  },
  "personality": "encouraging"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "I'd be happy to help you with binary search! 🎯 Think of it like finding a word in a dictionary - you don't start from page 1, right? You open to the middle and decide which half to search next. Let's break this down step by step...",
    "suggestions": [
      "Start by setting left and right pointers",
      "Calculate the middle index in each iteration",
      "Compare the middle element with your target"
    ],
    "resources": [
      {
        "title": "Binary Search Visualization",
        "url": "/learn/algorithms/binary-search",
        "type": "interactive"
      }
    ],
    "codeHints": [
      {
        "line": 2,
        "suggestion": "Initialize left = 0 and right = len(arr) - 1"
      }
    ]
  }
}
```

### Get AI Code Analysis
```http
POST /api/ai-tutor/analyze-code
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "code": "def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
  "language": "python",
  "challengeContext": {
    "id": "challenge_fibonacci",
    "requirements": ["optimize for large inputs"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "correctness": {
        "score": 100,
        "issues": []
      },
      "performance": {
        "timeComplexity": "O(2^n)",
        "spaceComplexity": "O(n)",
        "score": 30,
        "issues": [
          "Exponential time complexity due to repeated calculations"
        ]
      },
      "codeQuality": {
        "score": 85,
        "issues": [
          "Consider adding docstring",
          "Add input validation for negative numbers"
        ]
      }
    },
    "suggestions": [
      {
        "type": "optimization",
        "priority": "high",
        "description": "Use memoization to avoid recalculating the same values",
        "example": "Use @lru_cache decorator or manual memoization"
      }
    ],
    "optimizedSolution": {
      "code": "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n-1) + fibonacci(n-2)",
      "explanation": "This version uses memoization to cache results, reducing time complexity to O(n)"
    }
  }
}
```

## ⚡ Code Execution API

### Execute Code
```http
POST /api/code-execution/run
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "code": "def hello_world():\n    return 'Hello, CodeMentor AI!'\n\nprint(hello_world())",
  "language": "python",
  "input": "",
  "timeLimit": 5,
  "memoryLimit": 128
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "output": "Hello, CodeMentor AI!\n",
    "error": null,
    "executionTime": 0.045,
    "memoryUsed": 8.2,
    "status": "completed",
    "exitCode": 0
  }
}
```

### Submit Solution
```http
POST /api/submissions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "challengeId": "challenge_67890",
  "code": "def two_sum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []",
  "language": "python"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "submissionId": "sub_98765",
    "status": "accepted",
    "score": 100,
    "xpEarned": 150,
    "testResults": [
      {
        "testCaseId": "test_1",
        "passed": true,
        "executionTime": 0.023,
        "memoryUsed": 4.1
      }
    ],
    "feedback": {
      "strengths": [
        "Optimal O(n) time complexity",
        "Clean and readable code",
        "Proper edge case handling"
      ],
      "improvements": [
        "Consider adding input validation",
        "Add docstring for better documentation"
      ]
    },
    "achievements": [
      {
        "id": "first_optimal_solution",
        "name": "Optimization Master",
        "xpBonus": 50
      }
    ]
  }
}
```

## 📊 Progress Tracking

### Get Learning Progress
```http
GET /api/progress/overview
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": {
      "level": 8,
      "xp": 2450,
      "xpToNextLevel": 50,
      "streak": 12,
      "totalChallenges": 45
    },
    "languages": {
      "python": {
        "level": 6,
        "xp": 1200,
        "challenges": 25,
        "proficiency": 78
      },
      "javascript": {
        "level": 4,
        "xp": 800,
        "challenges": 15,
        "proficiency": 62
      }
    },
    "topics": {
      "arrays": { "mastery": 85, "challenges": 12 },
      "algorithms": { "mastery": 72, "challenges": 18 },
      "data-structures": { "mastery": 68, "challenges": 10 }
    },
    "recentActivity": [
      {
        "date": "2024-01-15",
        "type": "challenge_completed",
        "challengeId": "challenge_67890",
        "xpGained": 150
      }
    ]
  }
}
```

## 🏆 Achievements API

### Get User Achievements
```http
GET /api/achievements
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "earned": [
      {
        "id": "first_steps",
        "name": "First Steps",
        "description": "Complete your first coding challenge",
        "icon": "🎯",
        "rarity": "common",
        "xpReward": 50,
        "earnedAt": "2024-01-10T14:30:00Z"
      }
    ],
    "available": [
      {
        "id": "speed_demon",
        "name": "Speed Demon",
        "description": "Solve 5 challenges in under 10 minutes each",
        "icon": "⚡",
        "rarity": "rare",
        "xpReward": 500,
        "progress": {
          "current": 2,
          "required": 5
        }
      }
    ],
    "stats": {
      "totalEarned": 12,
      "totalXpFromAchievements": 1250,
      "rarity": {
        "common": 8,
        "rare": 3,
        "epic": 1,
        "legendary": 0
      }
    }
  }
}
```

## 🔄 WebSocket Events

For real-time features, connect to the WebSocket endpoint:

```javascript
const socket = io('ws://localhost:3001', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

// Join user room for notifications
socket.emit('join-user-room', userId);

// Listen for real-time events
socket.on('ai-tutor-response', (data) => {
  console.log('AI Tutor:', data.response);
});

socket.on('execution-result', (data) => {
  console.log('Code Output:', data.output);
});
```

## 📝 Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Invalid input parameters | 400 |
| `UNAUTHORIZED` | Invalid or missing authentication | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMITED` | Too many requests | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | External service unavailable | 503 |

## 🚀 SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @codementor-ai/sdk
```

```typescript
import { CodeMentorAI } from '@codementor-ai/sdk';

const client = new CodeMentorAI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.codementor-ai.com'
});

const challenges = await client.challenges.list({
  difficulty: 'medium',
  language: 'python'
});
```

### Python
```bash
pip install codementor-ai-sdk
```

```python
from codementor_ai import CodeMentorAI

client = CodeMentorAI(api_key='your-api-key')

challenges = client.challenges.list(
    difficulty='medium',
    language='python'
)
```

## 📞 Support

- **API Issues**: [GitHub Issues](https://github.com/codementor-ai/platform/issues)
- **Documentation**: [docs.codementor-ai.com](https://docs.codementor-ai.com)
- **Community**: [Discord Server](https://discord.gg/codementor-ai)
- **Email**: api-support@codementor-ai.com

---

**Interactive API Explorer**: [Try our APIs live →](http://localhost:3001/api-docs)