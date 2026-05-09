# CodeMentor AI Platform

[![GitHub stars](https://img.shields.io/github/stars/NickScherbakov/codementor-ai-platform?style=for-the-badge)](https://github.com/NickScherbakov/codementor-ai-platform/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/NickScherbakov/codementor-ai-platform?style=for-the-badge)](https://github.com/NickScherbakov/codementor-ai-platform/network/members)
[![GitHub issues](https://img.shields.io/github/issues/NickScherbakov/codementor-ai-platform?style=for-the-badge)](https://github.com/NickScherbakov/codementor-ai-platform/issues)
[![CI](https://img.shields.io/github/actions/workflow/status/NickScherbakov/codementor-ai-platform/ci.yml?branch=main&style=for-the-badge&label=CI)](https://github.com/NickScherbakov/codementor-ai-platform/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/NickScherbakov/codementor-ai-platform?style=for-the-badge)](LICENSE)

A 3-tier open-source AI coding platform: **Next.js frontend + Node.js backend + Python AI engine**.

> If this project helps you, please **star the repo** ⭐ — it directly helps us reach the first **1,000 stars** milestone.

## Why star this project

- End-to-end architecture you can run locally or deploy to GCP.
- AI mentorship + hard code review modes in one product.
- Multi-provider model routing (local models, Gemini/Vertex AI, OpenRouter).
- Open roadmap, contribution flow, and weekly shipping cadence.

## 1-minute quick start (Docker)

```bash
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform
docker compose up --build
```

Open:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- AI Engine: http://localhost:5000

## Local development (manual)

### Prerequisites
- Node.js >= 18
- Python >= 3.10

### Fastest local run
```bash
./scripts/dev.sh
```

### Manual run
```bash
# 1) AI Engine
cd ai-engine
pip install -r requirements.txt
python main.py

# 2) Backend
cd ../backend
npm install
npm start

# 3) Frontend
cd ../frontend
npm install --legacy-peer-deps
npm run dev
```

## Live demo

- GitHub Pages landing: https://nickscherbakov.github.io/codementor-ai-platform/
- Playground route (local): http://localhost:3000/playground

## Architecture

```text
Frontend (Next.js) -> Backend (Express) -> AI Engine (Flask)
```

## Project highlights

- AI Console with model/provider selection
- Hard code review mode for stricter feedback
- Learning dashboard and assessment flows
- Docker and Cloud Run deployment paths

## FAQ

**Is this production-ready?**
- It is actively developed, with CI and deployment workflows, and a public roadmap.

**Do I need paid APIs?**
- No. Local model options are supported.

**Can I self-host?**
- Yes. Docker Compose and GCP deployment guides are included.

## Road to 1,000 stars

We track this publicly in [`ROADMAP.md`](ROADMAP.md), weekly ship logs, and releases.

Milestones:
- 31 May 2026: 200★
- 15 Jun 2026: 550★
- 25 Jun 2026: 800★
- 01 Jul 2026: 1000★

## Contributing and community

- [Contributing guide](CONTRIBUTING.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Support](SUPPORT.md)
- [Security policy](SECURITY.md)
- [Roadmap](ROADMAP.md)

If GitHub Discussions are enabled in repository settings, use Discussions for Q&A and ideas.

## Releases and showcases

- [v1.0.0 release draft](docs/releases/v1.0.0.md)
- [Showcase #1 — Hard review before/after](docs/showcases/01-hard-review-before-after.md)
- [Showcase #2 — Learning path progression](docs/showcases/02-learning-path-progression.md)
- [Showcase #3 — AI Console workflow](docs/showcases/03-ai-console-workflow.md)
- [Weekly ship log template](docs/ship-log/TEMPLATE.md)

## Documentation

- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)
- [SECURITY_SUMMARY.md](SECURITY_SUMMARY.md)
- [SERVICE_MAP_AND_LOCAL_RUN.md](SERVICE_MAP_AND_LOCAL_RUN.md)

---

Built in public. Star the repo to support development ⭐
