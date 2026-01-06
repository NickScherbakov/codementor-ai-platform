const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const { authenticate } = require('../middleware/auth');

// Get current user's progress
router.get('/me', authenticate, async (req, res) => {
  try {
    let progress = await Progress.findOne({ user: req.user.id })
      .populate('completedChallenges.challenge', 'title difficulty category')
      .populate('inProgressChallenges.challenge', 'title difficulty category')
      .populate('learningPath.current', 'title icon')
      .populate('achievements.achievement', 'title icon rarity');

    // Create progress if it doesn't exist
    if (!progress) {
      progress = new Progress({
        user: req.user.id
      });
      await progress.save();
    }

    // Reset daily goals if needed
    await progress.resetDailyGoals();

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch progress'
    });
  }
});

// Get user progress by ID (public)
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.params.userId })
      .populate('user', 'username avatar')
      .select('-dailyGoals -preferences');

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error fetching user progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user progress'
    });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 100, type = 'xp' } = req.query;

    let leaderboard;
    
    if (type === 'xp') {
      leaderboard = await Progress.getLeaderboard(parseInt(limit));
    } else if (type === 'streak') {
      leaderboard = await Progress.find()
        .sort({ 'streak.current': -1 })
        .limit(parseInt(limit))
        .populate('user', 'username avatar')
        .select('user totalXP level rank streak.current');
    } else if (type === 'level') {
      leaderboard = await Progress.find()
        .sort({ level: -1, totalXP: -1 })
        .limit(parseInt(limit))
        .populate('user', 'username avatar')
        .select('user totalXP level rank streak.current');
    }

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch leaderboard'
    });
  }
});

// Get user's rank
router.get('/me/rank', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    // Count users with more XP
    const rank = await Progress.countDocuments({
      totalXP: { $gt: progress.totalXP }
    }) + 1;

    // Get total users
    const totalUsers = await Progress.countDocuments();

    res.json({
      success: true,
      data: {
        rank,
        totalUsers,
        percentile: Math.round((1 - (rank / totalUsers)) * 100)
      }
    });
  } catch (error) {
    console.error('Error fetching rank:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rank'
    });
  }
});

// Update user preferences
router.put('/me/preferences', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    const { preferredLanguages, difficultyLevel, learningStyle, aiTutorPersonality } = req.body;

    if (preferredLanguages) progress.preferences.preferredLanguages = preferredLanguages;
    if (difficultyLevel) progress.preferences.difficultyLevel = difficultyLevel;
    if (learningStyle) progress.preferences.learningStyle = learningStyle;
    if (aiTutorPersonality) progress.preferences.aiTutorPersonality = aiTutorPersonality;

    await progress.save();

    res.json({
      success: true,
      data: progress.preferences,
      message: 'Preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences'
    });
  }
});

// Update daily goals
router.put('/me/daily-goals', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    const { challengesGoal, xpGoal } = req.body;

    if (challengesGoal) {
      progress.dailyGoals.challengesGoal = Math.max(1, Math.min(10, challengesGoal));
    }
    if (xpGoal) {
      progress.dailyGoals.xpGoal = Math.max(10, Math.min(1000, xpGoal));
    }

    await progress.save();

    res.json({
      success: true,
      data: progress.dailyGoals,
      message: 'Daily goals updated successfully'
    });
  } catch (error) {
    console.error('Error updating daily goals:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update daily goals'
    });
  }
});

// Get skill breakdown
router.get('/me/skills', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: {
        skills: progress.skills,
        categoryProgress: Object.fromEntries(progress.statistics.categoryProgress),
        languageUsage: Object.fromEntries(progress.statistics.languageUsage)
      }
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch skills'
    });
  }
});

// Get statistics
router.get('/me/statistics', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: {
        level: progress.level,
        totalXP: progress.totalXP,
        rank: progress.rank,
        statistics: progress.statistics,
        streak: progress.streak,
        completedChallenges: progress.completedChallenges.length,
        inProgressChallenges: progress.inProgressChallenges.length,
        achievements: progress.achievements.length
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
});

// Mark challenge as in progress
router.post('/challenge/:challengeId/start', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    const challengeId = req.params.challengeId;

    // Check if already completed
    const isCompleted = progress.completedChallenges.some(
      c => c.challenge.toString() === challengeId
    );

    if (isCompleted) {
      return res.json({
        success: true,
        message: 'Challenge already completed'
      });
    }

    // Check if already in progress
    const isInProgress = progress.inProgressChallenges.some(
      c => c.challenge.toString() === challengeId
    );

    if (!isInProgress) {
      progress.inProgressChallenges.push({
        challenge: challengeId,
        startedAt: new Date(),
        attempts: 0
      });

      progress.statistics.totalChallengesAttempted += 1;
      await progress.save();
    }

    res.json({
      success: true,
      message: 'Challenge marked as in progress'
    });
  } catch (error) {
    console.error('Error starting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to start challenge'
    });
  }
});

// Get achievement progress
router.get('/me/achievements/progress', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });
    const allAchievements = await Achievement.find({ isHidden: false })
      .sort({ category: 1, order: 1 });

    const achievementProgress = allAchievements.map(achievement => {
      const unlocked = progress.achievements.find(
        a => a.achievement.toString() === achievement._id.toString()
      );

      return {
        achievement: achievement,
        unlocked: !!unlocked,
        unlockedAt: unlocked?.unlockedAt,
        progress: calculateAchievementProgress(achievement, progress)
      };
    });

    res.json({
      success: true,
      data: achievementProgress
    });
  } catch (error) {
    console.error('Error fetching achievement progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement progress'
    });
  }
});

// Helper function to calculate achievement progress
function calculateAchievementProgress(achievement, userProgress) {
  const { type, target, metric } = achievement.criteria;
  let current = 0;

  switch (type) {
    case 'count':
      if (metric === 'completedChallenges') {
        current = userProgress.statistics.totalChallengesCompleted;
      } else if (metric === 'totalXP') {
        current = userProgress.totalXP;
      } else if (metric === 'level') {
        current = userProgress.level;
      }
      break;

    case 'streak':
      if (metric === 'dailyStreak') {
        current = userProgress.streak.current;
      } else if (metric === 'longestStreak') {
        current = userProgress.streak.longest;
      }
      break;

    case 'score':
      if (metric === 'averageScore') {
        current = userProgress.statistics.averageScore;
      } else if (metric === 'perfectScores') {
        current = userProgress.completedChallenges.filter(
          c => c.bestScore === 100
        ).length;
      }
      break;
  }

  return {
    current,
    target,
    percentage: Math.min(Math.round((current / target) * 100), 100)
  };
}

module.exports = router;
