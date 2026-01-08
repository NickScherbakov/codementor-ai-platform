# 🎨 Figma Integration Architecture Diagrams

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          FIGMA MAKE (Cloud)                         │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ AI-Platform-Integration                                      │  │
│  │ ├─ Button/Primary (Component)                                │  │
│  │ ├─ Button/Secondary                                          │  │
│  │ ├─ Button/Tertiary                                           │  │
│  │ ├─ FindingCard (Component)                                   │  │
│  │ ├─ SeverityBadge                                             │  │
│  │ └─ ... (50+ more components)                                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                ↓ (Figma API + WebHook)
┌─────────────────────────────────────────────────────────────────────┐
│                     CODEMENTOR-AI-PLATFORM (Docker)                 │
├─────────────────────────────────────────────────────────────────────┤
│  MCP SERVER: figma-codegen-mcp:3333                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │ Figma Code Generation Service                                │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ WebHook Handler (/api/webhooks/figma)                  │ │  │
│  │ │ Validates signature, processes FILE_UPDATE events      │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  │                        ↓                                      │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ MCP Tools (Express endpoints)                           │ │  │
│  │ │ ├─ /tools/parse_figma_components                        │ │  │
│  │ │ ├─ /tools/generate_react_component                      │ │  │
│  │ │ ├─ /tools/generate_typescript_types                     │ │  │
│  │ │ ├─ /tools/generate_tests                                │ │  │
│  │ │ └─ /tools/create_github_pr                              │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  │                        ↓                                      │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ Code Generators                                         │ │  │
│  │ │ ├─ ReactComponentGenerator                              │ │  │
│  │ │ ├─ TypeScriptGenerator                                  │ │  │
│  │ │ ├─ TestGenerator                                        │ │  │
│  │ │ ├─ StorybookGenerator                                   │ │  │
│  │ │ └─ TailwindCSSExtractor                                 │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  │                        ↓                                      │  │
│  │ ┌─────────────────────────────────────────────────────────┐ │  │
│  │ │ GitHub Integration                                      │ │  │
│  │ │ ├─ Create branch (figma/component-name)                 │ │  │
│  │ │ ├─ Commit generated code                                │ │  │
│  │ │ ├─ Create Pull Request                                  │ │  │
│  │ │ └─ Set PR labels & reviewers                            │ │  │
│  │ └─────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────┤
│  NGINX (Reverse Proxy)                                              │
│  ├─ /api/webhooks/figma → figma-codegen-mcp:3333                   │
│  ├─ /api/* → backend:3001 (existing)                               │
│  └─ / → frontend:3000 (existing)                                   │
├─────────────────────────────────────────────────────────────────────┤
│  DATABASE LAYER (Existing)                                          │
│  ├─ MongoDB (codementor-ai)                                        │
│  ├─ Redis (caching & sessions)                                     │
│  └─ PostgreSQL (Judge0 - code execution)                           │
└─────────────────────────────────────────────────────────────────────┘
                                ↓ (GitHub API)
┌─────────────────────────────────────────────────────────────────────┐
│                         GITHUB (Cloud)                              │
│  NickScherbakov/codementor-ai-platform                             │
│  ├─ PR: figma/button-primary (auto-created)                        │
│  │  ├─ src/components/Button/Primary.tsx (auto-generated)          │
│  │  ├─ src/components/Button/Primary.types.ts                      │
│  │  ├─ src/components/Button/Primary.test.tsx                      │
│  │  └─ src/components/Button/Primary.stories.tsx                   │
│  │                                                                   │
│  └─ .github/workflows/figma-codegen.yml (CI/CD)                    │
│     ├─ Run linter (ESLint)                                         │
│     ├─ Run formatter (Prettier)                                    │
│     ├─ Run tests (Jest)                                            │
│     └─ Build Storybook                                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. WebHook & Data Flow

```
TIMELINE: Component update in Figma → PR in GitHub (15-30 seconds)

1. FIGMA SIDE
   ┌──────────────────────────┐
   │ Deisgner updates button  │
   │ color: #EF4444 → #DC2626│
   └────────────┬─────────────┘
                ↓
   ┌──────────────────────────┐
   │ Figma detects FILE_UPDATE│
   │ component: Button/Primary│
   │ change: fill color       │
   └────────────┬─────────────┘
                ↓
   ┌──────────────────────────────────────────────────────┐
   │ FIGMA WEBHOOK EVENT (JSON)                           │
   │ {                                                    │
   │   "event_type": "FILE_UPDATE",                       │
   │   "file_key": "qqeukvj1InYIsaVBsMGCB6",             │
   │   "file_name": "AI-Platform-Integration",           │
   │   "timestamp": "2026-01-08T10:30:00Z",              │
   │   "changes": [{                                     │
   │     "type": "UPDATE",                               │
   │     "node_id": "123:456",                           │
   │     "node_name": "Button/Primary",                  │
   │     "changes": ["fill"]                             │
   │   }]                                                │
   │ }                                                    │
   └────────────┬─────────────────────────────────────────┘
                ↓ (HTTPS POST)
2. MCP SERVER SIDE
   ┌──────────────────────────────────────────────────────┐
   │ POST /api/webhooks/figma                             │
   │ WebHook received & signature validated               │
   └────────────┬─────────────────────────────────────────┘
                ↓
   ┌──────────────────────────┐
   │ Parse webhook event      │
   │ Extract component name   │
   │ Extract changes list     │
   └────────────┬─────────────┘
                ↓
   ┌──────────────────────────────────────────────────────┐
   │ Call Figma API to get component details              │
   │ GET /files/qqeukvj1InYIsaVBsMGCB6/nodes?ids=123:456 │
   │ Response: component structure, styles, layout        │
   └────────────┬─────────────────────────────────────────┘
                ↓
   ┌──────────────────────────────────────────────────────┐
   │ CODE GENERATION PIPELINE                             │
   │                                                      │
   │ 1. Extract Figma data:                               │
   │    ├─ Colors: fills, strokes                         │
   │    ├─ Typography: font-family, size, weight          │
   │    ├─ Spacing: padding, margins, gap                 │
   │    ├─ Geometry: width, height, border-radius         │
   │    └─ States: hover, active, disabled                │
   │                                                      │
   │ 2. Generate React code:                              │
   │    ├─ Component JSX                                  │
   │    ├─ TypeScript interface for props                 │
   │    ├─ Tailwind CSS classes                           │
   │    └─ Figma link comment                             │
   │                                                      │
   │ 3. Generate tests:                                   │
   │    ├─ Component rendering test                       │
   │    ├─ Props validation test                          │
   │    ├─ Snapshot test                                  │
   │    └─ Accessibility test                             │
   │                                                      │
   │ 4. Generate Storybook story:                         │
   │    ├─ Default story                                  │
   │    ├─ Story variations (all props)                   │
   │    └─ Design controls                                │
   └────────────┬─────────────────────────────────────────┘
                ↓
3. GITHUB SIDE
   ┌──────────────────────────────────────────────────────┐
   │ CREATE BRANCH & COMMIT                               │
   │                                                      │
   │ Branch: figma/button-primary                         │
   │ Commit message: "chore: regenerate Button/Primary    │
   │                 from Figma (fill color update)"      │
   │                                                      │
   │ Files:                                               │
   │ + src/components/Button/Primary.tsx                  │
   │ + src/components/Button/Primary.types.ts             │
   │ + src/components/Button/Primary.test.tsx             │
   │ + src/components/Button/Primary.stories.tsx          │
   └────────────┬─────────────────────────────────────────┘
                ↓
   ┌──────────────────────────────────────────────────────┐
   │ CREATE PULL REQUEST                                  │
   │                                                      │
   │ Title: "🎨 [Figma] Update Button/Primary"           │
   │ Body:                                                │
   │ "Auto-generated from Figma Design System             │
   │                                                      │
   │ Figma: [View Design](figma link)                     │
   │ Changes: fill color #EF4444 → #DC2626               │
   │                                                      │
   │ ✅ All tests passed                                  │
   │ ✅ Linting passed                                    │
   │ ✅ Build successful"                                 │
   │                                                      │
   │ Labels: [figma, auto-generated]                      │
   │ Assignees: [code-review-team]                        │
   └────────────┬─────────────────────────────────────────┘
                ↓
4. CI/CD PIPELINE
   ┌──────────────────────────────────────────────────────┐
   │ GitHub Actions: figma-codegen.yml triggered          │
   │                                                      │
   │ Job 1: Lint & Format                                 │
   │ ├─ eslint src/components/Button/Primary.tsx          │
   │ ├─ prettier --check                                  │
   │ └─ typescript --noEmit                               │
   │                                                      │
   │ Job 2: Tests                                         │
   │ ├─ jest Button/Primary.test.tsx                      │
   │ └─ coverage report                                   │
   │                                                      │
   │ Job 3: Build                                         │
   │ ├─ next build                                        │
   │ ├─ storybook build                                   │
   │ └─ bundle analysis                                   │
   │                                                      │
   │ Result: ✅ All checks passed                         │
   │ Status: Ready for review                             │
   └────────────┬─────────────────────────────────────────┘
                ↓
5. DEVELOPER REVIEW
   ┌──────────────────────────────────────────────────────┐
   │ Developer reviews PR:                                │
   │                                                      │
   │ ✓ Code quality looks good                            │
   │ ✓ Styles match Figma design                          │
   │ ✓ Tests are comprehensive                            │
   │ ✓ No merge conflicts                                 │
   │                                                      │
   │ Action: Approve & Merge                              │
   └────────────┬─────────────────────────────────────────┘
                ↓
6. DEPLOYMENT
   ┌──────────────────────────────────────────────────────┐
   │ PR merged to main                                    │
   │ ↓                                                    │
   │ GitHub Actions deploy job triggered                 │
   │ ├─ Build production bundle                           │
   │ ├─ Run final tests                                   │
   │ ├─ Deploy to staging                                 │
   │ ├─ Run E2E tests                                     │
   │ └─ Deploy to production                              │
   │                                                      │
   │ Component is now live! 🎉                            │
   └──────────────────────────────────────────────────────┘
```

---

## 3. Component File Structure (Generated)

```
codementor-ai-platform/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Primary.tsx          ← Generated from Figma
│   │   │   ├── Primary.types.ts     ← Generated
│   │   │   ├── Primary.test.tsx     ← Generated
│   │   │   ├── Primary.stories.tsx  ← Generated
│   │   │   ├── Secondary.tsx        ← Generated
│   │   │   └── Tertiary.tsx         ← Generated
│   │   │
│   │   ├── Card/
│   │   │   ├── Summary.tsx          ← Generated
│   │   │   ├── Finding.tsx          ← Generated
│   │   │   ├── Finding.types.ts     ← Generated
│   │   │   └── Finding.test.tsx     ← Generated
│   │   │
│   │   ├── Badge/
│   │   │   ├── Severity.tsx         ← Generated
│   │   │   ├── Severity.types.ts    ← Generated
│   │   │   └── Severity.test.tsx    ← Generated
│   │   │
│   │   └── ... (other components)
│   │
│   └── styles/
│       └── generated-components.css ← Tailwind classes
│
├── .storybook/
│   └── stories/
│       ├── Button.Primary.stories.tsx  ← Generated
│       ├── Card.Finding.stories.tsx    ← Generated
│       └── Badge.Severity.stories.tsx  ← Generated
│
└── mcp-servers/
    └── figma-codegen/
        ├── src/
        │   ├── index.ts              ← Express MCP Server
        │   ├── figma-client.ts       ← Figma API wrapper
        │   ├── github-client.ts      ← GitHub API wrapper
        │   ├── code-generator.ts     ← Code generation logic
        │   ├── tools/
        │   │   ├── parse-components.ts
        │   │   ├── generate-react.ts
        │   │   ├── generate-types.ts
        │   │   ├── generate-tests.ts
        │   │   └── create-pr.ts
        │   └── utils/
        │       ├── figma-parser.ts   ← Parse Figma JSON
        │       ├── style-extractor.ts ← Extract colors & styles
        │       └── webhook-validator.ts ← Validate WebHook
        │
        ├── Dockerfile
        ├── package.json
        └── tsconfig.json
```

---

## 4. API Contracts

### 4.1 MCP Tool: parse_figma_components

```typescript
// REQUEST
{
  "fileKey": "qqeukvj1InYIsaVBsMGCB6"
}

// RESPONSE
{
  "success": true,
  "count": 42,
  "components": [
    {
      "id": "123:456",
      "name": "Button/Primary",
      "description": "Primary action button"
    },
    {
      "id": "123:789",
      "name": "Button/Secondary",
      "description": "Secondary action button"
    },
    // ... more components
  ]
}
```

### 4.2 MCP Tool: generate_react_component

```typescript
// REQUEST
{
  "fileKey": "qqeukvj1InYIsaVBsMGCB6",
  "componentId": "123:456",
  "componentName": "Button/Primary"
}

// RESPONSE
{
  "success": true,
  "component": {
    "name": "Button/Primary",
    "code": "import React from 'react'...",
    "types": "export interface ButtonProps {...}",
    "tests": "describe('Button/Primary', () => {...})",
    "figmaLink": "https://figma.com/design/..."
  }
}
```

### 4.3 WebHook: FILE_UPDATE Event

```typescript
{
  "event_type": "FILE_UPDATE",
  "file_key": "qqeukvj1InYIsaVBsMGCB6",
  "file_name": "AI-Platform-Integration",
  "timestamp": "2026-01-08T10:30:00Z",
  "changes": [
    {
      "type": "UPDATE",
      "node_id": "123:456",
      "node_name": "Button/Primary",
      "changes": ["fill", "width"]
    }
  ]
}
```

---

## 5. Performance & Scalability

```
THROUGHPUT ANALYSIS

Per component generation:
├─ Figma API call: 200-500ms
├─ Code generation: 50-100ms
├─ GitHub API calls (4 calls): 500-1000ms
├─ Total per component: 750-1500ms
│
└─ Concurrent limit: 5-10 components simultaneously
  (limited by GitHub rate limit: 5000 req/hour)

Expected capacity:
├─ 100 components/hour = full design system
├─ 10 components/hour = daily updates
├─ 1 component/minute = small tweaks
└─ Safe margin before hitting rate limits: 3-5x

Optimization opportunities:
├─ Cache Figma API responses (1 hour TTL)
├─ Batch GitHub operations
├─ Use GitHub App (15000 req/hour vs 60)
├─ Async processing with job queue
└─ CDN for Figma file caching
```

---

## 6. Error Handling & Fallbacks

```
ERROR SCENARIOS & RECOVERY

1. Figma API Down
   └─ Use cached component version (Redis)
   └─ Retry with exponential backoff (3-5 attempts)
   └─ Alert team if >5 min downtime

2. GitHub API Rate Limit
   └─ Queue pending PRs (Redis job queue)
   └─ Retry in 5-10 minutes
   └─ Use GitHub App for higher limits

3. WebHook Signature Invalid
   └─ Log and reject (security measure)
   └─ Alert security team
   └─ Check for token rotation

4. Code Generation Fails
   └─ Create PR with error details
   └─ Manual review required
   └─ Fallback to previous version

5. Network Timeout
   └─ Retry 3 times with backoff
   └─ Use circuit breaker pattern
   └─ Graceful degradation
```

---

## 7. Monitoring & Alerts

```
METRICS TO TRACK

Success Rate:
├─ WebHook delivery: target >99%
├─ Component generation: target >98%
├─ PR creation: target >99%
└─ Dashboard: Grafana + Prometheus

Latency:
├─ P50 (median): target <1s
├─ P95: target <5s
├─ P99: target <15s
└─ Alert if P95 > 10s

Volume:
├─ Components/hour
├─ PRs/day
├─ API calls/minute
└─ Error rate trending

Alerts (PagerDuty/Slack):
├─ Success rate drops below 95%
├─ Latency exceeds thresholds
├─ Rate limit approaching
├─ Token expires in 7 days
└─ MCP Server down
```

---

**Диаграммы созданы:** Январь 8, 2026
