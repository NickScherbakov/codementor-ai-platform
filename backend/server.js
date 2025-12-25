// Backend server for CodeMentor AI
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
const { createServer } = require('http')
const { Server } = require('socket.io')
const dotenv = require('dotenv')

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})

const PORT = process.env.PORT || 3001
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codementor-ai'

// Middleware
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
})
app.use('/api/', limiter)

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Database connection
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB')
})
.catch((error) => {
  console.error('MongoDB connection error:', error)
  process.exit(1)
})

// Import routes (safe)
function safeRequire(modulePath) {
  try {
    return require(modulePath)
  } catch (e) {
    console.warn(`Route not found, skipping: ${modulePath}`)
    return null
  }
}

const authRoutes = safeRequire('./routes/auth')
const userRoutes = safeRequire('./routes/users')
const challengeRoutes = safeRequire('./routes/challenges')
const submissionRoutes = safeRequire('./routes/submissions')
const learningPathRoutes = safeRequire('./routes/learningPaths')
const aiTutorRoutes = safeRequire('./routes/aiTutor')
const codeExecutionRoutes = safeRequire('./routes/codeExecution')
const progressRoutes = safeRequire('./routes/progress')
const achievementRoutes = safeRequire('./routes/achievements')
const notificationRoutes = safeRequire('./routes/notifications')

// API Routes
if (authRoutes) app.use('/api/auth', authRoutes)
if (userRoutes) app.use('/api/users', userRoutes)
if (challengeRoutes) app.use('/api/challenges', challengeRoutes)
if (submissionRoutes) app.use('/api/submissions', submissionRoutes)
if (learningPathRoutes) app.use('/api/learning-paths', learningPathRoutes)
if (aiTutorRoutes) app.use('/api/ai-tutor', aiTutorRoutes)
if (codeExecutionRoutes) app.use('/api/code-execution', codeExecutionRoutes)
if (progressRoutes) app.use('/api/progress', progressRoutes)
if (achievementRoutes) app.use('/api/achievements', achievementRoutes)
if (notificationRoutes) app.use('/api/notifications', notificationRoutes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// WebSocket handling for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  // Join user to their personal room
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`)
    console.log(`User ${userId} joined their room`)
  })

  // Join coding session room
  socket.on('join-session', (sessionId) => {
    socket.join(`session-${sessionId}`)
    console.log(`User joined session: ${sessionId}`)
  })

  // Handle real-time code collaboration
  socket.on('code-change', (data) => {
    socket.to(`session-${data.sessionId}`).emit('code-update', {
      code: data.code,
      userId: data.userId,
      timestamp: new Date()
    })
  })

  // Handle cursor position updates
  socket.on('cursor-change', (data) => {
    socket.to(`session-${data.sessionId}`).emit('cursor-update', {
      position: data.position,
      userId: data.userId,
      username: data.username
    })
  })

  // Handle chat messages in coding sessions
  socket.on('session-message', (data) => {
    io.to(`session-${data.sessionId}`).emit('new-message', {
      message: data.message,
      userId: data.userId,
      username: data.username,
      timestamp: new Date()
    })
  })

  // Handle AI tutor interactions
  socket.on('ai-tutor-message', async (data) => {
    try {
      // Process AI tutor request (integrate with AI engine)
      const response = await processAITutorMessage(data)
      
      socket.emit('ai-tutor-response', {
        response: response.message,
        suggestions: response.suggestions,
        resources: response.resources,
        timestamp: new Date()
      })
    } catch (error) {
      socket.emit('ai-tutor-error', {
        error: 'Failed to process AI tutor request',
        timestamp: new Date()
      })
    }
  })

  // Handle code execution requests
  socket.on('execute-code', async (data) => {
    try {
      const result = await executeCode(data.code, data.language, data.input)
      
      socket.emit('execution-result', {
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
        memoryUsed: result.memoryUsed,
        timestamp: new Date()
      })
    } catch (error) {
      socket.emit('execution-error', {
        error: 'Code execution failed',
        details: error.message,
        timestamp: new Date()
      })
    }
  })

  // Handle notifications
  socket.on('mark-notification-read', async (notificationId) => {
    try {
      // Mark notification as read in database
      await markNotificationAsRead(notificationId)
      socket.emit('notification-updated', { notificationId, read: true })
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Helper functions (these would be implemented in separate modules)
async function processAITutorMessage(data) {
  // This would integrate with the Python AI engine
  // For now, return a mock response
  return {
    message: "I understand you're working on this problem. Let me help you break it down...",
    suggestions: [
      "Consider using a for loop here",
      "Think about edge cases",
      "Review the algorithm complexity"
    ],
    resources: [
      { title: "For Loops in Python", url: "/learn/python/loops" },
      { title: "Algorithm Complexity", url: "/learn/algorithms/complexity" }
    ]
  }
}

async function executeCode(code, language, input = '') {
  // This would integrate with a secure code execution service
  // For now, return a mock response
  return {
    output: "Hello, World!\\n",
    error: null,
    executionTime: 0.045,
    memoryUsed: 2048
  }
}

async function markNotificationAsRead(notificationId) {
  // This would update the notification in the database
  console.log(`Marking notification ${notificationId} as read`)
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      details: err.message
    })
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid or expired token'
    })
  }
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: 'The requested resource was not found'
  })
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
    mongoose.connection.close()
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...')
  server.close(() => {
    console.log('Process terminated')
    mongoose.connection.close()
    process.exit(0)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 CodeMentor AI Backend Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`MongoDB: ${MONGODB_URI}`)
})