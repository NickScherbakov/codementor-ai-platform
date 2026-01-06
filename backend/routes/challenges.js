const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const { authenticate } = require('../middleware/auth');
const { validateChallenge } = require('../middleware/validation');

// Get all challenges with filters
router.get('/', async (req, res) => {
  try {
    const {
      difficulty,
      category,
      language,
      tags,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const query = { isPublished: true };

    // Apply filters
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    if (language) query.languages = language;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Challenge.countDocuments(query);

    const challenges = await Challenge.find(query)
      .select('-solution -testCases')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('createdBy', 'username avatar');

    res.json({
      success: true,
      data: {
        challenges,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenges',
      message: error.message
    });
  }
});

// Get featured challenges
router.get('/featured', async (req, res) => {
  try {
    const challenges = await Challenge.find({
      isPublished: true,
      featured: true
    })
      .select('-solution -testCases')
      .sort({ 'statistics.successRate': 1 })
      .limit(10)
      .populate('createdBy', 'username avatar');

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Error fetching featured challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured challenges'
    });
  }
});

// Get recommended challenges for authenticated user
router.get('/recommended', authenticate, async (req, res) => {
  try {
    const Progress = require('../models/Progress');
    
    const userProgress = await Progress.findOne({ user: req.user.id });
    
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    const completedIds = userProgress.completedChallenges.map(c => c.challenge);
    const userLevel = userProgress.preferences.difficultyLevel || 'beginner';

    const challenges = await Challenge.getRecommended(userLevel, completedIds, 10);

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Error fetching recommended challenges:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommended challenges'
    });
  }
});

// Get a single challenge by ID
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .select('-solution') // Don't expose solution to users
      .populate('createdBy', 'username avatar')
      .populate('prerequisites', 'title difficulty');

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Only show published challenges unless user is admin or creator
    if (!challenge.isPublished && 
        (!req.user || (req.user.id !== challenge.createdBy._id.toString() && !req.user.isAdmin))) {
      return res.status(403).json({
        success: false,
        error: 'Challenge not published'
      });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch challenge'
    });
  }
});

// Get starter code for a challenge
router.get('/:id/starter-code/:language', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    const starterCode = challenge.starterCode.get(req.params.language);

    if (!starterCode) {
      return res.status(404).json({
        success: false,
        error: 'Starter code not available for this language'
      });
    }

    res.json({
      success: true,
      data: {
        language: req.params.language,
        code: starterCode
      }
    });
  } catch (error) {
    console.error('Error fetching starter code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch starter code'
    });
  }
});

// Get hints for a challenge (requires authentication)
router.get('/:id/hints', authenticate, async (req, res) => {
  try {
    const Submission = require('../models/Submission');
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Count user's attempts
    const attempts = await Submission.countDocuments({
      user: req.user.id,
      challenge: req.params.id
    });

    // Filter hints based on attempts
    const availableHints = challenge.hints
      .filter(hint => hint.unlockedAfterAttempts <= attempts)
      .sort((a, b) => a.order - b.order);

    res.json({
      success: true,
      data: {
        hints: availableHints,
        totalHints: challenge.hints.length,
        unlockedHints: availableHints.length,
        attempts
      }
    });
  } catch (error) {
    console.error('Error fetching hints:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch hints'
    });
  }
});

// Create a new challenge (requires authentication)
router.post('/', authenticate, validateChallenge, async (req, res) => {
  try {
    const challengeData = {
      ...req.body,
      createdBy: req.user.id,
      isCommunityGenerated: !req.user.isAdmin
    };

    const challenge = new Challenge(challengeData);
    await challenge.save();

    res.status(201).json({
      success: true,
      data: challenge,
      message: 'Challenge created successfully'
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create challenge',
      message: error.message
    });
  }
});

// Update a challenge (requires authentication and ownership)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check ownership or admin
    if (challenge.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this challenge'
      });
    }

    Object.assign(challenge, req.body);
    await challenge.save();

    res.json({
      success: true,
      data: challenge,
      message: 'Challenge updated successfully'
    });
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update challenge'
    });
  }
});

// Delete a challenge (requires authentication and ownership)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check ownership or admin
    if (challenge.createdBy.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this challenge'
      });
    }

    await challenge.deleteOne();

    res.json({
      success: true,
      message: 'Challenge deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete challenge'
    });
  }
});

// Vote on a challenge
router.post('/:id/vote', authenticate, async (req, res) => {
  try {
    const { vote } = req.body; // 'up' or 'down'
    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    if (vote === 'up') {
      challenge.votes.upvotes += 1;
    } else if (vote === 'down') {
      challenge.votes.downvotes += 1;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Invalid vote type'
      });
    }

    await challenge.save();

    res.json({
      success: true,
      data: {
        upvotes: challenge.votes.upvotes,
        downvotes: challenge.votes.downvotes
      }
    });
  } catch (error) {
    console.error('Error voting on challenge:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to vote on challenge'
    });
  }
});

module.exports = router;
