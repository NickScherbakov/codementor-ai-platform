import { ReviewResult } from './ResultsPage'

/**
 * API client for Hard Code Review backend
 * Connects to the real backend at /api/backend/review
 */

interface BackendFinding {
  type: 'bug' | 'security' | 'performance' | 'design' | 'style'
  title: string
  explain: string
  fix: string
  example_patch?: string
}

interface BackendReviewResponse {
  summary: string
  severity: 'hard'
  findings: BackendFinding[]
  next_steps: string[]
}

interface ReviewError {
  message: string
  code?: 'LIMIT_REACHED' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
}

/**
 * Submit code for review to the backend
 * @param code - The code to review
 * @param language - Programming language (python, javascript, typescript)
 * @returns Promise with review results or error
 */
export async function submitCodeReview(
  code: string,
  language: string
): Promise<ReviewResult> {
  try {
    const response = await fetch('/api/backend/review', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Optional: send user ID if available
        // 'x-user-id': getUserId(),
      },
      body: JSON.stringify({
        language: language.toLowerCase(),
        code: code,
        mode: 'hard',
      }),
    })

    // Handle limit reached (402 Payment Required)
    if (response.status === 402) {
      const errorData: ReviewError = await response.json()
      throw new Error(
        errorData.message || 'Free review limit reached. Subscribe to continue.'
      )
    }

    // Handle validation errors (400)
    if (response.status === 400) {
      const errorData: ReviewError = await response.json()
      throw new Error(errorData.message || 'Invalid request. Please check your input.')
    }

    // Handle server errors (500)
    if (response.status >= 500) {
      throw new Error('Server error. Please try again later.')
    }

    // Handle success
    if (!response.ok) {
      throw new Error(`Review failed with status ${response.status}`)
    }

    const backendResult: BackendReviewResponse = await response.json()

    // Transform backend response to frontend ReviewResult format
    return transformBackendResponse(backendResult, code)
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to submit code review. Please try again.')
  }
}

/**
 * Transform backend response to frontend ReviewResult format
 */
function transformBackendResponse(
  backend: BackendReviewResponse,
  originalCode: string
): ReviewResult {
  return {
    severity: 'hard', // Backend always returns 'hard'
    summary: backend.summary,
    findings: backend.findings,
    next_steps: backend.next_steps,
    // Backend doesn't provide code comparison yet
    // Could add this in the future
    comparison: undefined,
  }
}
