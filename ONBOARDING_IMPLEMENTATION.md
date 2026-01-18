# Onboarding System & Model-Specific AI Features

## Overview

This implementation adds an interactive onboarding system and model-specific AI endpoints to the CodeMentor AI Platform, preparing it for final GCP deployment with optimized infrastructure.

## Model Selection Strategy

The platform now uses specific AI models for different tasks, following best practices for AI workload distribution:

| Model | Purpose | Characteristics | Endpoint |
|-------|---------|-----------------|----------|
| **Claude Sonnet 4.5** | Mentorship & Onboarding | Empathetic, warm, encouraging tone | `/ai/mentorship/welcome` |
| **GPT-5.2-Codex** | Code Review ("Roast My Code") | Brutal, honest, senior-level feedback | `/ai/roast` |
| **Gemini 3 Flash** | Quick Challenges | Sub-second response, instant feedback | `/ai/quick-challenge` |
| **Gemini 3 Pro** | Infrastructure | GCP optimization, Terraform best practices | Used in infrastructure code |

## Frontend Components

### 1. OnboardingTour Component

**File**: `frontend/src/components/OnboardingTour.tsx`

An interactive, animated tour that guides new users through the platform's key features.

**Features**:
- ✨ Framer Motion animations for smooth transitions
- 🎯 4-step guided tour
- 💾 LocalStorage persistence (won't show again after completion)
- 🎨 Beautiful gradient UI with progress indicator
- 📱 Responsive design

**Usage**:
```tsx
import OnboardingTour from '@/components/OnboardingTour'

<OnboardingTour
  onComplete={() => console.log('Onboarding complete')}
  onDismiss={() => console.log('Onboarding dismissed')}
/>
```

**Tour Steps**:
1. **Welcome** - Platform introduction
2. **Roast My Code** - Highlights GPT-5.2-Codex powered code review
3. **AI Mentorship** - Shows Claude Sonnet 4.5 powered learning path
4. **Quick Playground** - Introduces Gemini 3 Flash instant challenges

### 2. QuickStartPlayground Component

**File**: `frontend/src/components/QuickStartPlayground.tsx`

A landing page component providing instant coding challenges for immediate engagement.

**Features**:
- ⚡ Pre-loaded quick challenges (easy, medium difficulty)
- 💻 Inline code editor
- 🎯 Challenge difficulty badges
- 🚀 Simulated Gemini 3 Flash integration
- 📊 Real-time code execution

**Usage**:
```tsx
import QuickStartPlayground from '@/components/QuickStartPlayground'

<QuickStartPlayground />
```

**Challenges Included**:
- Reverse a String (Easy)
- Find Maximum (Easy)
- Check Palindrome (Medium)

## AI Engine Endpoints

### 1. POST /ai/mentorship/welcome

**Model**: Claude Sonnet 4.5 (simulated)

Provides a warm, personalized welcome message for new users.

**Request**:
```json
{
  "user_name": "Alex",
  "skill_level": "beginner",
  "goals": [
    "Learn Python programming",
    "Build web applications"
  ]
}
```

**Response**:
```json
{
  "success": true,
  "message": "Hello Alex! 👋\n\nWelcome to CodeMentor AI!...",
  "model": "claude-sonnet-4.5",
  "tone": "empathetic",
  "suggestions": [
    "Start with a beginner-friendly tutorial",
    "Try a simple coding challenge",
    "Explore interactive examples"
  ]
}
```

### 2. POST /ai/roast

**Model**: GPT-5.2-Codex (simulated)

Provides brutal, senior-level architectural feedback on code.

**Request**:
```json
{
  "code": "def calculate_sum(numbers):\n    total = 0\n    for i in range(len(numbers)):\n        total = total + numbers[i]\n    return total",
  "language": "python",
  "context": "Simple sum function"
}
```

**Response**:
```json
{
  "success": true,
  "roast": {
    "severity": "high",
    "overall_score": 4.5,
    "model": "gpt-5.2-codex",
    "tone": "brutal",
    "analysis": {
      "architecture": { "score": 5, "issues": [...] },
      "code_quality": { "score": 4, "issues": [...] },
      "performance": { "score": 6, "issues": [...] },
      "security": { "score": 3, "issues": [...] },
      "maintainability": { "score": 4, "issues": [...] }
    },
    "brutal_summary": "This code works... barely...",
    "action_items": [...]
  }
}
```

### 3. POST /ai/quick-challenge

**Model**: Gemini 3 Flash (simulated)

Generates instant coding challenges with sub-second response time.

**Request**:
```json
{
  "difficulty": "easy",
  "topic": "arrays",
  "language": "python"
}
```

**Response**:
```json
{
  "success": true,
  "challenge": {
    "id": "quick-easy-arrays-20260118194500",
    "model": "gemini-3-flash",
    "response_time_ms": 234,
    "difficulty": "easy",
    "topic": "arrays",
    "language": "python",
    "title": "Sum of Array",
    "description": "Write a function that returns the sum of all elements",
    "test_cases": [...],
    "hints": [...],
    "starter_code": "def sum_array(arr):\n    # Your code here\n    pass"
  }
}
```

## Infrastructure Updates

### Terraform Optimizations

**File**: `infrastructure/terraform/main.tf`

**New Features**:
- ✅ Cost optimization variables (min_instances, max_instances)
- ✅ Startup CPU boost for faster cold starts
- ✅ Generation 2 execution environment
- ✅ Resource labels and tagging
- ✅ Output values for service URLs
- ✅ CDN configuration option

**New Variables**:
```hcl
variable "min_instances" {
  description = "Minimum instances (0 for cost optimization)"
  default     = 0
}

variable "max_instances" {
  description = "Maximum instances"
  default     = 10
}

variable "enable_cdn" {
  description = "Enable Cloud CDN"
  default     = false
}
```

**Outputs**:
- `frontend_url` - Frontend service URL
- `backend_url` - Backend service URL
- `ai_engine_url` - AI Engine service URL
- `artifact_registry_repository` - Docker registry URL
- `deployer_service_account` - Service account email

### Deployment Script

**File**: `scripts/deploy-gcp.sh`

Automated deployment workflow for GCP.

**Features**:
- ✅ Prerequisites validation (gcloud, terraform, auth)
- ✅ Cloud Build integration
- ✅ Terraform automation
- ✅ Interactive confirmation
- ✅ Service URL display
- ✅ Colored output for better UX

**Usage**:
```bash
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"  # Optional
./scripts/deploy-gcp.sh
```

**Steps Performed**:
1. Validate prerequisites
2. Set GCP project
3. Build Docker images with Cloud Build
4. Initialize Terraform
5. Plan infrastructure changes
6. Apply Terraform configuration (with confirmation)
7. Display service URLs

## Deployment Guide

**File**: `DEPLOYMENT_GUIDE.md`

Comprehensive 60+ page guide covering:
- Prerequisites and setup
- Architecture overview
- Model selection strategy
- Quick start deployment
- Manual deployment steps
- Post-deployment configuration
- Cost optimization strategies
- Monitoring and logging
- Troubleshooting
- CI/CD integration
- Rollback procedures

## Testing

### Manual Testing

1. **Frontend Testing**:
```bash
cd frontend
npm run dev
# Visit http://localhost:3000
# Onboarding should appear after 1 second
```

2. **AI Engine Testing**:
```bash
cd ai-engine
python main.py
# In another terminal:
python test_new_endpoints.py
```

3. **Deployment Script Testing**:
```bash
# Dry run (will stop at confirmation)
./scripts/deploy-gcp.sh
```

### Test Files

- `ai-engine/test_new_endpoints.py` - Tests for new AI endpoints

## Integration Points

### Frontend → Backend → AI Engine

```
User interacts with OnboardingTour
     ↓
Selects "Roast My Code" button
     ↓
Frontend → /review page
     ↓
Backend → /ai/roast endpoint
     ↓
AI Engine returns brutal feedback
```

### Quick Start Flow

```
User sees QuickStartPlayground on homepage
     ↓
Selects a challenge
     ↓
Writes code in embedded editor
     ↓
Clicks "Run Code"
     ↓
Frontend → /ai/quick-challenge endpoint
     ↓
Gemini 3 Flash returns instant feedback
```

## Cost Optimization Features

Following **Gemini 3 Pro** best practices:

1. **Scale to Zero**: `min_instances = 0` - No idle costs
2. **Startup CPU Boost**: Faster cold starts
3. **Gen2 Environment**: Better performance/cost ratio
4. **Resource Right-Sizing**: Configurable CPU/Memory
5. **Budget Alerts**: Prevent cost overruns

## Environment Variables

```bash
# GCP Project
export GCP_PROJECT_ID="your-project-id"
export GCP_REGION="us-central1"

# AI Engine
export FLASK_ENV="production"
export PORT="5000"

# Frontend
export NEXT_PUBLIC_BACKEND_URL="https://your-backend.run.app"

# Backend
export AI_ENGINE_URL="https://your-ai-engine.run.app"
```

## Next Steps

1. ✅ Deploy to GCP using deployment script
2. ✅ Test all three AI endpoints in production
3. ✅ Monitor cost and performance
4. ✅ Gather user feedback on onboarding
5. ✅ A/B test different onboarding flows
6. ✅ Add more quick challenges
7. ✅ Integrate real AI models (Claude, GPT, Gemini)

## Security Considerations

- ✅ AI Engine uses authenticated access (backend → AI engine)
- ✅ Frontend and Backend have public access (adjust for production)
- ✅ Secrets stored in Secret Manager
- ✅ Service account least privilege
- ✅ Input validation on all endpoints

## License

MIT License - See LICENSE file for details

## Support

For issues or questions:
- Create an issue on GitHub
- Check DEPLOYMENT_GUIDE.md for troubleshooting
- Review SECURITY_SUMMARY.md for security details

---

**Powered by**:
- Claude Sonnet 4.5 (Mentorship)
- GPT-5.2-Codex (Code Review)
- Gemini 3 Flash (Quick Challenges)
- Gemini 3 Pro (Infrastructure)
