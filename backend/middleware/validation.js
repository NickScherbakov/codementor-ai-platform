const { body, validationResult } = require('express-validator');

// Validation middleware helper
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors.array()
    });
  }
  
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters'),
  
  validate
];

// User login validation
const validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  validate
];

// Challenge creation/update validation
const validateChallenge = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 5000 })
    .withMessage('Description must be between 20 and 5000 characters'),
  
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level'),
  
  body('category')
    .isIn(['algorithms', 'data-structures', 'web-development', 'databases', 'system-design', 'object-oriented', 'functional-programming', 'debugging', 'refactoring'])
    .withMessage('Invalid category'),
  
  body('languages')
    .isArray({ min: 1 })
    .withMessage('At least one programming language is required'),
  
  body('testCases')
    .isArray({ min: 1 })
    .withMessage('At least one test case is required'),
  
  body('xpReward')
    .isInt({ min: 10, max: 1000 })
    .withMessage('XP reward must be between 10 and 1000'),
  
  validate
];

// Submission validation
const validateSubmission = [
  body('challenge')
    .notEmpty()
    .withMessage('Challenge ID is required')
    .isMongoId()
    .withMessage('Invalid challenge ID'),
  
  body('code')
    .trim()
    .isLength({ min: 1, max: 100000 })
    .withMessage('Code must be between 1 and 100000 characters'),
  
  body('language')
    .isIn(['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'])
    .withMessage('Invalid programming language'),
  
  validate
];

// Learning path validation
const validateLearningPath = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('category')
    .isIn(['programming-fundamentals', 'web-development', 'data-structures', 'algorithms', 'database', 'system-design', 'career-prep', 'language-specific'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level'),
  
  body('language')
    .isIn(['python', 'javascript', 'typescript', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'multi-language'])
    .withMessage('Invalid programming language'),
  
  body('steps')
    .optional()
    .isArray()
    .withMessage('Steps must be an array'),
  
  validate
];

// Profile update validation
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Full name must be less than 100 characters'),
  
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location must be less than 100 characters'),
  
  body('website')
    .optional()
    .trim()
    .isURL()
    .withMessage('Must be a valid URL'),
  
  body('github')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invalid GitHub username'),
  
  body('linkedin')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Invalid LinkedIn username'),
  
  validate
];

// Comment validation
const validateComment = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Comment must be between 1 and 2000 characters'),
  
  validate
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
  
  validate
];

module.exports = {
  validate,
  validateRegistration,
  validateLogin,
  validateChallenge,
  validateSubmission,
  validateLearningPath,
  validateProfileUpdate,
  validateComment,
  validateReview
};
