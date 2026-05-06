const express = require('express')
const { generateHardReview } = require('../services/reviewEngine')

const ALLOWED_LANGUAGES = ['python', 'javascript', 'typescript']
const DEFAULT_LIMIT = 3
const DEFAULT_WINDOW_MS = 15 * 60 * 1000

function createReviewLimiter({ limit = DEFAULT_LIMIT, windowMs = DEFAULT_WINDOW_MS } = {}) {
  const counts = new Map()

  return {
    check(key) {
      const now = Date.now()
      const entry = counts.get(key)

      if (!entry || now >= entry.resetAt) {
        const nextEntry = { count: 1, resetAt: now + windowMs }
        counts.set(key, nextEntry)
        return {
          allowed: true,
          remaining: Math.max(0, limit - nextEntry.count)
        }
      }

      if (entry.count >= limit) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000))
        }
      }

      entry.count += 1
      counts.set(key, entry)
      return {
        allowed: true,
        remaining: Math.max(0, limit - entry.count)
      }
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
      return res.status(429).json({
        message: 'Review rate limit reached. Please wait and try again.',
        retryAfterSeconds: limitResult.retryAfterSeconds
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
