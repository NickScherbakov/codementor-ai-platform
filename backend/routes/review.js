const express = require('express')
const { generateHardReview } = require('../services/reviewEngine')

const ALLOWED_LANGUAGES = ['python', 'javascript', 'typescript']
const DEFAULT_LIMIT = 3

function createReviewLimiter({ limit = DEFAULT_LIMIT } = {}) {
  const counts = new Map()

  return {
    check(key) {
      const currentCount = counts.get(key) || 0
      if (currentCount >= limit) {
        return { allowed: false, remaining: 0 }
      }
      const nextCount = currentCount + 1
      counts.set(key, nextCount)
      return { allowed: true, remaining: Math.max(0, limit - nextCount) }
    },
    reset() {
      counts.clear()
    }
  }
}

function resolveReviewerKey(req) {
  const headerId = req.header('x-user-id')
  if (headerId && headerId.trim()) {
    return headerId.trim()
  }
  return req.ip || 'anonymous'
}

function validateRequest(body) {
  if (!body) {
    return { ok: false, message: 'Request body is required.' }
  }

  const { language, code, mode } = body

  if (!language || !code || !mode) {
    return { ok: false, message: 'language, code, and mode are required.' }
  }

  if (!ALLOWED_LANGUAGES.includes(language)) {
    return { ok: false, message: 'language must be python, javascript, or typescript.' }
  }

  if (mode !== 'hard') {
    return { ok: false, message: 'mode must be hard.' }
  }

  return { ok: true }
}

function createReviewRouter({ limiter = createReviewLimiter() } = {}) {
  const router = express.Router()

  router.post('/', (req, res) => {
    const key = resolveReviewerKey(req)
    const limitResult = limiter.check(key)

    if (!limitResult.allowed) {
      return res.status(402).json({
        message: 'Free review limit reached. Subscribe to continue.'
      })
    }

    const validation = validateRequest(req.body)
    if (!validation.ok) {
      return res.status(400).json({ message: validation.message })
    }

    const { language, code } = req.body
    const review = generateHardReview({ language, code })
    return res.status(200).json(review)
  })

  return { router, limiter }
}

const { router } = createReviewRouter()

module.exports = {
  router,
  createReviewRouter,
  createReviewLimiter
}
