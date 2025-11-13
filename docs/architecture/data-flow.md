# 📊 Data Flow Architecture

This document illustrates the data flow patterns for key user scenarios in CodeMentor AI, showing how information moves through the system components.

## Key User Scenarios

### 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as MongoDB
    participant R as Redis
    participant GH as GitHub OAuth
    
    Note over U,GH: User Login Process
    
    U->>F: Click "Login with GitHub"
    F->>GH: Redirect to OAuth
    GH->>U: Show authorization page
    U->>GH: Grant permission
    GH->>F: Redirect with auth code
    F->>B: POST /api/auth/github {code}
    B->>GH: Exchange code for token
    GH->>B: Return user data + token
    B->>DB: Find or create user
    DB->>B: User document
    B->>B: Generate JWT token
    B->>R: Store session data
    R->>B: Session stored
    B->>F: Return JWT + user data
    F->>F: Store token in localStorage
    F->>U: Redirect to dashboard
    
    Note over U,R: Session established
```

### 2. Challenge Solving Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Engine
    participant J as Judge0
    participant DB as MongoDB
    participant R as Redis
    
    Note over U,DB: Complete Challenge Workflow
    
    U->>F: Select challenge
    F->>B: GET /api/challenges/:id
    B->>R: Check cache
    alt Cache hit
        R->>B: Cached challenge data
    else Cache miss
        B->>DB: Query challenge
        DB->>B: Challenge document
        B->>R: Cache challenge data
    end
    B->>F: Challenge data + starter code
    F->>U: Display challenge interface
    
    Note over U,F: User writes solution
    
    U->>F: Submit code solution
    F->>B: POST /api/challenges/:id/submit
    B->>DB: Create submission record
    DB->>B: Submission ID
    
    par Code Execution
        B->>J: Execute code with test cases
        J->>B: Execution results
    and AI Analysis
        B->>AI: POST /code/analyze
        AI->>AI: Analyze code quality
        AI->>B: Analysis results
    end
    
    B->>DB: Update submission with results
    B->>B: Calculate XP and achievements
    
    alt Challenge completed successfully
        B->>DB: Update user progress
        B->>R: Update leaderboard cache
        B->>F: Success + XP gained
        F->>U: Show success animation
    else Challenge failed
        B->>F: Failure + feedback
        F->>U: Show hints and suggestions
    end
```

### 3. AI Tutor Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Engine
    participant OAI as OpenAI API
    participant R as Redis
    participant DB as MongoDB
    
    Note over U,DB: AI Tutor Conversation
    
    U->>F: Type question to AI tutor
    F->>B: WebSocket: ai-tutor-message
    B->>AI: POST /ai-tutor/chat
    
    AI->>R: Check response cache
    alt Cache hit
        R->>AI: Cached response
    else Cache miss
        AI->>DB: Get user context & history
        DB->>AI: User profile + conversation history
        AI->>AI: Build conversation context
        AI->>OAI: Generate response
        OAI->>AI: AI response
        AI->>R: Cache response
    end
    
    AI->>AI: Personalize response based on user level
    AI->>B: Response + suggestions + resources
    B->>F: WebSocket: ai-tutor-response
    F->>U: Display AI response with animations
    
    Note over B,DB: Log conversation for learning
    B->>DB: Store conversation turn
