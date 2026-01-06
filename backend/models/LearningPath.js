const mongoose = require('mongoose');

const pathStepSchema = new mongoose.Schema({
  order: {
    type: Number,
    required: true
  },
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  isOptional: {
    type: Boolean,
    default: false
  },
  estimatedTime: {
    type: Number, // minutes
    default: 30
  },
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge'
  }]
});

const learningPathSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    enum: ['programming-fundamentals', 'web-development', 'data-structures', 'algorithms', 'database', 'system-design', 'career-prep', 'language-specific'],
    required: true,
    index: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true,
    index: true
  },
  language: {
    type: String,
    required: true,
    enum: ['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'multi-language']
  },
  tags: [{
    type: String,
    trim: true
  }],
  icon: {
    type: String,
    default: '📚'
  },
  banner: {
    type: String // URL to banner image
  },
  steps: [pathStepSchema],
  totalChallenges: {
    type: Number,
    default: 0
  },
  estimatedDuration: {
    type: Number, // total hours
    default: 0
  },
  learningObjectives: [{
    type: String,
    trim: true
  }],
  skillsYouWillLearn: [{
    type: String,
    trim: true
  }],
  prerequisites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath'
  }],
  nextPaths: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LearningPath'
  }],
  resources: [{
    title: String,
    description: String,
    url: String,
    type: {
      type: String,
      enum: ['documentation', 'tutorial', 'video', 'article', 'book', 'course']
    }
  }],
  milestones: [{
    title: String,
    description: String,
    achievedAfterSteps: Number,
    reward: {
      xp: Number,
      badge: String
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  featured: {
    type: Boolean,
    default: false
  },
  statistics: {
    totalEnrolled: {
      type: Number,
      default: 0
    },
    totalCompleted: {
      type: Number,
      default: 0
    },
    completionRate: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    averageCompletionTime: {
      type: Number,
      default: 0 // hours
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    comment: {
      type: String,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Indexes
learningPathSchema.index({ category: 1, difficulty: 1 });
learningPathSchema.index({ language: 1 });
learningPathSchema.index({ isPublished: 1, featured: 1 });
learningPathSchema.index({ 'statistics.averageRating': -1 });
learningPathSchema.index({ 'statistics.totalEnrolled': -1 });

// Calculate total challenges and duration
learningPathSchema.pre('save', function(next) {
  if (this.steps && this.steps.length > 0) {
    this.totalChallenges = this.steps.filter(s => !s.isOptional).length;
    this.estimatedDuration = Math.ceil(
      this.steps.reduce((sum, step) => sum + step.estimatedTime, 0) / 60
    );
  }
  next();
});

// Update completion rate
learningPathSchema.methods.updateCompletionRate = function() {
  if (this.statistics.totalEnrolled > 0) {
    this.statistics.completionRate = 
      (this.statistics.totalCompleted / this.statistics.totalEnrolled) * 100;
  }
  return this.save();
};

// Add a review
learningPathSchema.methods.addReview = function(userId, rating, comment) {
  // Remove existing review from this user
  this.reviews = this.reviews.filter(
    r => r.user.toString() !== userId.toString()
  );
  
  // Add new review
  this.reviews.push({
    user: userId,
    rating,
    comment,
    createdAt: new Date()
  });
  
  // Update statistics
  this.statistics.totalReviews = this.reviews.length;
  const totalRating = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.statistics.averageRating = totalRating / this.reviews.length;
  
  return this.save();
};

// Get progress for a user
learningPathSchema.methods.getUserProgress = function(completedChallengeIds) {
  const requiredSteps = this.steps.filter(s => !s.isOptional);
  const completedSteps = requiredSteps.filter(step =>
    completedChallengeIds.includes(step.challenge.toString())
  );
  
  const progress = (completedSteps.length / requiredSteps.length) * 100;
  const currentStep = completedSteps.length;
  const totalSteps = requiredSteps.length;
  
  // Find next uncompleted step
  const nextStep = requiredSteps.find(step =>
    !completedChallengeIds.includes(step.challenge.toString())
  );
  
  return {
    progress: Math.round(progress),
    currentStep: currentStep + 1,
    totalSteps,
    nextChallenge: nextStep ? nextStep.challenge : null,
    isCompleted: progress === 100
  };
};

// Static method to get recommended paths
learningPathSchema.statics.getRecommended = function(userLevel, userLanguages = [], limit = 5) {
  const query = {
    isPublished: true,
    difficulty: userLevel
  };
  
  if (userLanguages.length > 0) {
    query.$or = [
      { language: { $in: userLanguages } },
      { language: 'multi-language' }
    ];
  }
  
  return this.find(query)
    .sort({ featured: -1, 'statistics.averageRating': -1 })
    .limit(limit)
    .populate('steps.challenge', 'title difficulty category');
};

// Static method to create default learning paths
learningPathSchema.statics.createDefaults = async function() {
  const User = mongoose.model('User');
  const systemUser = await User.findOne({ email: 'system@codementor.ai' });
  
  if (!systemUser) {
    console.log('System user not found. Skipping default learning paths creation.');
    return;
  }
  
  const defaultPaths = [
    {
      title: 'Python Fundamentals',
      description: 'Master the basics of Python programming from variables to functions',
      category: 'programming-fundamentals',
      difficulty: 'beginner',
      language: 'python',
      icon: '🐍',
      tags: ['python', 'beginner', 'fundamentals'],
      learningObjectives: [
        'Understand Python syntax and basic data types',
        'Write functions and use control flow',
        'Work with lists, dictionaries, and sets',
        'Handle errors and exceptions'
      ],
      skillsYouWillLearn: [
        'Variables and Data Types',
        'Control Flow (if/else, loops)',
        'Functions and Modules',
        'Error Handling'
      ],
      isOfficial: true,
      isPublished: true,
      featured: true,
      createdBy: systemUser._id
    },
    {
      title: 'JavaScript Essentials',
      description: 'Learn JavaScript from scratch and build interactive web applications',
      category: 'web-development',
      difficulty: 'beginner',
      language: 'javascript',
      icon: '⚡',
      tags: ['javascript', 'web', 'beginner'],
      learningObjectives: [
        'Understand JavaScript fundamentals',
        'Work with DOM manipulation',
        'Handle asynchronous operations',
        'Build interactive web features'
      ],
      skillsYouWillLearn: [
        'JavaScript Syntax',
        'DOM Manipulation',
        'Event Handling',
        'Async/Await and Promises'
      ],
      isOfficial: true,
      isPublished: true,
      featured: true,
      createdBy: systemUser._id
    },
    {
      title: 'Data Structures Mastery',
      description: 'Deep dive into essential data structures and their implementations',
      category: 'data-structures',
      difficulty: 'intermediate',
      language: 'multi-language',
      icon: '📊',
      tags: ['data-structures', 'algorithms', 'intermediate'],
      learningObjectives: [
        'Implement fundamental data structures',
        'Understand time and space complexity',
        'Choose appropriate data structures for problems',
        'Optimize code using efficient data structures'
      ],
      skillsYouWillLearn: [
        'Arrays and Linked Lists',
        'Stacks and Queues',
        'Trees and Graphs',
        'Hash Tables'
      ],
      isOfficial: true,
      isPublished: true,
      featured: true,
      createdBy: systemUser._id
    },
    {
      title: 'Algorithm Problem Solving',
      description: 'Master common algorithm patterns and problem-solving techniques',
      category: 'algorithms',
      difficulty: 'intermediate',
      language: 'multi-language',
      icon: '🧩',
      tags: ['algorithms', 'problem-solving', 'intermediate'],
      learningObjectives: [
        'Recognize common algorithm patterns',
        'Apply different algorithmic techniques',
        'Optimize solution efficiency',
        'Solve complex coding challenges'
      ],
      skillsYouWillLearn: [
        'Two Pointers',
        'Sliding Window',
        'Dynamic Programming',
        'Divide and Conquer'
      ],
      isOfficial: true,
      isPublished: true,
      featured: true,
      createdBy: systemUser._id
    },
    {
      title: 'Technical Interview Prep',
      description: 'Prepare for coding interviews at top tech companies',
      category: 'career-prep',
      difficulty: 'advanced',
      language: 'multi-language',
      icon: '💼',
      tags: ['interview', 'career', 'advanced'],
      learningObjectives: [
        'Solve interview-style coding problems',
        'Communicate solutions effectively',
        'Optimize for time and space complexity',
        'Handle behavioral questions'
      ],
      skillsYouWillLearn: [
        'Coding Interview Patterns',
        'System Design Basics',
        'Problem-Solving Strategies',
        'Communication Skills'
      ],
      isOfficial: true,
      isPublished: true,
      featured: true,
      createdBy: systemUser._id
    }
  ];
  
  for (const path of defaultPaths) {
    await this.findOneAndUpdate(
      { title: path.title },
      path,
      { upsert: true, new: true }
    );
  }
  
  console.log('Default learning paths created');
};

const LearningPath = mongoose.model('LearningPath', learningPathSchema);

module.exports = LearningPath;
