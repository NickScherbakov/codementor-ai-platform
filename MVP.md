# MVP: Hard Code Review

## Goal
Ship a monetizable MVP focused on one paid use-case: **hard code review like a strong team lead**. The MVP is intentionally narrow and excludes broader learning platform features.

## In Scope
- One UI page: `/review` (desktop-first).
- One API endpoint: `POST /api/review`.
- Deterministic hard-review response format (rule-based placeholder).
- Free-tier gate: 3 reviews per user (in-memory) with HTTP 402 and paywall messaging.
- Minimal tests covering `POST /api/review`.

## Out of Scope
- Courses, gamification, leaderboards, social features.
- Multi-step onboarding or learning paths.
- Billing/Stripe integration.
- Complex AI model integration (placeholder only).

## API Contract
**Request**
```json
{
  "language": "python",
  "code": "...",
  "mode": "hard"
}
```

**Response**
```json
{
  "summary": "string",
  "severity": "hard",
  "findings": [
    {
      "type": "bug|security|performance|design|style",
      "title": "string",
      "explain": "string",
      "fix": "string",
      "example_patch": "string (optional)"
    }
  ],
  "next_steps": ["string"]
}
```

## Acceptance Criteria
- `/review` allows input, runs a review, and renders summary, findings, and next steps.
- First 3 reviews succeed; 4th returns HTTP 402 and UI shows "Subscribe to continue" messaging.
- Tests for `/api/review` pass.
- README includes MVP quickstart and scope notes.
