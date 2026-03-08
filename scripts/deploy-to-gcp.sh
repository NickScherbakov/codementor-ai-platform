#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Manual Sequential GCP Cloud Run Deployer    ║
# ║  Deploys: ai-engine → backend → frontend (resolves URL dependencies)     ║
# ╚═══════════════════════════════════════════════════════════════════════════╝
#
# Usage:
#   export GCP_PROJECT_ID=your-project-id
#   export GCP_REGION=us-central1          # optional, defaults to us-central1
#   chmod +x scripts/deploy-to-gcp.sh
#   ./scripts/deploy-to-gcp.sh

set -e  # Exit immediately on any error

# ─── Color helpers ────────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ─── Configuration ────────────────────────────────────────────────────────────
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
REGISTRY="${REGION}-docker.pkg.dev/${PROJECT_ID}/app"
IMAGE_TAG="$(date +%Y%m%d-%H%M%S)"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CodeMentor AI Platform - Sequential Cloud Run Deployment     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 1: Validate Prerequisites
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/7]${NC} Validating prerequisites..."

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: GCP_PROJECT_ID environment variable is not set${NC}"
    echo "Usage: export GCP_PROJECT_ID=your-project-id"
    exit 1
fi

if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Install from: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: git is not installed${NC}"
    exit 1
fi

if ! gcloud auth application-default print-access-token &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth application-default login"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites validated${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 2: Clean slate — fetch latest main branch
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/7]${NC} Ensuring clean slate — fetching latest from main branch..."
echo -e "${YELLOW}Warning: This will discard all local uncommitted changes and untracked files.${NC}"
echo "  Press Ctrl+C within 5 seconds to abort, or wait to continue..."
sleep 5

git fetch origin main
git reset --hard origin/main
git clean -fd

echo -e "${GREEN}✓ Repository reset to latest main${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 3: Configure GCP project and Docker auth
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/7]${NC} Configuring GCP project and Docker authentication..."

gcloud config set project "${PROJECT_ID}"
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet

echo -e "${GREEN}✓ GCP project set to ${PROJECT_ID}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 4: Build and push all Docker images
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/7]${NC} Building and pushing Docker images (tag: ${IMAGE_TAG})..."

echo "  → Building ai-engine..."
docker build -t "${REGISTRY}/ai-engine:${IMAGE_TAG}" ./ai-engine
docker push "${REGISTRY}/ai-engine:${IMAGE_TAG}"
echo -e "  ${GREEN}✓ ai-engine image pushed${NC}"

echo "  → Building backend..."
docker build -t "${REGISTRY}/backend:${IMAGE_TAG}" ./backend
docker push "${REGISTRY}/backend:${IMAGE_TAG}"
echo -e "  ${GREEN}✓ backend image pushed${NC}"

# Frontend is built later (after backend URL is known) so the build arg
# NEXT_PUBLIC_API_BASE_URL can be baked in at image-build time.

echo -e "${GREEN}✓ Docker images built and pushed${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 5: Deploy ai-engine → capture its public URL
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/7]${NC} Deploying ai-engine to Cloud Run..."

gcloud run deploy codementor-ai-engine \
    --image="${REGISTRY}/ai-engine:${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform=managed \
    --no-allow-unauthenticated \
    --memory=4Gi \
    --cpu=2 \
    --timeout=300 \
    --set-env-vars="USE_VERTEX_AI=true,GCP_PROJECT_ID=${PROJECT_ID},GCP_LOCATION=${REGION},VERTEX_MODEL=gemini-pro"

AI_ENGINE_URL=$(gcloud run services describe codementor-ai-engine \
    --region="${REGION}" \
    --format="value(status.url)")

echo -e "${GREEN}✓ ai-engine deployed${NC}"
echo -e "  URL: ${BLUE}${AI_ENGINE_URL}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 6: Deploy backend (with AI Engine URL) → capture its public URL
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/7]${NC} Deploying backend to Cloud Run..."
echo "  PYTHON_AI_ENGINE_URL=${AI_ENGINE_URL}"

gcloud run deploy codementor-backend \
    --image="${REGISTRY}/backend:${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production,USE_VERTEX_AI=true,GCP_PROJECT_ID=${PROJECT_ID},GCP_LOCATION=${REGION},PYTHON_AI_ENGINE_URL=${AI_ENGINE_URL},AI_ENGINE_URL=${AI_ENGINE_URL}"

BACKEND_URL=$(gcloud run services describe codementor-backend \
    --region="${REGION}" \
    --format="value(status.url)")

echo -e "${GREEN}✓ backend deployed${NC}"
echo -e "  URL: ${BLUE}${BACKEND_URL}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 7: Build frontend with backend URL baked in, then deploy
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[7/7]${NC} Building frontend image with NEXT_PUBLIC_API_BASE_URL and deploying..."
echo "  NEXT_PUBLIC_API_BASE_URL=${BACKEND_URL}"

docker build \
    --build-arg NEXT_PUBLIC_API_BASE_URL="${BACKEND_URL}" \
    --build-arg NEXT_PUBLIC_API_URL="${BACKEND_URL}" \
    -t "${REGISTRY}/frontend:${IMAGE_TAG}" \
    ./frontend

docker push "${REGISTRY}/frontend:${IMAGE_TAG}"
echo -e "  ${GREEN}✓ frontend image pushed${NC}"

gcloud run deploy codementor-frontend \
    --image="${REGISTRY}/frontend:${IMAGE_TAG}" \
    --region="${REGION}" \
    --platform=managed \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production"

FRONTEND_URL=$(gcloud run services describe codementor-frontend \
    --region="${REGION}" \
    --format="value(status.url)")

echo -e "${GREEN}✓ frontend deployed${NC}"
echo -e "  URL: ${BLUE}${FRONTEND_URL}${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Deployment Summary
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Service URLs:${NC}"
echo -e "  AI Engine:  ${BLUE}${AI_ENGINE_URL}${NC}"
echo -e "  Backend:    ${BLUE}${BACKEND_URL}${NC}"
echo -e "  Frontend:   ${BLUE}${FRONTEND_URL}${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Verify services: gcloud run services list --region=${REGION}"
echo "  2. Check logs:      gcloud logging read --limit 50"
echo "  3. Cloud Console:   https://console.cloud.google.com/run?project=${PROJECT_ID}"
echo ""
