# CodeMentor AI Platform

A "Community-Gated" programming learning platform built with a 3-service architecture on Google Cloud.

## Services

1.  **Frontend**: Next.js (Stateless, SSR/Static) - `/frontend`
2.  **Backend**: Node.js/Express API - `/backend`
3.  **AI Engine**: Python/Flask - `/ai-engine`

## Deployment

Deployment is managed by **Google Cloud Build** via the `/******` comment trigger on Pull Requests.

The pipeline (`cloudbuild.yaml`) performs:
1.  Frontend Install & Lint
2.  AI Engine Tests
3.  Parallel Docker Builds
4.  Image Pushing to Artifact Registry

## Local Development

Each service contains its own setup instructions (check `package.json` or usage files if available).
