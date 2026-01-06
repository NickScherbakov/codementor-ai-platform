const express = require('express');
const router = express.Router();
const LearningPath = require('../models/LearningPath');
const Progress = require('../models/Progress');
const { authenticate, isAdmin } = require('../middleware/auth');
const { validateLearningPath, validateReview } = require('../middleware/validation');

// Get all learning paths
router.get('/', async (req, res) => {
  try {
    const {
      category,
      difficulty,
      language,
      featured,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = { isPublished: true };

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (language) query.language = language;
    if (featured === 'true') query.featured = true;

    const skip = (page - 1) * limit;
    const total = await LearningPath.countDocuments(query);

    const paths = await LearningPath.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username avatar')
      .select('-steps.challenge.solution');

    res.json({
      success: true,
      data: {
        paths,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching learning paths:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning paths'
    });
  }
});

// Get featured learning paths
router.get('/featured', async (req, res) => {
  try {
    const paths = await LearningPath.find({
      isPublished: true,
      featured: true
    })
      .sort({ 'statistics.averageRating': -1 })
      .limit(6)
      .populate('createdBy', 'username avatar');

    res.json({
      success: true,
      data: paths
    });
  } catch (error) {
    console.error('Error fetching featured paths:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured paths'
    });
  }
});

// Get recommended learning paths for authenticated user
router.get('/recommended', authenticate, async (req, res) => {
  try {
    const userProgress = await Progress.findOne({ user: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    const userLevel = userProgress.preferences.difficultyLevel || 'beginner';
    const userLanguages = userProgress.preferences.preferredLanguages || [];

    const paths = await LearningPath.getRecommended(userLevel, userLanguages, 10);

    res.json({
      success: true,
      data: paths
    });
  } catch (error) {
    console.error('Error fetching recommended paths:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommended paths'
    });
  }
});

// Get a single learning path by ID
router.get('/:id', async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id)
      .populate('createdBy', 'username avatar')
      .populate('steps.challenge', 'title description difficulty category estimatedTime')
      .populate('prerequisites', 'title icon')
      .populate('nextPaths', 'title icon difficulty');

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    // Get user's progress if authenticated
    let userProgress = null;
    if (req.user) {
      const progress = await Progress.findOne({ user: req.user.id });
      if (progress) {
        const completedIds = progress.completedChallenges.map(c => c.challenge.toString());
        userProgress = path.getUserProgress(completedIds);
      }
    }

    res.json({
      success: true,
      data: {
        ...path.toObject(),
        userProgress
      }
    });
  } catch (error) {
    console.error('Error fetching learning path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch learning path'
    });
  }
});

// Get user's progress on a learning path
router.get('/:id/progress', authenticate, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    const userProgress = await Progress.findOne({ user: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    const completedIds = userProgress.completedChallenges.map(c => c.challenge.toString());
    const pathProgress = path.getUserProgress(completedIds);

    res.json({
      success: true,
      data: pathProgress
    });
  } catch (error) {
    console.error('Error fetching path progress:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch path progress'
    });
  }
});

// Enroll in a learning path
router.post('/:id/enroll', authenticate, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    const userProgress = await Progress.findOne({ user: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    // Check if already enrolled
    if (userProgress.learningPath.current?.toString() === path._id.toString()) {
      return res.json({
        success: true,
        message: 'Already enrolled in this learning path'
      });
    }

    // Enroll in path
    userProgress.learningPath.current = path._id;
    userProgress.learningPath.progress = 0;
    await userProgress.save();

    // Update path statistics
    path.statistics.totalEnrolled += 1;
    await path.save();

    res.json({
      success: true,
      message: 'Enrolled in learning path successfully',
      data: {
        pathId: path._id,
        title: path.title
      }
    });
  } catch (error) {
    console.error('Error enrolling in path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to enroll in path'
    });
  }
});

// Complete a learning path
router.post('/:id/complete', authenticate, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    const userProgress = await Progress.findOne({ user: req.user.id });

    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    // Check if path is actually completed
    const completedIds = userProgress.completedChallenges.map(c => c.challenge.toString());
    const pathProgress = path.getUserProgress(completedIds);

    if (!pathProgress.isCompleted) {
      return res.status(400).json({
        success: false,
        error: 'Learning path not yet completed'
      });
    }

    // Add to completed paths
    if (!userProgress.learningPath.completed.includes(path._id)) {
      userProgress.learningPath.completed.push(path._id);
    }

    // Clear current path if it matches
    if (userProgress.learningPath.current?.toString() === path._id.toString()) {
      userProgress.learningPath.current = null;
      userProgress.learningPath.progress = 0;
    }

    await userProgress.save();

    // Update path statistics
    path.statistics.totalCompleted += 1;
    await path.updateCompletionRate();

    res.json({
      success: true,
      message: 'Learning path completed! 🎉',
      data: {
        pathId: path._id,
        title: path.title
      }
    });
  } catch (error) {
    console.error('Error completing path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to complete path'
    });
  }
});

// Add a review to a learning path
router.post('/:id/review', authenticate, validateReview, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    await path.addReview(req.user.id, rating, comment);

    res.json({
      success: true,
      message: 'Review added successfully',
      data: {
        averageRating: path.statistics.averageRating,
        totalReviews: path.statistics.totalReviews
      }
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add review'
    });
  }
});

// Get reviews for a learning path
router.get('/:id/reviews', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const path = await LearningPath.findById(req.params.id)
      .populate('reviews.user', 'username avatar')
      .select('reviews statistics.averageRating statistics.totalReviews');

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    const skip = (page - 1) * limit;
    const reviews = path.reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      data: {
        reviews,
        statistics: {
          averageRating: path.statistics.averageRating,
          totalReviews: path.statistics.totalReviews
        },
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: path.reviews.length
        }
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews'
    });
  }
});

// Create a new learning path (requires authentication)
router.post('/', authenticate, validateLearningPath, async (req, res) => {
  try {
    const pathData = {
      ...req.body,
      createdBy: req.user.id,
      isOfficial: req.user.isAdmin
    };

    const path = new LearningPath(pathData);
    await path.save();

    res.status(201).json({
      success: true,
      data: path,
      message: 'Learning path created successfully'
    });
  } catch (error) {
    console.error('Error creating learning path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create learning path',
      message: error.message
    });
  }
});

// Update a learning path (requires authentication and ownership)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    // Check ownership or admin
    if (path.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this learning path'
      });
    }

    Object.assign(path, req.body);
    await path.save();

    res.json({
      success: true,
      data: path,
      message: 'Learning path updated successfully'
    });
  } catch (error) {
    console.error('Error updating learning path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update learning path'
    });
  }
});

// Delete a learning path (requires authentication and ownership)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id);

    if (!path) {
      return res.status(404).json({
        success: false,
        error: 'Learning path not found'
      });
    }

    // Check ownership or admin
    if (path.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this learning path'
      });
    }

    await path.deleteOne();

    res.json({
      success: true,
      message: 'Learning path deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting learning path:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete learning path'
    });
  }
});

// Initialize default learning paths (admin only)
router.post('/initialize-defaults', authenticate, isAdmin, async (req, res) => {
  try {
    await LearningPath.createDefaults();

    res.json({
      success: true,
      message: 'Default learning paths initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing learning paths:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize learning paths'
    });
  }
});

module.exports = router;
