# GCP Deployment Guide

This guide provides step-by-step instructions for deploying the CodeMentor AI Platform to Google Cloud Platform (GCP).

## Prerequisites

Before deploying, ensure you have:

1. **Google Cloud Account** with billing enabled
2. **GCP Project** created
3. **gcloud CLI** installed and authenticated
4. **Terraform** (v1.5.0+) installed
5. **Docker** installed (for local testing)

## Architecture Overview

The platform uses a 3-service architecture on Cloud Run:

```
┌─────────────────┐
│  Frontend       │  Next.js (Port 3000)
│  Cloud Run      │  - SSR/Static
└────────┬────────┘
         │
┌────────▼────────┐
│  Backend        │  Node.js/Express (Port 8080)
│  Cloud Run      │  - REST API
└────────┬────────┘
         │
┌────────▼────────┐
│  AI Engine      │  Python/Flask (Port 8080)
│  Cloud Run      │  - Model routing:
└─────────────────┘    • Claude Sonnet 4.5 (Mentorship)
                       • GPT-5.2-Codex (Code Review)
                       • Gemini 3 Flash (Quick Challenges)
                       • Gemini 3 Pro (Infrastructure)
```

## Model Selection Strategy

The platform uses specific AI models for different tasks:

| Model | Use Case | Endpoint |
|-------|----------|----------|
| **Claude Sonnet 4.5** | Onboarding UI text, mentorship dialogues, empathetic guidance | `/ai/mentorship/welcome` |
| **GPT-5.2-Codex** | "Roast My Code" - brutal, senior-level architectural feedback | `/ai/roast` |
| **Gemini 3 Flash** | High-velocity quick start challenges, sub-second responses | `/ai/quick-challenge` |
| **Gemini 3 Pro** | Infrastructure-as-Code (Terraform/HCL), GCP deployment scripts | Used in this guide |

## Quick Start Deployment

### Step 1: Set Environment Variables

```bash
# Set your GCP project ID
export GCP_PROJECT_ID="your-project-id"

# Optional: Set custom region (default: us-central1)
export GCP_REGION="us-central1"
```

### Step 2: Authenticate with GCP

```bash
# Login to gcloud
gcloud auth login

# Set application default credentials
gcloud auth application-default login

# Set the project
gcloud config set project ${GCP_PROJECT_ID}
```

### Step 3: Enable Required APIs

The deployment script will enable these automatically, but you can do it manually:

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  aiplatform.googleapis.com \
  compute.googleapis.com
```

### Step 4: Run Deployment Script

```bash
# Make the script executable (if not already)
chmod +x scripts/deploy-gcp.sh

# Run the deployment
./scripts/deploy-gcp.sh
```

The script will:
1. ✅ Validate prerequisites
2. ✅ Set GCP project
3. ✅ Build Docker images with Cloud Build
4. ✅ Initialize Terraform
5. ✅ Plan infrastructure changes
6. ✅ Apply Terraform configuration
7. ✅ Display service URLs

## Manual Deployment Steps

If you prefer to deploy manually:

### 1. Build and Push Docker Images

```bash
# Submit build to Cloud Build
gcloud builds submit --config=cloudbuild.yaml .
```

### 2. Initialize Terraform

```bash
cd infrastructure/terraform

terraform init -upgrade
```

### 3. Create Terraform Variables File

Create `terraform.tfvars`:

```hcl
project_id       = "your-project-id"
region           = "us-central1"
environment      = "prod"
enable_vertex_ai = true
min_instances    = 0  # Cost optimization: scale to zero
max_instances    = 10
enable_cdn       = true  # Recommended for production
```

### 4. Plan and Apply

```bash
# Review planned changes
terraform plan -var-file=terraform.tfvars

# Apply the configuration
terraform apply -var-file=terraform.tfvars
```

## Post-Deployment Configuration

### 1. Configure Secrets

Store sensitive data in Secret Manager:

```bash
# Database URL (if using external DB)
echo -n "postgresql://user:pass@host:5432/db" | \
  gcloud secrets create database-url --data-file=-

# JWT Secret
echo -n "your-secret-key-here" | \
  gcloud secrets create jwt-secret --data-file=-

# API Key
echo -n "your-api-key-here" | \
  gcloud secrets create api-key --data-file=-
```

### 2. Grant Secret Access

```bash
# Get the Cloud Run service account
SERVICE_ACCOUNT=$(terraform output -raw deployer_service_account)

