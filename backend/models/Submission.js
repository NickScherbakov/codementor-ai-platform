const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  testCaseIndex: {
    type: Number,
    required: true
  },
  passed: {
    type: Boolean,
    required: true
  },
  actualOutput: String,
  expectedOutput: String,
  executionTime: Number, // milliseconds
  memoryUsed: Number, // bytes
  error: String
});

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    maxlength: 100000
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin']
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'passed', 'failed', 'error', 'timeout'],
    default: 'pending',
    index: true
  },
  testResults: [testResultSchema],
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  totalTests: {
    type: Number,
    default: 0
  },
  passedTests: {
    type: Number,
    default: 0
  },
  executionStats: {
    totalTime: Number, // milliseconds
    averageTime: Number,
    maxMemory: Number, // bytes
    averageMemory: Number
  },
  codeAnalysis: {
    complexity: {
      type: String,
      enum: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2^n)', 'unknown']
    },
    qualityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    suggestions: [String],
    bestPractices: [String],
    antiPatterns: [String]
  },
  aiReview: {
    reviewed: {
      type: Boolean,
      default: false
    },
    feedback: String,
    strengths: [String],
    improvements: [String],
    learningResources: [{
      title: String,
      url: String,
      type: String
    }]
  },
  attemptNumber: {
    type: Number,
    required: true,
    min: 1
  },
  timeTaken: {
    type: Number, // seconds from start to submission
    min: 0
  },
  hintsUsed: {
    type: Number,
    default: 0
  },
  isOptimal: {
    type: Boolean,
    default: false
  },
  xpEarned: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Achievement'
  }],
  metadata: {
    userAgent: String,
    ipAddress: String,
    sessionId: String
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
submissionSchema.index({ user: 1, challenge: 1, createdAt: -1 });
submissionSchema.index({ user: 1, status: 1 });
submissionSchema.index({ challenge: 1, status: 1, score: -1 });
submissionSchema.index({ createdAt: -1 });

// Virtual for pass rate
submissionSchema.virtual('passRate').get(function() {
  if (this.totalTests === 0) return 0;
  return (this.passedTests / this.totalTests) * 100;
});

// Method to calculate XP earned
submissionSchema.methods.calculateXP = function(baseXP) {
  let xp = baseXP;
  
  // Perfect score bonus
  if (this.score === 100) {
    xp *= 1.5;
  }
  
  // First attempt bonus
  if (this.attemptNumber === 1) {
    xp *= 1.25;
  }
  
  // No hints bonus
  if (this.hintsUsed === 0) {
    xp *= 1.1;
  }
  
  // Optimal solution bonus
  if (this.isOptimal) {
    xp *= 1.2;
  }
  
  // Time bonus (completed faster than estimated)
  // This would need the challenge's estimatedTime
  
  this.xpEarned = Math.round(xp);
  return this.xpEarned;
};

// Method to check if submission passed
submissionSchema.methods.hasPassed = function() {
  return this.status === 'passed' && this.score >= 70;
};

// Static method to get user's submission history for a challenge
submissionSchema.statics.getUserChallengeHistory = function(userId, challengeId) {
  return this.find({ user: userId, challenge: challengeId })
    .sort({ attemptNumber: 1 })
    .select('-code');
};

// Static method to get user's best submission for a challenge
submissionSchema.statics.getUserBestSubmission = function(userId, challengeId) {
  return this.findOne({ user: userId, challenge: challengeId })
    .sort({ score: -1, executionStats.totalTime: 1 })
    .limit(1);
};

// Static method to get leaderboard for a challenge
submissionSchema.statics.getChallengeLeaderboard = function(challengeId, limit = 10) {
  return this.aggregate([
    {
      $match: {
        challenge: mongoose.Types.ObjectId(challengeId),
        status: 'passed'
      }
    },
    {
      $sort: {
        score: -1,
        'executionStats.totalTime': 1,
        createdAt: 1
      }
    },
    {
      $group: {
        _id: '$user',
        bestSubmission: { $first: '$$ROOT' }
      }
    },
    {
      $replaceRoot: { newRoot: '$bestSubmission' }
    },
    {
      $limit: limit
    },
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $unwind: '$userInfo'
    },
    {
      $project: {
        user: '$userInfo.username',
        score: 1,
        executionTime: '$executionStats.totalTime',
        language: 1,
        submittedAt: '$createdAt'
      }
    }
  ]);
};

// Pre-save hook to calculate score
submissionSchema.pre('save', function(next) {
  if (this.testResults && this.testResults.length > 0) {
    this.totalTests = this.testResults.length;
    this.passedTests = this.testResults.filter(r => r.passed).length;
    this.score = Math.round((this.passedTests / this.totalTests) * 100);
    
    // Update status based on score
    if (this.score === 100) {
      this.status = 'passed';
    } else if (this.score >= 70) {
      this.status = 'passed'; // Partial pass
    } else if (this.score > 0) {
      this.status = 'failed';
    }
  }
  next();
});

const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;
