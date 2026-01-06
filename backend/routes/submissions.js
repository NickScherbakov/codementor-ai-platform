const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Challenge = require('../models/Challenge');
const Progress = require('../models/Progress');
const Achievement = require('../models/Achievement');
const { authenticate } = require('../middleware/auth');
const { validateSubmission } = require('../middleware/validation');
const axios = require('axios');

// Submit code for a challenge
router.post('/', authenticate, validateSubmission, async (req, res) => {
  try {
    const { challenge: challengeId, code, language } = req.body;

    // Get the challenge
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Count user's attempts for this challenge
    const attemptNumber = await Submission.countDocuments({
      user: req.user.id,
      challenge: challengeId
    }) + 1;

    // Create submission
    const submission = new Submission({
      user: req.user.id,
      challenge: challengeId,
      code,
      language,
      attemptNumber,
      status: 'pending'
    });

    await submission.save();

    // Execute code asynchronously
    executeCode(submission, challenge)
      .then(async (result) => {
        // Update submission with results
        submission.testResults = result.testResults;
        submission.status = result.status;
        submission.executionStats = result.executionStats;
        
        // Calculate XP if passed
        if (submission.hasPassed()) {
          submission.calculateXP(challenge.xpReward);
          
          // Update user progress
          const userProgress = await Progress.findOne({ user: req.user.id });
          if (userProgress) {
            await userProgress.completeChallenge(
              challengeId,
              submission.score,
              attemptNumber,
              submission.timeTaken || 0,
              submission.xpEarned
            );
            
            // Check for new achievements
            const newAchievements = await Achievement.checkUserAchievements(
              req.user.id,
              userProgress
            );
            
            if (newAchievements.length > 0) {
              submission.achievements = newAchievements.map(a => a._id);
              
              // Add achievements to user progress
              for (const achievement of newAchievements) {
                userProgress.achievements.push({
                  achievement: achievement._id,
                  unlockedAt: new Date()
                });
                
                // Add XP reward from achievement
                await userProgress.addXP(achievement.rewards.xp);
              }
              
              await userProgress.save();
            }
          }
          
          // Update challenge statistics
          await challenge.updateStatistics(
            true,
            attemptNumber,
            submission.timeTaken
          );
        } else {
          await challenge.updateStatistics(
            false,
            attemptNumber,
            submission.timeTaken
          );
        }
        
        await submission.save();
      })
      .catch(async (error) => {
        console.error('Code execution error:', error);
        submission.status = 'error';
        await submission.save();
      });

    // Return immediate response
    res.status(202).json({
      success: true,
      message: 'Submission received and being processed',
      data: {
        submissionId: submission._id,
        status: 'pending',
        attemptNumber
      }
    });

  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create submission',
      message: error.message
    });
  }
});

// Get submission status and results
router.get('/:id', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('challenge', 'title difficulty xpReward')
      .populate('achievements', 'title icon rarity');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Check ownership
    if (submission.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this submission'
      });
    }

    res.json({
      success: true,
      data: submission
    });
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission'
    });
  }
});

// Get user's submissions for a challenge
router.get('/challenge/:challengeId/my-submissions', authenticate, async (req, res) => {
  try {
    const submissions = await Submission.find({
      user: req.user.id,
      challenge: req.params.challengeId
    })
      .sort({ attemptNumber: -1 })
      .select('-code')
      .limit(20);

    res.json({
      success: true,
      data: submissions
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions'
    });
  }
});

// Get user's best submission for a challenge
router.get('/challenge/:challengeId/best', authenticate, async (req, res) => {
  try {
    const bestSubmission = await Submission.getUserBestSubmission(
      req.user.id,
      req.params.challengeId
    );

    if (!bestSubmission) {
      return res.status(404).json({
        success: false,
        error: 'No submissions found for this challenge'
      });
    }

    res.json({
      success: true,
      data: bestSubmission
    });
  } catch (error) {
    console.error('Error fetching best submission:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch best submission'
    });
  }
});

// Get challenge leaderboard
router.get('/challenge/:challengeId/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const leaderboard = await Submission.getChallengeLeaderboard(
      req.params.challengeId,
      parseInt(limit)
    );

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

