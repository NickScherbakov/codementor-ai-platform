# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  📤 Terraform Outputs                                                      ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════════════════
# 🔗 SERVICE URLS
# ═══════════════════════════════════════════════════════════════════════════

output "frontend_url" {
  description = "Frontend Cloud Run URL"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "backend_url" {
  description = "Backend Cloud Run URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "ai_engine_url" {
  description = "AI Engine Cloud Run URL"
  value       = google_cloud_run_v2_service.ai_engine.uri
}

# ═══════════════════════════════════════════════════════════════════════════
# 📦 ARTIFACT REGISTRY
# ═══════════════════════════════════════════════════════════════════════════

output "artifact_registry_url" {
  description = "Artifact Registry URL for Docker images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
}

output "docker_image_frontend" {
  description = "Docker image path for Frontend"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}/frontend"
}

output "docker_image_backend" {
  description = "Docker image path for Backend"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}/backend"
}

output "docker_image_ai_engine" {
  description = "Docker image path for AI Engine"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}/ai-engine"
}

# ═══════════════════════════════════════════════════════════════════════════
# 👤 SERVICE ACCOUNTS
# ═══════════════════════════════════════════════════════════════════════════

output "deployer_service_account_email" {
  description = "Deployer Service Account email"
  value       = google_service_account.deployer.email
}

output "cloudrun_service_account_email" {
  description = "Cloud Run Service Account email"
  value       = google_service_account.cloud_run.email
}

output "ai_engine_service_account_email" {
  description = "AI Engine Service Account email"
  value       = google_service_account.ai_engine.email
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔑 DEPLOYER KEY (для GitHub Actions)
# ═══════════════════════════════════════════════════════════════════════════

output "deployer_key_json" {
  description = "Deployer Service Account key (base64 encoded) - ADD TO GITHUB SECRETS AS GCP_CREDENTIALS"
  value       = google_service_account_key.deployer_key.private_key
  sensitive   = true
}

# ═══════════════════════════════════════════════════════════════════════════
# 📋 PROJECT INFO
# ═══════════════════════════════════════════════════════════════════════════

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

# ═══════════════════════════════════════════════════════════════════════════
# 📝 GITHUB SECRETS HELPER
# ═══════════════════════════════════════════════════════════════════════════

output "github_secrets_instructions" {
  description = "Instructions for setting up GitHub Secrets"
  value       = <<-EOT

    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║  🔐 GitHub Secrets Configuration                                          ║
    ╚═══════════════════════════════════════════════════════════════════════════╝

    Add these secrets to your GitHub repository:
    Settings → Secrets and variables → Actions → New repository secret

    1. GCP_PROJECT_ID:
       ${var.project_id}

    2. GCP_CREDENTIALS:
       Run: terraform output -raw deployer_key_json | base64 -d
       Copy the entire JSON output

    ═══════════════════════════════════════════════════════════════════════════

    Service URLs after deployment:
    • Frontend:  ${google_cloud_run_v2_service.frontend.uri}
    • Backend:   ${google_cloud_run_v2_service.backend.uri}
    • AI Engine: ${google_cloud_run_v2_service.ai_engine.uri}

  EOT
}
