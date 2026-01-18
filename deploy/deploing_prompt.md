# GitHub Copilot Prompt: Deploying a Project to Google Cloud Platform (GCP) from Codespaces

## Task Description
Deploy the GitHub repository to **Google Cloud Platform (GCP)** using **GitHub Codespaces**. The deployment must include:
1. Setting up GCP access via a service account.
2. Automating deployment through **Google Cloud Build** or **GitHub Actions**.
3. Enabling **remote debugging** through Visual Studio Code using the **Cloud Code extension**.
4. Configuring the development environment (DevContainers) for seamless initialization in Codespaces.

---

## Instructions for Completion

### 1. Set Up GCP Access
1. **Create a GCP Service Account**:
   - Go to Google Cloud Console.
   - Create a service account with the following roles:
     - `Cloud Run Admin`
     - `Cloud Build Editor`
     - `Storage Admin`
   - Download the service account key in JSON format.
   - Add this key to GitHub repository secrets:
     - Name: `GCP_CREDENTIALS`
2. Authenticate the Service Account in Codespaces by running:
   ```bash
   gcloud auth activate-service-account --key-file=PATH_TO_KEY.json
   gcloud init
   ```

---

### 2. Automate Deployment to GCP

#### a. Google Cloud Build: Add `cloudbuild.yaml`
In the root of the repository, create a file named `cloudbuild.yaml`:
```yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-app', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-app']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'my-app',
           '--image', 'gcr.io/$PROJECT_ID/my-app',
           '--region', 'us-central1',
           '--platform=managed']
```

#### b. GitHub Actions: Add `.github/workflows/deploy.yml`
Create a GitHub Actions workflow file to automate the deployment process:
```yaml
name: Deploy to GCP

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout Code
      uses: actions/checkout@v3

    - name: Authenticate to GCP
      uses: google-github-actions/auth@v1
      with:
        credentials_json: ${{ secrets.GCP_CREDENTIALS }}

    - name: Build and Deploy
      run: |
        gcloud builds submit --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-app
        gcloud run deploy my-app \
          --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/my-app \
          --platform managed \
          --region us-central1
```

---

### 3. Enable Remote Debugging with Cloud Code
1. Install the **Google Cloud Code** extension in VS Code.
2. Use the extension to connect to your **Cloud Run** instance:
   - In the "Cloud Run" panel, attach the debugger.
3. For debugging, ensure appropriate runtime flags are enabled:
   - Node.js: Use `--inspect=0.0.0.0:9229`.
   - Python: Configure `debugpy` to enable remote debugging.

---

### 4. Configure DevContainer for Codespaces
To automate environment setup in Codespaces, add the following files:

#### `.devcontainer/devcontainer.json`
```json
{
  "name": "GCP Deployment Environment",
  "image": "mcr.microsoft.com/devcontainers/base:ubuntu",
  "features": {},
  "postCreateCommand": "bash .devcontainer/setup.sh",
  "forwardPorts": [9229]
}
```

#### `.devcontainer/setup.sh`
```bash
#!/bin/bash

# Install Google Cloud CLI
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-426.0.0-linux-x86_64.tar.gz
tar -xf google-cloud-cli-426.0.0-linux-x86_64.tar.gz
./google-cloud-sdk/install.sh
```

---

### Outcome
This setup allows deploying the GitHub repository into **GCP Cloud Run**, automates the process via GitHub Actions or Cloud Build, and supports development with **Codespaces** and **Cloud Code** for remote debugging.