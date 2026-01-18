// Assessment routes for backend API
const express = require('express');
const router = express.Router();
const axios = require('axios');

// AI Engine base URL
const AI_ENGINE_URL = process.env.AI_ENGINE_URL || 'http://localhost:5000';

/**
 * @route   POST /api/assessment/code-test/start
 * @desc    Start a timed coding test
 * @access  Public (would be protected in production)
 */
router.post('/code-test/start', async (req, res) => {
  try {
    const { userId, level, topic } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    // Call AI Engine
    const response = await axios.post(`${AI_ENGINE_URL}/assess/code-test/start`, {
      user_id: userId,
      level: level || 'junior',
      topic: topic || 'arrays'
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Start code test error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to start code test'
    });
  }
});

/**
 * @route   POST /api/assessment/code-test/submit
 * @desc    Submit code for testing
 * @access  Public
 */
router.post('/code-test/submit', async (req, res) => {
  try {
    const { sessionId, code, language } = req.body;

    if (!sessionId || !code) {
      return res.status(400).json({
        success: false,
        error: 'sessionId and code are required'
      });
    }

    const response = await axios.post(`${AI_ENGINE_URL}/assess/code-test/submit`, {
      session_id: sessionId,
      code: code,
      language: language || 'python'
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Submit code test error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to submit code test'
    });
  }
});

/**
 * @route   POST /api/assessment/interview/start
 * @desc    Start mock interview
 * @access  Public
 */
router.post('/interview/start', async (req, res) => {
  try {
    const { userId, level } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId is required'
      });
    }

    const response = await axios.post(`${AI_ENGINE_URL}/assess/interview/start`, {
      user_id: userId,
      level: level || 'junior'
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to start interview'
    });
  }
});

/**
 * @route   POST /api/assessment/interview/answer
 * @desc    Submit interview answer
 * @access  Public
 */
router.post('/interview/answer', async (req, res) => {
  try {
    const { sessionId, questionId, answer } = req.body;

    if (!sessionId || !questionId || !answer) {
      return res.status(400).json({
        success: false,
        error: 'sessionId, questionId, and answer are required'
      });
    }

    const response = await axios.post(`${AI_ENGINE_URL}/assess/interview/answer`, {
      session_id: sessionId,
      question_id: questionId,
      answer: answer
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Submit interview answer error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to submit answer'
    });
  }
});

/**
 * @route   POST /api/assessment/interview/complete
 * @desc    Complete interview and get report
 * @access  Public
 */
router.post('/interview/complete', async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'sessionId is required'
      });
    }

    const response = await axios.post(`${AI_ENGINE_URL}/assess/interview/complete`, {
      session_id: sessionId
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Complete interview error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to complete interview'
    });
  }
});

/**
 * @route   GET /api/assessment/report/:userId
 * @desc    Get comprehensive assessment report for user
 * @access  Public
 */
router.get('/report/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const response = await axios.get(`${AI_ENGINE_URL}/assess/report/${userId}`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Get assessment report error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to get report'
    });
  }
});

/**
 * @route   POST /api/assessment/evolution/trigger
 * @desc    Trigger self-evolution cycle
 * @access  Admin only (would add auth middleware in production)
 */
router.post('/evolution/trigger', async (req, res) => {
  try {
    const { analytics } = req.body;

    const response = await axios.post(`${AI_ENGINE_URL}/evolution/evolve`, {
      analytics: analytics || {}
    });

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Trigger evolution error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to trigger evolution'
    });
  }
});

/**
 * @route   GET /api/assessment/evolution/status
 * @desc    Get evolution status
 * @access  Admin only
 */
router.get('/evolution/status', async (req, res) => {
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/evolution/status`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Get evolution status error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to get evolution status'
    });
  }
});

/**
 * @route   GET /api/assessment/gcp/status
 * @desc    Get GCP credits and integration status
 * @access  Admin only
 */
router.get('/gcp/status', async (req, res) => {
  try {
    const response = await axios.get(`${AI_ENGINE_URL}/gcp/status`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Get GCP status error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to get GCP status'
    });
  }
});

/**
 * @route   POST /api/assessment/migration/local
 * @desc    Migrate from GCP to local Ollama
 * @access  Admin only
 */
router.post('/migration/local', async (req, res) => {
  try {
    const response = await axios.post(`${AI_ENGINE_URL}/evolution/migrate`);

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.error || 'Failed to migrate to local'
    });
  }
});

module.exports = router;