// Get user's submission history (all challenges)
router.get('/my-submissions', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { user: req.user.id };
    if (status) query.status = status;

    const skip = (page - 1) * limit;
    const total = await Submission.countDocuments(query);

    const submissions = await Submission.find(query)
      .populate('challenge', 'title difficulty category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-code');

    res.json({
      success: true,
      data: {
        submissions,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching submission history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch submission history'
    });
  }
});

// Request AI review for a submission
router.post('/:id/ai-review', authenticate, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('challenge');

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: 'Submission not found'
      });
    }

    // Check ownership
    if (submission.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized'
      });
    }

    // Check if already reviewed
    if (submission.aiReview.reviewed) {
      return res.json({
        success: true,
        data: submission.aiReview
      });
    }

    // Call AI engine for code review
    try {
      const aiEngineUrl = process.env.AI_ENGINE_URL || 'http://localhost:5000';
      const response = await axios.post(`${aiEngineUrl}/code/analyze`, {
        code: submission.code,
        language: submission.language,
        challengeContext: {
          title: submission.challenge.title,
          description: submission.challenge.description,
          difficulty: submission.challenge.difficulty
        }
      });

      const aiAnalysis = response.data;

      // Update submission with AI review
      submission.aiReview = {
        reviewed: true,
        feedback: aiAnalysis.feedback || aiAnalysis.ai_analysis,
        strengths: aiAnalysis.strengths || [],
        improvements: aiAnalysis.improvements || aiAnalysis.suggestions || [],
        learningResources: aiAnalysis.learningResources || []
      };

      await submission.save();

      res.json({
        success: true,
        data: submission.aiReview
      });
    } catch (aiError) {
      console.error('AI review error:', aiError);
      res.status(500).json({
        success: false,
        error: 'AI review failed',
        message: 'Unable to generate AI review at this time'
      });
    }
  } catch (error) {
    console.error('Error requesting AI review:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to request AI review'
    });
  }
});

// Helper function to execute code
async function executeCode(submission, challenge) {
  try {
    // For now, use a simple test runner
    // In production, this should use Judge0 or similar sandboxed execution
    const testResults = [];
    let passedTests = 0;
    let totalTime = 0;
    let maxMemory = 0;

    for (let i = 0; i < challenge.testCases.length; i++) {
      const testCase = challenge.testCases[i];
      
      try {
        // Simulate code execution
        // In production, send to Judge0 API or code execution service
        const result = await simulateExecution(
          submission.code,
          submission.language,
          testCase.input,
          testCase.expectedOutput,
          challenge.constraints
        );

        testResults.push({
          testCaseIndex: i,
          passed: result.passed,
          actualOutput: result.output,
          expectedOutput: testCase.expectedOutput,
          executionTime: result.executionTime,
          memoryUsed: result.memoryUsed,
          error: result.error
        });

        if (result.passed) passedTests++;
        totalTime += result.executionTime;
        maxMemory = Math.max(maxMemory, result.memoryUsed);

      } catch (error) {
        testResults.push({
          testCaseIndex: i,
          passed: false,
          actualOutput: '',
          expectedOutput: testCase.expectedOutput,
          executionTime: 0,
          memoryUsed: 0,
          error: error.message
        });
      }
    }

    const allPassed = passedTests === challenge.testCases.length;
    const score = Math.round((passedTests / challenge.testCases.length) * 100);

    return {
      testResults,
      status: allPassed ? 'passed' : (score >= 70 ? 'passed' : 'failed'),
      executionStats: {
        totalTime,
        averageTime: totalTime / challenge.testCases.length,
        maxMemory,
        averageMemory: maxMemory / 2 // Simplified
      }
    };
  } catch (error) {
    console.error('Execution error:', error);
    return {
      testResults: [],
      status: 'error',
      executionStats: {
        totalTime: 0,
        averageTime: 0,
        maxMemory: 0,
        averageMemory: 0
      }
    };
  }
}

// Simulate code execution (placeholder for actual execution service)
async function simulateExecution(code, language, input, expectedOutput, constraints) {
  // This is a placeholder - in production, integrate with Judge0 or similar
  // For now, return mock results
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate random success/failure for testing
      const passed = Math.random() > 0.3;
      
      resolve({
        passed,
        output: passed ? expectedOutput : 'Wrong output',
        executionTime: Math.random() * 1000,
        memoryUsed: Math.random() * 1024 * 1024,
        error: passed ? null : 'Output mismatch'
      });
    }, 500);
  });
}

module.exports = router;
