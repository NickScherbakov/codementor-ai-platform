# CodeMentor AI Platform

A modern, **3-tier AI-powered coding assistant** for code reviews, concept explanations, and debugging. The platform connects a Next.js frontend to a Node.js backend and a Python-based AI engine, supporting multiple LLM providers and selectable tutor personalities.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Frontend  (Next.js · React · Tailwind CSS · Framer Motion) │
│  Real-time connection health checker · AI Console (Playground)│
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP / REST
┌───────────────────────▼─────────────────────────────────────┐
│  Backend  (Node.js · Express)                               │
│  API routing · LLM provider switching                       │
│  Gemini / Vertex AI integration · OpenRouter support        │
└───────────────────────┬─────────────────────────────────────┘
                        │  HTTP (PYTHON_AI_ENGINE_URL)
┌───────────────────────▼─────────────────────────────────────┐
│  AI Engine  (Python · Flask)                                │
│  Local models (TinyLlama, CodeT5) · Vertex AI               │
│  LangChain · ChromaDB · Selectable tutor personalities      │
└─────────────────────────────────────────────────────────────┘
```

### Services at a glance

| Service | Stack | Default port |
|---------|-------|-------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 3, Framer Motion 11, Monaco Editor | 3000 |
| **Backend** | Node.js, Express 4, Socket.io, JWT auth | 3001 |
| **AI Engine** | Python, Flask 3, Transformers, LangChain, ChromaDB, Vertex AI | 5000 |

---

## Key Features

- **AI Console (Playground)** — interactive coding assistant with a real-time connection health checker that polls the backend every 30 seconds.
- **Multi-provider LLM support** — switch between:
  - 🖥️ **Local Models** — TinyLlama-1.1B-Chat and CodeT5-Small (zero cloud cost).
  - 🌐 **OpenRouter** — route to any hosted model (e.g. `openai/gpt-4-turbo`).
  - ☁️ **Google Gemini via Vertex AI** — leverages GCP credits (`gemini-pro`, `code-bison`).
- **Selectable tutor personalities** — four built-in personas: Encouraging 😊, Analytical 🧠, Creative 🎨, and Practical ⚙️.
- **Monaco-powered code editor** — syntax highlighting and editing in the browser.
- **Real-time updates** — Socket.io for live feedback between frontend and backend.

---

## Local Development

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.10
- (Optional) A GCP project with Vertex AI enabled, if you want cloud LLM support.

---

### 1 · AI Engine (Python / Flask)

```bash
cd ai-engine
pip install -r requirements.txt

# Optional: point at your GCP project for Vertex AI
export GCP_PROJECT_ID=your-project-id
export GCP_LOCATION=us-central1        # defaults to us-central1

python main.py                         # starts on port 5000
```

---

### 2 · Backend (Node.js / Express)

```bash
cd backend
npm install

# Required environment variables
export PORT=3001
export PYTHON_AI_ENGINE_URL=http://localhost:5000   # URL of the AI Engine above
export NODE_ENV=development

# Optional — needed only if you use cloud LLM providers
export USE_VERTEX_AI=false             # set to true to enable Gemini/Vertex AI
export GCP_PROJECT_ID=your-project-id
export GCP_LOCATION=us-central1

npm start                              # or: npm run dev
```

---

### 3 · Frontend (Next.js)

```bash
cd frontend
npm install

# Point the frontend at your local backend
export NEXT_PUBLIC_API_BASE_URL=http://localhost:3001

npm run dev                            # starts on port 3000
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
The **AI Console** is available at [http://localhost:3000/playground](http://localhost:3000/playground).

---

## GCP Deployment Guide

All three services are deployed to **Google Cloud Run** using a single, self-contained script that resolves inter-service URL dependencies automatically.

### How it works

The script at `scripts/deploy-to-gcp.sh`:

1. Validates prerequisites (`gcloud`, `docker`, `git`).
2. Resets the local repository to the latest `main` branch.
3. Configures the GCP project and authenticates Docker with Artifact Registry.
4. Builds and pushes Docker images for all three services.
5. Deploys **AI Engine** → captures its Cloud Run URL.
6. Deploys **Backend** with `PYTHON_AI_ENGINE_URL` wired to the AI Engine URL → captures its URL.
7. Builds the **Frontend** image with `NEXT_PUBLIC_API_BASE_URL` baked in at build time → deploys it.

### Steps to deploy

```bash
# 1. Authenticate with GCP
gcloud auth login

# 2. Set your project ID
export GCP_PROJECT_ID=your-project-id

# 3. (Optional) Override the default region
export GCP_REGION=us-central1

# 4. Make the script executable and run it
chmod +x scripts/deploy-to-gcp.sh
./scripts/deploy-to-gcp.sh
```

After a successful run the script prints the public URLs for all three services:

```
Service URLs:
  AI Engine:  https://codementor-ai-engine-xxxx.run.app
  Backend:    https://codementor-backend-xxxx.run.app
  Frontend:   https://codementor-frontend-xxxx.run.app
```

### Useful post-deployment commands

```bash
# List deployed services
gcloud run services list --region=us-central1

# Tail logs for the backend
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=codementor-backend" --limit 50

# Open Cloud Run console
open "https://console.cloud.google.com/run?project=${GCP_PROJECT_ID}"
```

---

## Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) — detailed deployment notes
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) — implementation details
- [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md) — security review