# Grant access to secrets
gcloud secrets add-iam-policy-binding database-url \
  --member="serviceAccount:${SERVICE_ACCOUNT}" \
  --role="roles/secretmanager.secretAccessor"
```

### 3. Configure Custom Domain (Optional)

```bash
# Map custom domain to Cloud Run service
gcloud run services add-iam-policy-binding codementor-frontend \
  --region=${GCP_REGION} \
  --member="allUsers" \
  --role="roles/run.invoker"

# Follow GCP instructions to verify domain ownership
gcloud beta run domain-mappings create \
  --service=codementor-frontend \
  --domain=yourdomain.com \
  --region=${GCP_REGION}
```

## Cost Optimization

Following Gemini 3 Pro best practices for GCP cost optimization:

### 1. Scale to Zero

```hcl
# In terraform.tfvars
min_instances = 0  # No idle costs
```

### 2. Right-Size Resources

```hcl
# Adjust based on load testing
resources {
  limits = {
    cpu    = "1"      # Start small
    memory = "512Mi"  # Increase if needed
  }
}
```

### 3. Enable Startup CPU Boost

```hcl
startup_cpu_boost = true  # Faster cold starts
```

### 4. Use Generation 2 Execution Environment

```hcl
execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
```

### 5. Set Budget Alerts

```bash
# Create budget alert
gcloud billing budgets create \
  --billing-account=YOUR_BILLING_ACCOUNT \
  --display-name="CodeMentor Monthly Budget" \
  --budget-amount=100USD \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=90 \
  --threshold-rule=percent=100
```

## Monitoring and Logs

### View Service Logs

```bash
# Frontend logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=codementor-frontend" \
  --limit=50 \
  --format=json

# AI Engine logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=codementor-ai-engine" \
  --limit=50 \
  --format=json
```

### View Metrics

```bash
# List Cloud Run services
gcloud run services list

# Describe service
gcloud run services describe codementor-frontend --region=${GCP_REGION}
```

### Cloud Console

Access monitoring dashboard:
```
https://console.cloud.google.com/run?project=${GCP_PROJECT_ID}
```

## Troubleshooting

### Build Fails

```bash
# Check Cloud Build logs
gcloud builds list --limit=5

# View specific build
gcloud builds describe BUILD_ID
```

### Service Not Starting

```bash
# Check service status
gcloud run services describe SERVICE_NAME --region=${GCP_REGION}

# View container logs
gcloud logging read "resource.type=cloud_run_revision" --limit=50
```

### Permission Errors

```bash
# Verify service account permissions
gcloud projects get-iam-policy ${GCP_PROJECT_ID}

# Add missing role
gcloud projects add-iam-policy-binding ${GCP_PROJECT_ID} \
  --member="serviceAccount:SERVICE_ACCOUNT" \
  --role="roles/ROLE_NAME"
```

## CI/CD Integration

### GitHub Actions

Add these secrets to your GitHub repository:

- `GCP_PROJECT_ID`: Your GCP project ID
- `GCP_SA_KEY`: Service account key JSON

Example workflow:

```yaml
name: Deploy to GCP

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v1
        with:
          service_account_key: ${{ secrets.GCP_SA_KEY }}
          project_id: ${{ secrets.GCP_PROJECT_ID }}
      
      - name: Deploy
        env:
          GCP_PROJECT_ID: ${{ secrets.GCP_PROJECT_ID }}
        run: ./scripts/deploy-gcp.sh
```

## Rollback

If you need to rollback a deployment:

```bash
# List revisions
gcloud run revisions list --service=SERVICE_NAME --region=${GCP_REGION}

# Route traffic to previous revision
gcloud run services update-traffic SERVICE_NAME \
  --to-revisions=REVISION_NAME=100 \
  --region=${GCP_REGION}
```

## Cleanup

To destroy all resources:

```bash
cd infrastructure/terraform
terraform destroy -var-file=terraform.tfvars
```

⚠️ **Warning**: This will delete all resources and data!

## Support

For issues or questions:
- GitHub Issues: https://github.com/NickScherbakov/codementor-ai-platform/issues
- Documentation: https://github.com/NickScherbakov/codementor-ai-platform/blob/main/README.md

## Next Steps

After deployment:

1. ✅ Test all endpoints
2. ✅ Configure monitoring alerts
3. ✅ Set up custom domain
4. ✅ Enable Cloud CDN (production)
5. ✅ Configure backup strategy
6. ✅ Set up budget alerts
7. ✅ Review security settings
8. ✅ Load test the platform

---

**Powered by Gemini 3 Pro** - Infrastructure optimization and GCP best practices