```

### 4. Real-time Collaboration Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant F1 as Frontend 1
    participant F2 as Frontend 2
    participant B as Backend
    participant R as Redis
    participant DB as MongoDB
    
    Note over U1,DB: Collaborative Coding Session
    
    U1->>F1: Create coding session
    F1->>B: POST /api/sessions
    B->>DB: Create session document
    B->>R: Initialize session state
    B->>F1: Session ID + join link
    F1->>U1: Display session interface
    
    U1->>U2: Share session link
    U2->>F2: Join session via link
    F2->>B: WebSocket: join-session
    B->>R: Add user to session
    B->>F1: WebSocket: user-joined
    B->>F2: WebSocket: session-state
    
    Note over F1,F2: Both users see synchronized interface
    
    loop Real-time collaboration
        U1->>F1: Type code changes
        F1->>B: WebSocket: code-change
        B->>R: Update session code state
        B->>F2: WebSocket: code-update
        F2->>U2: Display code changes
        
        U2->>F2: Move cursor
        F2->>B: WebSocket: cursor-change
        B->>F1: WebSocket: cursor-update
        F1->>U1: Show User 2's cursor
        
        U1->>F1: Send chat message
        F1->>B: WebSocket: session-message
        B->>F2: WebSocket: new-message
        F2->>U2: Display chat message
    end
    
    Note over B,DB: Session ends
    U1->>F1: End session
    F1->>B: WebSocket: end-session
    B->>R: Archive session state
    B->>DB: Save session history
    B->>F2: WebSocket: session-ended
```

### 5. Adaptive Challenge Generation Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Engine
    participant OAI as OpenAI API
    participant DB as MongoDB
    participant R as Redis
    
    Note over U,DB: Personalized Challenge Creation
    
    U->>F: Request next challenge
    F->>B: GET /api/challenges/next
    B->>DB: Get user profile & progress
    DB->>B: User learning data
    
    B->>AI: POST /challenges/generate
    Note over AI: Analyze user profile
    AI->>DB: Query similar user patterns
    DB->>AI: Learning analytics data
    
    AI->>R: Check for cached similar challenges
    alt No suitable cached challenge
        AI->>AI: Determine optimal difficulty & topic
        AI->>OAI: Generate challenge content
        OAI->>AI: Challenge description & code
        AI->>AI: Create test cases & hints
        AI->>R: Cache generated challenge
    end
    
    AI->>B: Generated challenge data
    B->>DB: Store new challenge
    DB->>B: Challenge ID
    B->>F: Challenge data
    F->>U: Display personalized challenge
    
    Note over AI,DB: Track generation effectiveness
    AI->>DB: Log generation parameters
```

### 6. Performance Analytics Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant AI as AI Engine
    participant P as Prometheus
    participant G as Grafana
    participant DB as MongoDB
    
    Note over U,G: Performance Monitoring & Analytics
    
    loop Continuous monitoring
        F->>P: Client-side metrics (page load, interactions)
        B->>P: API metrics (response time, error rate)
        AI->>P: AI metrics (generation time, accuracy)
        DB->>P: Database metrics (query time, connections)
    end
    
    U->>F: View progress dashboard
    F->>B: GET /api/users/analytics
    B->>DB: Query user performance data
    DB->>B: Learning metrics & progress
    
    par Real-time metrics
        B->>P: Query current performance
        P->>B: Live metrics data
    and Historical analysis
        B->>AI: POST /analytics/insights
        AI->>DB: Analyze learning patterns
        DB->>AI: Historical performance data
        AI->>AI: Generate insights & recommendations
        AI->>B: Personalized insights
    end
    
    B->>F: Combined analytics data
    F->>U: Interactive dashboard with insights
    
    Note over P,G: Admin monitoring
    G->>P: Query system metrics
    P->>G: Infrastructure & application metrics
    G->>G: Generate alerts if thresholds exceeded
```

## Data Persistence Patterns

### 1. User Progress Tracking

```javascript
// MongoDB document structure for user progress
{
  userId: ObjectId("..."),
  progressData: {
    totalXP: 2450,
    currentLevel: 8,
    streakDays: 12,
    challengesCompleted: 45,
    
    // Language-specific progress
    languages: {
      python: {
        level: 6,
        xp: 1200,
        challengesCompleted: 25,
        topicsCompleted: ["variables", "loops", "functions", "classes"]
      },
      javascript: {
        level: 4,
        xp: 800,
        challengesCompleted: 15,
        topicsCompleted: ["syntax", "dom", "async"]
      }
    },
    
    // Learning analytics
    analytics: {
      averageTimePerChallenge: 23.5, // minutes
      preferredDifficulty: "medium",
      strongTopics: ["arrays", "hash-tables"],
      improvementAreas: ["dynamic-programming", "graphs"],
      learningVelocity: 1.2 // challenges per day
    }
  },
  
  lastUpdated: ISODate("2024-01-15T10:30:00Z")
}
```

