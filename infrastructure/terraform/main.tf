# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Terraform Infrastructure                     ║
# ║  Полная автоматизация GCP инфраструктуры                                  ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Опционально: Remote state в GCS
  # backend "gcs" {
  #   bucket = "codementor-terraform-state"
  #   prefix = "terraform/state"
  # }
}

# ═══════════════════════════════════════════════════════════════════════════
# 📋 VARIABLES
# ═══════════════════════════════════════════════════════════════════════════

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "project_name" {
  description = "Human-readable project name"
  type        = string
  default     = "CodeMentor AI Platform"
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "billing_account" {
  description = "GCP Billing Account ID"
  type        = string
  default     = ""
}

variable "org_id" {
  description = "GCP Organization ID (optional)"
  type        = string
  default     = ""
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "enable_vertex_ai" {
  description = "Enable Vertex AI APIs"
  type        = bool
  default     = true
}

variable "min_instances" {
  description = "Minimum number of Cloud Run instances (0 for cost optimization)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum number of Cloud Run instances"
  type        = number
  default     = 10
}

variable "enable_cdn" {
  description = "Enable Cloud CDN for frontend (recommended for production)"
  type        = bool
  default     = false
}

# ═══════════════════════════════════════════════════════════════════════════
# 🏗️ PROVIDERS
# ═══════════════════════════════════════════════════════════════════════════

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 LOCAL VALUES
# ═══════════════════════════════════════════════════════════════════════════

locals {
  services = {
    frontend  = "codementor-frontend"
    backend   = "codementor-backend"
    ai_engine = "codementor-ai-engine"
  }

  labels = {
    project     = "codementor"
    environment = var.environment
    managed_by  = "terraform"
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔌 ENABLE APIS
# ═══════════════════════════════════════════════════════════════════════════

resource "google_project_service" "apis" {
  for_each = toset([
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "containerregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "iam.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com",
    "compute.googleapis.com",
  ])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

# Vertex AI APIs (опционально)
resource "google_project_service" "vertex_ai_apis" {
  for_each = var.enable_vertex_ai ? toset([
    "aiplatform.googleapis.com",
    "ml.googleapis.com",
    "notebooks.googleapis.com",
  ]) : toset([])

  project            = var.project_id
  service            = each.value
  disable_on_destroy = false
}

# ═══════════════════════════════════════════════════════════════════════════
# 📦 ARTIFACT REGISTRY
# ═══════════════════════════════════════════════════════════════════════════

resource "google_artifact_registry_repository" "app" {
  provider = google-beta

  location      = var.region
  repository_id = "app"
  description   = "CodeMentor AI Platform Docker images"
  format        = "DOCKER"

  labels = local.labels

  depends_on = [google_project_service.apis["artifactregistry.googleapis.com"]]
}

# ═══════════════════════════════════════════════════════════════════════════
# 👤 SERVICE ACCOUNTS
# ═══════════════════════════════════════════════════════════════════════════

# Deployer Service Account (для CI/CD)
resource "google_service_account" "deployer" {
  account_id   = "codementor-deployer"
  display_name = "CodeMentor Deployer"
  description  = "Service account for CI/CD deployments"
}

# Cloud Run Service Account (для runtime)
resource "google_service_account" "cloud_run" {
  account_id   = "codementor-cloudrun"
  display_name = "CodeMentor Cloud Run"
  description  = "Service account for Cloud Run services"
}

# AI Engine Service Account (с доступом к Vertex AI)
resource "google_service_account" "ai_engine" {
  account_id   = "codementor-ai-engine"
  display_name = "CodeMentor AI Engine"
  description  = "Service account for AI Engine with Vertex AI access"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔐 IAM BINDINGS
# ═══════════════════════════════════════════════════════════════════════════

# Deployer roles
resource "google_project_iam_member" "deployer_roles" {
  for_each = toset([
    "roles/run.admin",
    "roles/cloudbuild.builds.editor",
    "roles/storage.admin",
    "roles/artifactregistry.admin",
    "roles/iam.serviceAccountUser",
    "roles/secretmanager.secretAccessor",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}

# Cloud Run roles
resource "google_project_iam_member" "cloudrun_roles" {
  for_each = toset([
    "roles/secretmanager.secretAccessor",
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
  ])

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# AI Engine roles (включая Vertex AI)
resource "google_project_iam_member" "ai_engine_roles" {
  for_each = toset(concat(
    [
      "roles/secretmanager.secretAccessor",
      "roles/logging.logWriter",
      "roles/monitoring.metricWriter",
    ],
    var.enable_vertex_ai ? [
      "roles/aiplatform.user",
      "roles/ml.developer",
    ] : []
  ))

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.ai_engine.email}"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔑 SERVICE ACCOUNT KEY (для GitHub Actions)
# ═══════════════════════════════════════════════════════════════════════════

resource "google_service_account_key" "deployer_key" {
  service_account_id = google_service_account.deployer.name
  public_key_type    = "TYPE_X509_PEM_FILE"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔒 SECRET MANAGER
# ═══════════════════════════════════════════════════════════════════════════

resource "google_secret_manager_secret" "app_secrets" {
  for_each = toset([
    "database-url",
    "jwt-secret",
    "api-key",
  ])

  secret_id = each.value

  labels = local.labels

  replication {
    auto {}
  }

  depends_on = [google_project_service.apis["secretmanager.googleapis.com"]]
}

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 CLOUD RUN SERVICES
# ═══════════════════════════════════════════════════════════════════════════

# Frontend
resource "google_cloud_run_v2_service" "frontend" {
  name     = local.services.frontend
  location = var.region

  template {
    service_account = google_service_account.cloud_run.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/app/frontend:latest"

      ports {
        container_port = 3000
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "BACKEND_URL"
        value = "https://${local.services.backend}-${var.project_id}.${var.region}.run.app"
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  labels = merge(local.labels, {
    tier = "frontend"
    cost_center = "platform"
  })

  depends_on = [
    google_project_service.apis["run.googleapis.com"],
    google_artifact_registry_repository.app,
  ]

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
    ]
  }
}

# Backend
resource "google_cloud_run_v2_service" "backend" {
  name     = local.services.backend
  location = var.region

  template {
    service_account = google_service_account.cloud_run.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/app/backend:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
        startup_cpu_boost = true  # Cost optimization: faster cold starts
      }

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "AI_ENGINE_URL"
        value = "https://${local.services.ai_engine}-${var.project_id}.${var.region}.run.app"
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  labels = merge(local.labels, {
    tier = "backend"
    cost_center = "platform"
  })

  depends_on = [
    google_project_service.apis["run.googleapis.com"],
    google_artifact_registry_repository.app,
  ]

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
    ]
  }
}

# AI Engine
resource "google_cloud_run_v2_service" "ai_engine" {
  name     = local.services.ai_engine
  location = var.region

  template {
    service_account = google_service_account.ai_engine.email

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/app/ai-engine:latest"

      ports {
        container_port = 8080
      }

      resources {
        limits = {
          cpu    = "2"
          memory = "4Gi"
        }
        startup_cpu_boost = true  # Cost optimization: faster cold starts
      }

      env {
        name  = "USE_VERTEX_AI"
        value = var.enable_vertex_ai ? "true" : "false"
      }
      env {
        name  = "GCP_PROJECT_ID"
        value = var.project_id
      }
      env {
        name  = "GCP_LOCATION"
        value = var.region
      }
      env {
        name  = "VERTEX_MODEL"
        value = "gemini-pro"
      }
      env {
        name  = "FLASK_ENV"
        value = var.environment == "prod" ? "production" : "development"
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = 5  # Lower max for cost control
    }

    timeout = "300s"

    # Cost optimization: execution environment
    execution_environment = "EXECUTION_ENVIRONMENT_GEN2"
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  labels = local.labels

  depends_on = [
    google_project_service.apis["run.googleapis.com"],
    google_artifact_registry_repository.app,
  ]

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
    ]
  }
}

# ═══════════════════════════════════════════════════════════════════════════
# 🌐 IAM - PUBLIC ACCESS
# ═══════════════════════════════════════════════════════════════════════════

# Frontend - публичный доступ
resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# Backend - публичный доступ
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

# AI Engine - только аутентифицированный доступ
resource "google_cloud_run_v2_service_iam_member" "ai_engine_backend" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.ai_engine.name
  role     = "roles/run.invoker"
  member   = "serviceAccount:${google_service_account.cloud_run.email}"
}

# ═══════════════════════════════════════════════════════════════════════════
# 📊 OUTPUTS
# ═══════════════════════════════════════════════════════════════════════════

output "frontend_url" {
  description = "Frontend service URL"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "backend_url" {
  description = "Backend service URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "ai_engine_url" {
  description = "AI Engine service URL"
  value       = google_cloud_run_v2_service.ai_engine.uri
}

output "artifact_registry_repository" {
  description = "Artifact Registry repository URL"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.app.repository_id}"
}

output "deployer_service_account" {
  description = "Deployer service account email"
  value       = google_service_account.deployer.email
}

output "project_id" {
  description = "GCP Project ID"
  value       = var.project_id
}

output "region" {
  description = "GCP Region"
  value       = var.region
}

