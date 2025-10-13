const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().isLength({ min: 1 }),
  body('lastName').trim().isLength({ min: 1 }),
  body('username').trim().isLength({ min: 3 }).isAlphanumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email, password, firstName, lastName, username } = req.body

    // Check if user already exists
    let user = await User.findOne({ 
      $or: [{ email }, { username }] 
    })

    if (user) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email or username'
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new user
    user = new User({
      email,
      username,
      firstName,
      lastName,
      password: hashedPassword,
      preferences: {
        theme: 'system',
        language: 'en',
        preferredProgrammingLanguages: [],
        learningStyle: 'mixed',
        difficulty: 'beginner',
        notifications: {
          email: true,
          push: true,
          achievements: true,
          reminders: true,
          weeklyProgress: true
        }
      },
      progress: {
        totalXP: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        completedChallenges: 0,
        completedProjects: 0,
        languageProgress: [],
        skillProgress: []
      },
      achievements: []
    })

    await user.save()

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: user.preferences,
        progress: user.progress
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    })
  }
})

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: user.preferences,
        progress: user.progress,
        achievements: user.achievements,
        lastLogin: user.lastLogin
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    })
  }
})

// @route   POST /api/auth/refresh
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Generate new token
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    }

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        preferences: user.preferences,
        progress: user.progress,
        achievements: user.achievements
      }
    })

  } catch (error) {
    console.error('Token refresh error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during token refresh'
    })
  }
})

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // In a production environment, you might want to blacklist the token
    // For now, we'll just return success and let the client remove the token
    
    res.json({
      success: true,
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    })
  }
})

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { email } = req.body

    const user = await User.findOne({ email })
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return res.json({
        success: true,
        message: 'If an account with that email exists, a password reset link has been sent'
      })
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user.id, type: 'password_reset' },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1h' }
    )

    // In a real app, you would send an email here
    // For now, we'll just log the reset link
    console.log(`Password reset link for ${email}: http://localhost:3000/reset-password?token=${resetToken}`)

    res.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent',
      // In production, remove this debug info
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    })
  }
})

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', [
  body('token').exists(),
  body('password').isLength({ min: 6 })
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      })
    }

    const { token, password } = req.body

    // Verify reset token
    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      })
    }

    if (decoded.type !== 'password_reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      })
    }

    const user = await User.findById(decoded.userId)
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found'
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update user password
    user.password = hashedPassword
    user.updatedAt = new Date()
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successful'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    })
  }
})

// @route   GET /api/auth/me
// @desc    Get current user info
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('achievements')
      .select('-password')

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImage: user.profileImage,
        preferences: user.preferences,
        progress: user.progress,
        achievements: user.achievements,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        lastLogin: user.lastLogin
      }
    })

  } catch (error) {
    console.error('Get user info error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error retrieving user information'
    })
  }
})

module.exports = router