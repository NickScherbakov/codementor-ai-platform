const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['challenges', 'skills', 'social', 'streak', 'mastery', 'special'],
    required: true,
    index: true
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  criteria: {
    type: {
      type: String,
      enum: ['count', 'streak', 'score', 'time', 'special'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    metric: {
      type: String,
      required: true
    }
  },
  rewards: {
    xp: {
      type: Number,
      default: 0,
      min: 0
    },
    badge: String,
    title: String, // Special user title
    unlocks: [String] // Features or content unlocked
  },
  isHidden: {
    type: Boolean,
    default: false // Hidden achievements (discovered when unlocked)
  },
  isRepeatable: {
    type: Boolean,
    default: false
  },
  order: {
    type: Number,
    default: 0
  },
  statistics: {
    totalUnlocked: {
      type: Number,
      default: 0
    },
    unlockRate: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes
achievementSchema.index({ category: 1, rarity: 1 });
achievementSchema.index({ order: 1 });

// Virtual for rarity score
achievementSchema.virtual('rarityScore').get(function() {
  const scores = {
    'common': 1,
    'uncommon': 2,
    'rare': 3,
    'epic': 4,
    'legendary': 5
  };
  return scores[this.rarity] || 1;
});

// Method to check if user has unlocked this achievement
achievementSchema.methods.checkUnlock = function(userProgress) {
  const { type, target, metric } = this.criteria;
  
  switch (type) {
    case 'count':
      if (metric === 'completedChallenges') {
        return userProgress.statistics.totalChallengesCompleted >= target;
      } else if (metric === 'totalXP') {
        return userProgress.totalXP >= target;
      } else if (metric === 'level') {
        return userProgress.level >= target;
      }
      break;
      
    case 'streak':
      if (metric === 'dailyStreak') {
        return userProgress.streak.current >= target;
      } else if (metric === 'longestStreak') {
        return userProgress.streak.longest >= target;
      }
      break;
      
    case 'score':
      if (metric === 'averageScore') {
        return userProgress.statistics.averageScore >= target;
      } else if (metric === 'perfectScores') {
        const perfectScores = userProgress.completedChallenges.filter(
          c => c.bestScore === 100
        ).length;
        return perfectScores >= target;
      }
      break;
      
    case 'time':
      if (metric === 'totalTimeSpent') {
        return userProgress.statistics.totalTimeSpent >= target;
      }
      break;
      
    case 'special':
      // Custom logic for special achievements
      return false;
  }
  
  return false;
};

// Static method to create default achievements
achievementSchema.statics.createDefaults = async function() {
  const defaultAchievements = [
    // Challenge Completion
    {
      title: 'First Steps',
      description: 'Complete your first challenge',
      icon: '🎯',
      category: 'challenges',
      rarity: 'common',
      criteria: { type: 'count', target: 1, metric: 'completedChallenges' },
      rewards: { xp: 50, badge: 'first-steps' },
      order: 1
    },
    {
      title: 'Getting Started',
      description: 'Complete 10 challenges',
      icon: '🚀',
      category: 'challenges',
      rarity: 'common',
      criteria: { type: 'count', target: 10, metric: 'completedChallenges' },
      rewards: { xp: 100, badge: 'getting-started' },
      order: 2
    },
    {
      title: 'Challenge Master',
      description: 'Complete 50 challenges',
      icon: '🏆',
      category: 'challenges',
      rarity: 'uncommon',
      criteria: { type: 'count', target: 50, metric: 'completedChallenges' },
      rewards: { xp: 500, badge: 'challenge-master' },
      order: 3
    },
    {
      title: 'Century Club',
      description: 'Complete 100 challenges',
      icon: '💯',
      category: 'challenges',
      rarity: 'rare',
      criteria: { type: 'count', target: 100, metric: 'completedChallenges' },
      rewards: { xp: 1000, badge: 'century-club' },
      order: 4
    },
    
    // Streak Achievements
    {
      title: 'Consistency is Key',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      category: 'streak',
      rarity: 'common',
      criteria: { type: 'streak', target: 7, metric: 'dailyStreak' },
      rewards: { xp: 150, badge: 'week-streak' },
      order: 10
    },
    {
      title: 'Unstoppable',
      description: 'Maintain a 30-day streak',
      icon: '⚡',
      category: 'streak',
      rarity: 'rare',
      criteria: { type: 'streak', target: 30, metric: 'dailyStreak' },
      rewards: { xp: 750, badge: 'month-streak' },
      order: 11
    },
    {
      title: 'Legend',
      description: 'Maintain a 100-day streak',
      icon: '👑',
      category: 'streak',
      rarity: 'legendary',
      criteria: { type: 'streak', target: 100, metric: 'dailyStreak' },
      rewards: { xp: 2500, badge: 'legend-streak', title: 'The Consistent' },
      order: 12
    },
    
    // Perfection Achievements
    {
      title: 'Perfectionist',
      description: 'Get a perfect score on 10 challenges',
      icon: '✨',
      category: 'mastery',
      rarity: 'uncommon',
      criteria: { type: 'score', target: 10, metric: 'perfectScores' },
      rewards: { xp: 300, badge: 'perfectionist' },
      order: 20
    },
    {
      title: 'Flawless Victory',
      description: 'Get a perfect score on 50 challenges',
      icon: '💎',
      category: 'mastery',
      rarity: 'epic',
      criteria: { type: 'score', target: 50, metric: 'perfectScores' },
      rewards: { xp: 1500, badge: 'flawless', title: 'The Perfectionist' },
      order: 21
    },
    
    // Level Achievements
    {
      title: 'Rising Star',
      description: 'Reach level 10',
      icon: '⭐',
      category: 'skills',
      rarity: 'common',
      criteria: { type: 'count', target: 10, metric: 'level' },
      rewards: { xp: 200, badge: 'rising-star' },
      order: 30
    },
    {
      title: 'Elite Coder',
      description: 'Reach level 50',
      icon: '🌟',
      category: 'skills',
      rarity: 'rare',
      criteria: { type: 'count', target: 50, metric: 'level' },
      rewards: { xp: 1000, badge: 'elite-coder' },
      order: 31
    },
    {
      title: 'Grandmaster',
      description: 'Reach level 100',
      icon: '🏅',
      category: 'skills',
      rarity: 'legendary',
      criteria: { type: 'count', target: 100, metric: 'level' },
      rewards: { xp: 5000, badge: 'grandmaster', title: 'Grandmaster' },
      order: 32
    },
    
    // XP Achievements
    {
      title: 'XP Hunter',
      description: 'Earn 1,000 total XP',
      icon: '📈',
      category: 'skills',
      rarity: 'common',
      criteria: { type: 'count', target: 1000, metric: 'totalXP' },
      rewards: { xp: 100, badge: 'xp-hunter' },
      order: 40
    },
    {
      title: 'XP Collector',
      description: 'Earn 10,000 total XP',
      icon: '📊',
      category: 'skills',
      rarity: 'uncommon',
      criteria: { type: 'count', target: 10000, metric: 'totalXP' },
      rewards: { xp: 500, badge: 'xp-collector' },
      order: 41
    },
    {
      title: 'XP Legend',
      description: 'Earn 100,000 total XP',
      icon: '💰',
      category: 'skills',
      rarity: 'epic',
      criteria: { type: 'count', target: 100000, metric: 'totalXP' },
      rewards: { xp: 2000, badge: 'xp-legend', title: 'XP Legend' },
      order: 42
    }
  ];
  
  for (const achievement of defaultAchievements) {
    await this.findOneAndUpdate(
      { title: achievement.title },
      achievement,
      { upsert: true, new: true }
    );
  }
  
  console.log('Default achievements created');
};

// Static method to check all achievements for a user
achievementSchema.statics.checkUserAchievements = async function(userId, userProgress) {
  const achievements = await this.find({ isHidden: false });
  const unlockedAchievements = [];
  
  for (const achievement of achievements) {
    // Check if user already has this achievement
    const hasAchievement = userProgress.achievements.some(
      a => a.achievement.toString() === achievement._id.toString()
    );
    
    if (!hasAchievement && achievement.checkUnlock(userProgress)) {
      unlockedAchievements.push(achievement);
    }
  }
  
  return unlockedAchievements;
};

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