### 2. Real-time Session State

```javascript
// Redis session state structure
{
  sessionId: "session_12345",
  participants: [
    {
      userId: "user_123",
      username: "alice",
      role: "driver", // or "navigator"
      cursorPosition: { line: 15, column: 8 },
      isActive: true
    },
    {
      userId: "user_456", 
      username: "bob",
      role: "navigator",
      cursorPosition: { line: 12, column: 3 },
      isActive: true
    }
  ],
  
  codeState: {
    language: "python",
    code: "def binary_search(arr, target):\n    left = 0\n    right = len(arr) - 1\n    ...",
    lastModified: "2024-01-15T10:35:22Z",
    lastModifiedBy: "user_123"
  },
  
  chatHistory: [
    {
      userId: "user_456",
      username: "bob", 
      message: "Let's use the divide and conquer approach",
      timestamp: "2024-01-15T10:33:15Z"
    }
  ],
  
  sessionMetadata: {
    challengeId: "binary-search-intro",
    startTime: "2024-01-15T10:30:00Z",
    estimatedDuration: 30, // minutes
    isRecording: true
  }
}
```

### 3. AI Response Caching Strategy

```python
# Redis caching for AI responses
cache_key_pattern = "ai_response:{message_hash}:{user_level}:{context_hash}"

# Example cached response
{
  "response": {
    "message": "Great question! Binary search works by...",
    "suggestions": [
      "Try implementing the iterative version first",
      "Consider the edge cases: empty array, single element",
      "Think about the loop invariant"
    ],
    "resources": [
      {
        "title": "Binary Search Visualization",
        "url": "/learn/algorithms/binary-search-viz",
        "type": "interactive"
      }
    ],
    "confidence": 0.92,
    "personalityUsed": "encouraging"
  },
  "metadata": {
    "generatedAt": "2024-01-15T10:34:12Z",
    "modelUsed": "gpt-3.5-turbo",
    "processingTime": 1.2, // seconds
    "cacheExpiry": "2024-01-15T11:34:12Z"
  }
}
```

## Error Handling and Recovery

### 1. Service Failure Recovery

```mermaid
graph TD
    A[Request Received] --> B{Primary Service Available?}
    B -->|Yes| C[Process Request]
    B -->|No| D{Cached Data Available?}
    D -->|Yes| E[Return Cached Response]
    D -->|No| F{Fallback Service Available?}
    F -->|Yes| G[Use Fallback Service]
    F -->|No| H[Return Error with Retry Info]
    
    C --> I{Request Successful?}
    I -->|Yes| J[Cache Response]
    I -->|No| K[Log Error & Retry]
    
    J --> L[Return Response]
    E --> L
    G --> L
    K --> M{Max Retries Reached?}
    M -->|No| A
    M -->|Yes| H
```

### 2. Data Consistency Patterns

```javascript
// Eventual consistency for non-critical updates
async function updateUserProgress(userId, progressUpdate) {
  try {
    // Primary update
    await mongodb.users.updateOne(
      { _id: userId },
      { $inc: { 'progress.totalXP': progressUpdate.xp } }
    )
    
    // Async cache update (fire and forget)
    redis.hincrby(`user:${userId}:stats`, 'totalXP', progressUpdate.xp)
      .catch(err => logger.warn('Cache update failed', err))
    
    // Async leaderboard update
    updateLeaderboard(userId, progressUpdate.xp)
      .catch(err => logger.warn('Leaderboard update failed', err))
    
  } catch (error) {
    // Queue for retry
    await retryQueue.add('updateUserProgress', { userId, progressUpdate })
    throw error
  }
}
```

---

*This data flow documentation provides detailed insights into how information moves through CodeMentor AI. For database schema details, see [Database Schema](./database-schema.md).*