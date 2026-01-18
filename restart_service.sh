# Run: chmod +x restart_service.sh
gcloud run services update codementor-ai-engine --region us-central1 --force-new-revision --project codementor-ai-platform
