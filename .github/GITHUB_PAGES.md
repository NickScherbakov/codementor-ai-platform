# GitHub Pages Configuration

This repository automatically deploys a static demo site to GitHub Pages.

## Live Demo
**https://nickscherbakov.github.io/codementor-ai-platform/**

## What's Deployed

The GitHub Pages site shows a **static preview** of the UI only:
- ✅ Frontend interface and components
- ✅ UI/UX demonstration
- ❌ No backend APIs
- ❌ No AI features (requires local Python service)
- ❌ No real-time features
- ❌ No database connectivity

## How It Works

1. **Trigger**: Every push to `main` branch
2. **Build**: Next.js builds as static HTML (GitHub Actions)
3. **Deploy**: Artifacts uploaded to GitHub Pages
4. **Location**: Served at `/codementor-ai-platform/` (project subdirectory)

## Local Testing

Test the GitHub Pages build locally:

```bash
# Build with GitHub Pages configuration
GITHUB_PAGES=true SKIP_REWRITES=true npm run build

# Serve the static output
npx serve out

# Access at: http://localhost:3000/codementor-ai-platform/
```

## Repository Settings

Ensure GitHub Pages is enabled in **Settings → Pages**:
- Source: GitHub Actions
- Branch: main

## Automatic Rebuilds

The workflow automatically rebuilds and redeploys when:
- Code is pushed to `main` branch
- Or manually triggered from Actions tab

For full functionality (APIs, AI engine), deploy the complete stack locally using:
```bash
docker-compose up
```

See [README.md](../README.md) for complete setup instructions.
