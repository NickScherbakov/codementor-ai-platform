const mongoose = require('mongoose');

const skillProgressSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 100
  },
  xp: {
    type: Number,
    default: 0,
    min: 0
  },
  xpToNextLevel: {
    type: Number,
    default: 100
  },
  challenges: [{
    challengeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    completedAt: Date,
    score: Number,
    attempts: Number
  }],
  lastPracticed: {
    type: Date,
    default: Date.now
  }
});

const streakSchema = new mongoose.Schema({
  current: {
    type: Number,
    default: 0
  },
  longest: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  }
});

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  totalXP: {
    type: Number,
    default: 0,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  xpToNextLevel: {
    type: Number,
    default: 100
  },
  rank: {
    type: String,
    enum: ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master', 'Grandmaster', 'Legend'],
    default: 'Novice'
  },
  skills: [skillProgressSchema],
  completedChallenges: [{
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    attempts: Number,
    bestScore: Number,
    timeTaken: Number,
    xpEarned: Number
  }],
  inProgressChallenges: [{
    challenge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge'
    },
    startedAt: {
      type: Date,
      default: Date.now
    },
    attempts: Number,
    lastAttemptAt: Date
  }],
  streak: streakSchema,
  statistics: {
    totalChallengesAttempted: {
      type: Number,
      default: 0
    },
    totalChallengesCompleted: {
      type: Number,
      default: 0
    },
    totalSubmissions: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0 // minutes
    },
    favoriteLanguage: String,
    languageUsage: {
      type: Map,
      of: Number,
      default: {}
    },
    categoryProgress: {
      type: Map,
      of: Number,
      default: {}
    }
  },
  learningPath: {
    current: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath'
    },
    completed: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LearningPath'
    }],
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  achievements: [{
    achievement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    unlockedAt: {
      type: Date,
      default: Date.now
    },
    progress: {
      type: Number,
      default: 0
    }
  }],
  dailyGoals: {
    challengesGoal: {
      type: Number,
      default: 1
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    xpGoal: {
      type: Number,
      default: 50
    },
    xpEarned: {
      type: Number,
      default: 0
    },
    lastResetDate: {
      type: Date,
      default: Date.now
    }
  },
  preferences: {
    preferredLanguages: [String],
    difficultyLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    },
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading'],
      default: 'visual'
    },
    aiTutorPersonality: {
      type: String,
      enum: ['encouraging', 'analytical', 'creative', 'socratic'],
      default: 'encouraging'
    }
  }
}, {
  timestamps: true
});

// Indexes
progressSchema.index({ totalXP: -1 });
progressSchema.index({ level: -1 });
progressSchema.index({ 'streak.current': -1 });

// Method to add XP
progressSchema.methods.addXP = function(amount) {
  this.totalXP += amount;
  
  // Check for level up
  while (this.totalXP >= this.xpToNextLevel) {
    this.totalXP -= this.xpToNextLevel;
    this.level += 1;
    this.xpToNextLevel = this.calculateNextLevelXP();
    this.updateRank();
  }
  
  return this.save();
};

// Calculate XP needed for next level
progressSchema.methods.calculateNextLevelXP = function() {
  // Exponential growth: XP = 100 * (1.1 ^ level)
  return Math.floor(100 * Math.pow(1.1, this.level));
};

// Update rank based on level
progressSchema.methods.updateRank = function() {
  const ranks = [
    { threshold: 1, rank: 'Novice' },
    { threshold: 5, rank: 'Beginner' },
    { threshold: 15, rank: 'Intermediate' },
    { threshold: 30, rank: 'Advanced' },
    { threshold: 50, rank: 'Expert' },
    { threshold: 75, rank: 'Master' },
    { threshold: 100, rank: 'Grandmaster' },
    { threshold: 150, rank: 'Legend' }
  ];
  
  for (let i = ranks.length - 1; i >= 0; i--) {
    if (this.level >= ranks[i].threshold) {
      this.rank = ranks[i].rank;
      break;
    }
  }
};

// Update streak
progressSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastActivity = new Date(this.streak.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 0) {
    // Already counted today
    return;
  } else if (daysDiff === 1) {
    // Consecutive day
    this.streak.current += 1;
    if (this.streak.current > this.streak.longest) {
      this.streak.longest = this.streak.current;
    }
  } else {
    // Streak broken
    this.streak.current = 1;
  }
  
  this.streak.lastActivityDate = new Date();
  return this.save();
};

// Complete a challenge
progressSchema.methods.completeChallenge = async function(challengeId, score, attempts, timeTaken, xpEarned) {
  // Update streak
  await this.updateStreak();
  
  // Add XP
  await this.addXP(xpEarned);
  
  // Remove from in-progress
  this.inProgressChallenges = this.inProgressChallenges.filter(
    c => c.challenge.toString() !== challengeId.toString()
  );
  
  // Add to completed (if not already there or update if better score)
  const existingIndex = this.completedChallenges.findIndex(
    c => c.challenge.toString() === challengeId.toString()
  );
  
  if (existingIndex === -1) {
    this.completedChallenges.push({
      challenge: challengeId,
      completedAt: new Date(),
      attempts,
      bestScore: score,
      timeTaken,
      xpEarned
    });
    this.statistics.totalChallengesCompleted += 1;
  } else if (this.completedChallenges[existingIndex].bestScore < score) {
    this.completedChallenges[existingIndex].bestScore = score;
    this.completedChallenges[existingIndex].attempts = attempts;
    this.completedChallenges[existingIndex].timeTaken = timeTaken;
  }
  
  // Update daily goals
  this.dailyGoals.challengesCompleted += 1;
  this.dailyGoals.xpEarned += xpEarned;
  
  // Update statistics
  this.updateStatistics();
  
  return this.save();
};

// Update overall statistics
progressSchema.methods.updateStatistics = function() {
  if (this.statistics.totalChallengesAttempted > 0) {
    this.statistics.successRate = 
      (this.statistics.totalChallengesCompleted / this.statistics.totalChallengesAttempted) * 100;
  }
  
  // Calculate average score from completed challenges
  if (this.completedChallenges.length > 0) {
    const totalScore = this.completedChallenges.reduce((sum, c) => sum + c.bestScore, 0);
    this.statistics.averageScore = totalScore / this.completedChallenges.length;
  }
};

// Reset daily goals (should be called daily via cron job)
progressSchema.methods.resetDailyGoals = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const lastReset = new Date(this.dailyGoals.lastResetDate);
  lastReset.setHours(0, 0, 0, 0);
  
  if (today > lastReset) {
    this.dailyGoals.challengesCompleted = 0;
    this.dailyGoals.xpEarned = 0;
    this.dailyGoals.lastResetDate = new Date();
    return this.save();
  }
};

// Static method to get leaderboard
progressSchema.statics.getLeaderboard = function(limit = 100) {
  return this.find()
    .sort({ totalXP: -1, level: -1 })
    .limit(limit)
    .populate('user', 'username email avatar')
    .select('user totalXP level rank streak.current');
};

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;
