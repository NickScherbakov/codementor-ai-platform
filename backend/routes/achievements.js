const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const Progress = require('../models/Progress');
const { authenticate, isAdmin } = require('../middleware/auth');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const { category, rarity, showHidden = false } = req.query;

    const query = {};
    if (category) query.category = category;
    if (rarity) query.rarity = rarity;
    if (!showHidden) query.isHidden = false;

    const achievements = await Achievement.find(query)
      .sort({ category: 1, order: 1 });

    res.json({
      success: true,
      data: achievements
    });
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievements'
    });
  }
});

// Get achievement by ID
router.get('/:id', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: achievement
    });
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement'
    });
  }
});

// Get user's unlocked achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.params.userId })
      .populate({
        path: 'achievements.achievement',
        select: 'title description icon category rarity rewards'
      })
      .select('achievements');

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    res.json({
      success: true,
      data: progress.achievements
    });
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user achievements'
    });
  }
});

// Get current user's unlocked achievements
router.get('/me/unlocked', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id })
      .populate({
        path: 'achievements.achievement',
        select: 'title description icon category rarity rewards'
      })
      .select('achievements');

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    res.json({
      success: true,
      data: progress.achievements
    });
  } catch (error) {
    console.error('Error fetching unlocked achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch unlocked achievements'
    });
  }
});

// Check for new achievements (internal use - called after actions)
router.post('/check', authenticate, async (req, res) => {
  try {
    const progress = await Progress.findOne({ user: req.user.id });

    if (!progress) {
      return res.status(404).json({
        success: false,
        error: 'Progress not found'
      });
    }

    const newAchievements = await Achievement.checkUserAchievements(
      req.user.id,
      progress
    );

    if (newAchievements.length > 0) {
      // Add achievements to progress
      for (const achievement of newAchievements) {
        progress.achievements.push({
          achievement: achievement._id,
          unlockedAt: new Date()
        });

        // Update achievement statistics
        achievement.statistics.totalUnlocked += 1;
        await achievement.save();

        // Award XP
        await progress.addXP(achievement.rewards.xp);
      }

      await progress.save();

      res.json({
        success: true,
        data: {
          newAchievements,
          message: `Unlocked ${newAchievements.length} new achievement(s)!`
        }
      });
    } else {
      res.json({
        success: true,
        data: {
          newAchievements: [],
          message: 'No new achievements unlocked'
        }
      });
    }
  } catch (error) {
    console.error('Error checking achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check achievements'
    });
  }
});

// Get achievement statistics
router.get('/:id/statistics', async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    // Calculate unlock rate
    const totalUsers = await Progress.countDocuments();
    achievement.statistics.unlockRate = totalUsers > 0
      ? (achievement.statistics.totalUnlocked / totalUsers) * 100
      : 0;

    await achievement.save();

    res.json({
      success: true,
      data: {
        totalUnlocked: achievement.statistics.totalUnlocked,
        unlockRate: achievement.statistics.unlockRate.toFixed(2) + '%',
        rarity: achievement.rarity
      }
    });
  } catch (error) {
    console.error('Error fetching achievement statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch achievement statistics'
    });
  }
});

// Create achievement (admin only)
router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();

    res.status(201).json({
      success: true,
      data: achievement,
      message: 'Achievement created successfully'
    });
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create achievement',
      message: error.message
    });
  }
});

// Update achievement (admin only)
router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      data: achievement,
      message: 'Achievement updated successfully'
    });
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update achievement'
    });
  }
});

// Delete achievement (admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({
        success: false,
        error: 'Achievement not found'
      });
    }

    res.json({
      success: true,
      message: 'Achievement deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete achievement'
    });
  }
});

// Initialize default achievements (admin only)
router.post('/initialize-defaults', authenticate, isAdmin, async (req, res) => {
  try {
    await Achievement.createDefaults();

    res.json({
      success: true,
      message: 'Default achievements initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize achievements'
    });
  }
});

// Get achievement categories
router.get('/meta/categories', async (req, res) => {
  try {
    const categories = await Achievement.distinct('category');

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// Get rarest achievements
router.get('/meta/rarest', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const rarestAchievements = await Achievement.find({ isHidden: false })
      .sort({ 'statistics.unlockRate': 1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: rarestAchievements
    });
  } catch (error) {
    console.error('Error fetching rarest achievements:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rarest achievements'
    });
  }
});

module.exports = router;
