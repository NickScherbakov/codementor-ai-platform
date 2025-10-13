const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: [/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores']
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profileImage: {
    type: String,
    default: null
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'en'
    },
    preferredProgrammingLanguages: [{
      type: String,
      enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp', 'go', 'rust', 'php', 'ruby', 'swift', 'kotlin']
    }],
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'mixed'],
      default: 'mixed'
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      weeklyProgress: { type: Boolean, default: true }
    }
  },
  progress: {
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    completedChallenges: { type: Number, default: 0 },
    completedProjects: { type: Number, default: 0 },
    languageProgress: [{
      language: String,
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      completedLessons: { type: Number, default: 0 },
      totalLessons: { type: Number, default: 0 },
      lastActivity: { type: Date, default: Date.now }
    }],
    skillProgress: [{
      skill: String,
      xp: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      completedProjects: { type: Number, default: 0 },
      lastActivity: { type: Date, default: Date.now }
    }]
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  learningPaths: [{
    pathId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath'
    },
    enrolledAt: { type: Date, default: Date.now },
    completedModules: [String],
    currentModule: String,
    progress: { type: Number, default: 0 }
  }],
  socialConnections: {
    github: String,
    linkedin: String,
    portfolio: String
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    features: [String]
  },
  statistics: {
    totalCodeLinesWritten: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    averageSessionTime: { type: Number, default: 0 },
    favoriteLanguage: String,
    problemsSolved: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 }
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  roles: [{
    type: String,
    enum: ['student', 'mentor', 'admin', 'instructor'],
    default: 'student'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

// Indexes for better query performance
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })
UserSchema.index({ 'progress.level': -1 })
UserSchema.index({ 'progress.totalXP': -1 })
UserSchema.index({ createdAt: -1 })

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`
})

// Virtual for current level progress
UserSchema.virtual('levelProgress').get(function() {
  const xpForCurrentLevel = (this.progress.level - 1) * 250
  const xpForNextLevel = this.progress.level * 250
  const currentLevelXP = this.progress.totalXP - xpForCurrentLevel
  const requiredXP = xpForNextLevel - xpForCurrentLevel
  
  return {
    current: currentLevelXP,
    required: requiredXP,
    percentage: Math.round((currentLevelXP / requiredXP) * 100)
  }
})

// Instance method to add XP
UserSchema.methods.addXP = function(amount, source = 'challenge') {
  this.progress.totalXP += amount
  
  // Calculate new level (250 XP per level)
  const newLevel = Math.floor(this.progress.totalXP / 250) + 1
  const leveledUp = newLevel > this.progress.level
  
  this.progress.level = newLevel
  
  // Update statistics
  this.statistics.totalTimeSpent = this.statistics.totalTimeSpent || 0
  
  // Log XP gain
  console.log(`User ${this.username} gained ${amount} XP from ${source}. Total: ${this.progress.totalXP} (Level ${this.progress.level})`)
  
  return {
    leveledUp,
    newLevel,
    totalXP: this.progress.totalXP,
    xpGained: amount
  }
}

// Instance method to update streak
UserSchema.methods.updateStreak = function() {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Check if user has activity today
  const hasActivityToday = this.progress.lastActivity && 
    this.progress.lastActivity.toDateString() === today.toDateString()
  
  if (hasActivityToday) {
    // Already counted today
    return this.progress.currentStreak
  }
  
  // Check if user had activity yesterday
  const hadActivityYesterday = this.progress.lastActivity && 
    this.progress.lastActivity.toDateString() === yesterday.toDateString()
  
  if (hadActivityYesterday) {
    // Continue streak
    this.progress.currentStreak += 1
  } else {
    // Start new streak
    this.progress.currentStreak = 1
  }
  
  // Update longest streak
  if (this.progress.currentStreak > this.progress.longestStreak) {
    this.progress.longestStreak = this.progress.currentStreak
  }
  
  // Update last activity
  this.progress.lastActivity = today
  
  return this.progress.currentStreak
}

// Instance method to get user rank
UserSchema.methods.getRank = async function() {
  const User = this.constructor
  const usersAbove = await User.countDocuments({
    'progress.totalXP': { $gt: this.progress.totalXP }
  })
  
  return usersAbove + 1
}

// Static method to get leaderboard
UserSchema.statics.getLeaderboard = function(limit = 10, skip = 0) {
  return this.find({ isActive: true })
    .sort({ 'progress.totalXP': -1 })
    .limit(limit)
    .skip(skip)
    .select('username firstName lastName progress.totalXP progress.level profileImage')
}

// Static method to get user statistics
UserSchema.statics.getUserStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [{ $eq: ['$isActive', true] }, 1, 0]
          }
        },
        averageLevel: { $avg: '$progress.level' },
        totalXP: { $sum: '$progress.totalXP' },
        totalChallengesCompleted: { $sum: '$progress.completedChallenges' }
      }
    }
  ])
  
  return stats[0] || {}
}

// Pre-save middleware to update timestamps
UserSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.updatedAt = new Date()
  }
  next()
})

// Pre-save middleware to validate and clean data
UserSchema.pre('save', function(next) {
  // Ensure email is lowercase
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase()
  }
  
  // Ensure progress values are non-negative
  if (this.progress.totalXP < 0) this.progress.totalXP = 0
  if (this.progress.level < 1) this.progress.level = 1
  if (this.progress.currentStreak < 0) this.progress.currentStreak = 0
  
  next()
})

module.exports = mongoose.model('User', UserSchema)