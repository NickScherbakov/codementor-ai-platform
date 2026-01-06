const mongoose = require('mongoose');

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true
  },
  expectedOutput: {
    type: String,
    required: true
  },
  isHidden: {
    type: Boolean,
    default: false
  },
  weight: {
    type: Number,
    default: 1
  }
});

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 5000
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
    index: true
  },
  category: {
    type: String,
    enum: ['algorithms', 'data-structures', 'web-development', 'databases', 'system-design', 'object-oriented', 'functional-programming', 'debugging', 'refactoring'],
    required: true,
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  languages: [{
    type: String,
    enum: ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'],
    required: true
  }],
  starterCode: {
    type: Map,
    of: String, // key: language, value: starter code
    default: {}
  },
  solution: {
    type: Map,
    of: String, // key: language, value: solution code
    default: {}
  },
  hints: [{
    order: Number,
    content: String,
    unlockedAfterAttempts: {
      type: Number,
      default: 0
    }
  }],
  testCases: [testCaseSchema],
  constraints: {
    timeLimit: {
      type: Number,
      default: 5000, // milliseconds
      min: 100,
      max: 30000
    },
    memoryLimit: {
      type: Number,
      default: 128, // MB
      min: 16,
      max: 512
    }
  },
  xpReward: {
    type: Number,
    required: true,
    min: 10,
    max: 1000
  },
  estimatedTime: {
    type: Number, // minutes
    min: 5,
    max: 240
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }],
  learningObjectives: [{
    type: String,
    trim: true
  }],
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'tutorial', 'video', 'article']
    }
  }],
  statistics: {
    totalAttempts: {
      type: Number,
      default: 0
    },
    successfulAttempts: {
      type: Number,
      default: 0
    },
    averageAttempts: {
      type: Number,
      default: 0
    },
    averageTime: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isCommunityGenerated: {
    type: Boolean,
    default: false
  },
  votes: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for performance
challengeSchema.index({ difficulty: 1, category: 1 });
challengeSchema.index({ tags: 1 });
challengeSchema.index({ isPublished: 1, featured: 1 });
challengeSchema.index({ 'statistics.successRate': -1 });
challengeSchema.index({ createdAt: -1 });

// Virtual for difficulty score
challengeSchema.virtual('difficultyScore').get(function() {
  const scores = {
    'beginner': 1,
    'intermediate': 2,
    'advanced': 3,
    'expert': 4
  };
  return scores[this.difficulty] || 1;
});

// Method to update statistics
challengeSchema.methods.updateStatistics = function(wasSuccessful, attempts, timeTaken) {
  this.statistics.totalAttempts += attempts;
  if (wasSuccessful) {
    this.statistics.successfulAttempts += 1;
  }
  
  // Update averages
  const total = this.statistics.successfulAttempts + (this.statistics.totalAttempts - this.statistics.successfulAttempts);
  if (total > 0) {
    this.statistics.averageAttempts = this.statistics.totalAttempts / total;
    this.statistics.successRate = (this.statistics.successfulAttempts / total) * 100;
  }
  
  if (timeTaken) {
    const currentTotalTime = this.statistics.averageTime * (total - 1);
    this.statistics.averageTime = (currentTotalTime + timeTaken) / total;
  }
  
  return this.save();
};

// Static method to get challenges by difficulty
challengeSchema.statics.getByDifficulty = function(difficulty, limit = 10) {
  return this.find({ difficulty, isPublished: true })
    .sort({ featured: -1, 'statistics.successRate': 1 })
    .limit(limit);
};

// Static method to get recommended challenges
challengeSchema.statics.getRecommended = function(userSkillLevel, completedChallengeIds = [], limit = 5) {
  return this.find({
    isPublished: true,
    difficulty: userSkillLevel,
    _id: { $nin: completedChallengeIds }
  })
  .sort({ 'statistics.successRate': 1, featured: -1 })
  .limit(limit);
};

const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
