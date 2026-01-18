#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - GCP Deployment Script                       ║
# ║  Automated workflow: gcloud builds → docker push → terraform apply       ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID}"
REGION="${GCP_REGION:-us-central1}"
REPOSITORY="app"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  CodeMentor AI Platform - GCP Deployment                     ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 1: Validate Prerequisites
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[1/6]${NC} Validating prerequisites..."

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: GCP_PROJECT_ID environment variable is not set${NC}"
    echo "Usage: export GCP_PROJECT_ID=your-project-id"
    exit 1
fi

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI is not installed${NC}"
    echo "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform is not installed${NC}"
    echo "Install from: https://www.terraform.io/downloads"
    exit 1
fi

# Verify authentication
if ! gcloud auth application-default print-access-token &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with gcloud${NC}"
    echo "Run: gcloud auth application-default login"
    exit 1
fi

echo -e "${GREEN}✓ Prerequisites validated${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 2: Set GCP Project
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[2/6]${NC} Setting GCP project to ${PROJECT_ID}..."
gcloud config set project ${PROJECT_ID}
echo -e "${GREEN}✓ Project set${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 3: Build Docker Images with Cloud Build
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[3/6]${NC} Building Docker images with Cloud Build..."

# Submit build to Cloud Build
echo "Submitting build configuration..."
gcloud builds submit --config=cloudbuild.yaml .

echo -e "${GREEN}✓ Docker images built and pushed to Artifact Registry${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 4: Initialize Terraform
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[4/6]${NC} Initializing Terraform..."

cd infrastructure/terraform

# Initialize Terraform
terraform init -upgrade

echo -e "${GREEN}✓ Terraform initialized${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 5: Plan Terraform Changes
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[5/6]${NC} Planning Terraform changes..."

# Create terraform plan
terraform plan \
    -var="project_id=${PROJECT_ID}" \
    -var="region=${REGION}" \
    -out=tfplan

echo ""
echo -e "${YELLOW}Review the plan above. Do you want to apply these changes? (yes/no)${NC}"
read -r CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${RED}Deployment cancelled${NC}"
    exit 0
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Step 6: Apply Terraform Configuration
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${YELLOW}[6/6]${NC} Applying Terraform configuration..."

terraform apply tfplan

echo -e "${GREEN}✓ Infrastructure deployed${NC}"
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# Get Service URLs
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Deployment Complete! 🎉${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Get the URLs from terraform outputs
FRONTEND_URL=$(terraform output -raw frontend_url 2>/dev/null || echo "Not available")
BACKEND_URL=$(terraform output -raw backend_url 2>/dev/null || echo "Not available")
AI_ENGINE_URL=$(terraform output -raw ai_engine_url 2>/dev/null || echo "Not available")

echo -e "${GREEN}Service URLs:${NC}"
echo -e "  Frontend:   ${BLUE}${FRONTEND_URL}${NC}"
echo -e "  Backend:    ${BLUE}${BACKEND_URL}${NC}"
echo -e "  AI Engine:  ${BLUE}${AI_ENGINE_URL}${NC}"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Verify services are running: gcloud run services list"
echo "  2. Check logs: gcloud logging read --limit 50"
echo "  3. Monitor in Cloud Console: https://console.cloud.google.com/run?project=${PROJECT_ID}"
echo ""

cd ../..
