const express = require('express')
const request = require('supertest')
const { createReviewLimiter, createReviewRouter } = require('../routes/review')

function createTestApp(limiter) {
  const app = express()
  app.use(express.json())
  const { router } = createReviewRouter({ limiter })
  app.use('/api/review', router)
  return app
}

describe('POST /api/review', () => {
  it('returns a hard review payload', async () => {
    const limiter = createReviewLimiter({ limit: 3 })
    const app = createTestApp(limiter)

    const response = await request(app)
      .post('/api/review')
      .set('x-user-id', 'test-user')
      .send({
        language: 'python',
        code: 'print("hello")',
        mode: 'hard'
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        summary: expect.any(String),
        severity: 'hard',
        findings: expect.any(Array),
        next_steps: expect.any(Array)
      })
    )
  })

  it('enforces the free review limit', async () => {
    const limiter = createReviewLimiter({ limit: 3 })
    const app = createTestApp(limiter)
    const payload = {
      language: 'javascript',
      code: 'console.log("hello")',
      mode: 'hard'
    }

    for (let i = 0; i < 3; i += 1) {
      const response = await request(app)
        .post('/api/review')
        .set('x-user-id', 'limited-user')
        .send(payload)
      expect(response.status).toBe(200)
    }

    const blockedResponse = await request(app)
      .post('/api/review')
      .set('x-user-id', 'limited-user')
      .send(payload)

    expect(blockedResponse.status).toBe(402)
    expect(blockedResponse.body).toEqual(
      expect.objectContaining({
        message: expect.stringContaining('Subscribe')
      })
    )
  })
})
