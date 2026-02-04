const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');
const Challenge = require('../models/Challenge');
const Submission = require('../models/Submission');

// AI Engine URL from environment
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:5000';

/**
 * Generate contextual hints based on user's code attempt
 * POST /api/ai-hints/generate
 */
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { challengeId, code, language, errorMessage } = req.body;

    if (!challengeId || !code) {
      return res.status(400).json({
        success: false,
        error: 'Challenge ID and code are required'
      });
    }

    // Fetch challenge details
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Count previous attempts
    const attempts = await Submission.countDocuments({
      user: req.user.id,
      challenge: challengeId
    });

    // Prepare context for AI
    const context = {
      challengeTitle: challenge.title,
      challengeDescription: challenge.description,
      difficulty: challenge.difficulty,
      userCode: code,
      language: language || 'python',
      errorMessage: errorMessage || null,
      attempts: attempts,
      learningObjectives: challenge.learningObjectives
    };

    // Call AI engine for intelligent hint generation
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/generate-hint`, context, {
      timeout: 10000
    });

    const hints = aiResponse.data.hints || [];

    res.json({
      success: true,
      data: {
        hints: hints.map((hint, index) => ({
          level: hint.level || (index === 0 ? 'gentle' : index === 1 ? 'moderate' : 'direct'),
          content: hint.content,
          codeSnippet: hint.codeSnippet || null,
          resources: hint.resources || []
        })),
        nextSteps: aiResponse.data.nextSteps || [],
        attempts
      }
    });
  } catch (error) {
    console.error('Error generating AI hints:', error);
    
    // Fallback to static hints if AI engine is unavailable
    if (error.code === 'ECONNREFUSED' || error.response?.status >= 500) {
      return res.json({
        success: true,
        data: {
          hints: [
            {
              level: 'gentle',
              content: 'Think about breaking down the problem into smaller steps. What is the first thing you need to do?',
              codeSnippet: null,
              resources: []
            },
            {
              level: 'moderate',
              content: 'Consider the data structures that would be most efficient for this problem. Arrays? Hash maps? Trees?',
              codeSnippet: null,
              resources: []
            }
          ],
          nextSteps: ['Review the problem statement carefully', 'Test your code with simple examples'],
          attempts: 0,
          fallback: true
        }
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate hints',
      message: error.message
    });
  }
});

/**
 * Explain code in simple terms (ELI5 mode)
 * POST /api/ai-hints/explain
 */
router.post('/explain', authenticate, async (req, res) => {
  try {
    const { code, language, mode } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: 'Code is required'
      });
    }

    const explanationMode = mode || 'eli5'; // eli5, technical, beginner, advanced

    // Call AI engine for code explanation
    const aiResponse = await axios.post(`${AI_ENGINE_URL}/api/explain-code`, {
      code,
      language: language || 'python',
      mode: explanationMode
    }, {
      timeout: 15000
    });

    res.json({
      success: true,
      data: {
        explanation: aiResponse.data.explanation,
        keyPoints: aiResponse.data.keyPoints || [],
        complexity: aiResponse.data.complexity || {},
        improvements: aiResponse.data.improvements || [],
        mode: explanationMode
      }
    });
  } catch (error) {
    console.error('Error explaining code:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to explain code',
      message: error.message
    });
  }
});

/**
 * Get learning path suggestions based on skill gaps
 * GET /api/ai-hints/skill-gaps
 */
router.get('/skill-gaps', authenticate, async (req, res) => {
  try {
    const Progress = require('../models/Progress');
    
    // Fetch user progress
    const userProgress = await Progress.findOne({ user: req.user.id });
    if (!userProgress) {
      return res.status(404).json({
        success: false,
        error: 'User progress not found'
      });
    }

    // Fetch user's submissions to analyze patterns
    const submissions = await Submission.find({ user: req.user.id })
      .populate('challenge', 'category difficulty tags')
      .sort({ createdAt: -1 })
      .limit(50);

    // Analyze skill gaps
    const categoryPerformance = {};
    const difficultyPerformance = {};

    submissions.forEach(sub => {
      if (!sub.challenge) return;

      const category = sub.challenge.category;
      const difficulty = sub.challenge.difficulty;

      if (!categoryPerformance[category]) {
        categoryPerformance[category] = { total: 0, passed: 0 };
      }
      if (!difficultyPerformance[difficulty]) {
        difficultyPerformance[difficulty] = { total: 0, passed: 0 };
      }

      categoryPerformance[category].total++;
      difficultyPerformance[difficulty].total++;

      if (sub.status === 'passed') {
        categoryPerformance[category].passed++;
        difficultyPerformance[difficulty].passed++;
      }
    });

    // Calculate success rates
    const weakCategories = Object.entries(categoryPerformance)
      .map(([category, stats]) => ({
        category,
        successRate: stats.total > 0 ? (stats.passed / stats.total) * 100 : 0,
        attempts: stats.total
      }))
      .filter(item => item.attempts >= 3)
      .filter(item => item.successRate < 60)
      .sort((a, b) => a.successRate - b.successRate);

    // Find recommended challenges for weak areas
    const recommendations = [];
    for (const weak of weakCategories.slice(0, 3)) {
      const challenges = await Challenge.find({
        category: weak.category,
        difficulty: { $in: ['beginner', 'intermediate'] },
        isPublished: true,
        _id: { $nin: userProgress.completedChallenges.map(c => c.challenge) }
      })
      .select('title difficulty category estimatedTime')
      .limit(3);

      recommendations.push({
        category: weak.category,
        successRate: weak.successRate,
        recommendedChallenges: challenges
      });
    }

    res.json({
      success: true,
      data: {
        skillGaps: weakCategories,
        recommendations,
        overallStats: {
          totalChallenges: submissions.length,
          passRate: submissions.length > 0 
            ? (submissions.filter(s => s.status === 'passed').length / submissions.length) * 100 
            : 0,
          strongestCategory: Object.entries(categoryPerformance)
            .map(([category, stats]) => ({
              category,
              successRate: stats.total > 0 ? (stats.passed / stats.total) * 100 : 0
            }))
            .sort((a, b) => b.successRate - a.successRate)[0]
        }
      }
    });
  } catch (error) {
    console.error('Error analyzing skill gaps:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze skill gaps',
      message: error.message
    });
  }
});

module.exports = router;
