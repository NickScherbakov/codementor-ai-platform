# 🚀 CodeMentor AI Platform - Руководство по деплою

> Полное руководство по развёртыванию платформы на Google Cloud Platform

---

## 📋 Содержание

1. [Предварительные требования](#-предварительные-требования)
2. [Настройка GCP](#-настройка-gcp)
3. [GitHub Secrets](#-github-secrets)
4. [Методы деплоя](#-методы-деплоя)
5. [Локальная разработка](#-локальная-разработка)
6. [Отладка](#-отладка)
7. [Мониторинг](#-мониторинг)
8. [Troubleshooting](#-troubleshooting)

---

## 📦 Предварительные требования

### Инструменты
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
- [Docker](https://docs.docker.com/get-docker/)
- [Node.js 20+](https://nodejs.org/)
- [Python 3.11+](https://www.python.org/)

### GCP Сервисы
- Cloud Run
- Cloud Build
- Artifact Registry
- Vertex AI (опционально)

---

## ☁️ Настройка GCP

### 1. Создание проекта

```bash
# Создание нового проекта
gcloud projects create codementor-ai --name="CodeMentor AI Platform"

# Установка проекта по умолчанию
gcloud config set project codementor-ai

# Привязка биллинга (замените BILLING_ACCOUNT_ID)
gcloud billing projects link codementor-ai --billing-account=BILLING_ACCOUNT_ID
```

### 2. Включение API

```bash
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  aiplatform.googleapis.com \
  containerregistry.googleapis.com
```

### 3. Создание Service Account

```bash
# Создание сервисного аккаунта
gcloud iam service-accounts create codementor-deployer \
  --display-name="CodeMentor Deployer"

# Назначение ролей
PROJECT_ID=$(gcloud config get-value project)

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.editor"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/artifactregistry.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Создание ключа
gcloud iam service-accounts keys create gcp-key.json \
  --iam-account=codementor-deployer@$PROJECT_ID.iam.gserviceaccount.com
```

### 4. Создание Artifact Registry

```bash
gcloud artifacts repositories create app \
  --repository-format=docker \
  --location=us-central1 \
  --description="CodeMentor Docker images"
```

---

## 🔐 GitHub Secrets

Добавьте следующие секреты в настройках репозитория:

| Secret | Описание |
|--------|----------|
| `GCP_CREDENTIALS` | Содержимое файла `gcp-key.json` |
| `GCP_PROJECT_ID` | ID вашего GCP проекта |

### Как добавить секреты:

1. Перейдите в **Settings** → **Secrets and variables** → **Actions**
2. Нажмите **New repository secret**
3. Добавьте `GCP_CREDENTIALS` с содержимым JSON ключа
4. Добавьте `GCP_PROJECT_ID` с ID проекта

---

## 🚀 Методы деплоя

### Метод 1: GitHub Actions (Рекомендуется)

Автоматический деплой при push в `main`:

```bash
git add .
git commit -m "feat: new feature"
git push origin main
```

Ручной запуск:
1. Перейдите в **Actions** → **Deploy to GCP**
2. Нажмите **Run workflow**
3. Выберите параметры и запустите

### Метод 2: Cloud Build

```bash
# Из корня проекта
gcloud builds submit --config cloudbuild.yaml .
```

### Метод 3: Прямой деплой на Cloud Run

```bash
# Frontend
gcloud run deploy codementor-frontend \
  --source ./frontend \
  --region us-central1 \
  --allow-unauthenticated

# Backend
gcloud run deploy codementor-backend \
  --source ./backend \
  --region us-central1 \
  --allow-unauthenticated

# AI Engine
gcloud run deploy codementor-ai-engine \
  --source ./ai-engine \
  --region us-central1 \
  --no-allow-unauthenticated \
  --memory 4Gi \
  --cpu 2
```

---

## 💻 Локальная разработка

### Codespaces

1. Откройте репозиторий в GitHub
2. Нажмите **Code** → **Codespaces** → **Create codespace**
3. Дождитесь инициализации
4. Запустите: `bash .devcontainer/gcp-auth.sh`

### Docker Compose

```bash
# Запуск всех сервисов
docker compose up -d

# С локальным AI (Ollama)
docker compose --profile local-ai up -d

# Просмотр логов
docker compose logs -f

# Остановка
docker compose down
```

### Без Docker

```bash
# Установка зависимостей
bash .devcontainer/setup.sh

# Запуск всех сервисов
bash scripts/dev.sh
```

---

## 🐛 Отладка

### VS Code Launch Configurations

Используйте встроенные конфигурации отладки:

1. Откройте **Run and Debug** (Ctrl+Shift+D)
2. Выберите конфигурацию:
   - `🎨 Frontend: Debug` - отладка Next.js
   - `⚙️ Backend: Debug` - отладка Express
   - `🤖 AI Engine: Debug` - отладка Flask
   - `🚀 Full Stack: All Services` - все сервисы

### Cloud Code (Remote Debug)

1. Установите расширение **Google Cloud Code**
2. Откройте панель Cloud Run
3. Выберите сервис и нажмите **Attach Debugger**

### Логи Cloud Run

```bash
# Просмотр логов
gcloud run services logs read codementor-frontend --region us-central1

# Стриминг логов
gcloud run services logs tail codementor-frontend --region us-central1
```

---

## 📊 Мониторинг

### Cloud Console

- [Cloud Run Dashboard](https://console.cloud.google.com/run)
- [Cloud Build History](https://console.cloud.google.com/cloud-build/builds)
- [Artifact Registry](https://console.cloud.google.com/artifacts)

### Метрики

```bash
# Статус сервисов
gcloud run services list --region us-central1

# Детали сервиса
gcloud run services describe codementor-frontend --region us-central1
```

---

## 🔧 Troubleshooting

### Ошибка: "Permission denied"

```bash
# Проверьте роли сервисного аккаунта
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:codementor-deployer"
```

### Ошибка: "Image not found"

```bash
# Проверьте Artifact Registry
gcloud artifacts docker images list us-central1-docker.pkg.dev/$PROJECT_ID/app
```

### Ошибка: "Service unavailable"

```bash
# Проверьте логи
gcloud run services logs read SERVICE_NAME --region us-central1 --limit 50

# Проверьте ревизии
gcloud run revisions list --service SERVICE_NAME --region us-central1
```

### Ошибка сборки Frontend

```bash
# Очистите кэш
cd frontend
rm -rf node_modules .next
npm ci --legacy-peer-deps
npm run build
```

---

## 📚 Полезные ссылки

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Artifact Registry Documentation](https://cloud.google.com/artifact-registry/docs)
- [GitHub Actions for GCP](https://github.com/google-github-actions)

---

## 💰 Оптимизация затрат

### Рекомендации

1. **Минимальные инстансы**: Установите `min-instances=0` для dev окружения
2. **Автомасштабирование**: Настройте `max-instances` по нагрузке
3. **Регион**: Используйте `us-central1` для минимальных затрат
4. **Память**: Начните с минимума и увеличивайте по необходимости

### Мониторинг затрат

```bash
# Просмотр биллинга
gcloud billing accounts list
gcloud billing projects describe $PROJECT_ID
```

---

<div align="center">

**🚀 Happy Deploying!**

*CodeMentor AI Platform Team*

</div>
