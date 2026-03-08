#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Manual GCP Deployment                        ║
# ║  Ручное развёртывание на Google Cloud Platform                             ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 КОНФИГУРАЦИЯ
# ═══════════════════════════════════════════════════════════════════════════

PROJECT_ID="codementor-ai-platform"
REGION="us-central1"
REGISTRY="us-central1-docker.pkg.dev"
REPOSITORY="app"

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║${NC} ${CYAN}$1${NC}"
    echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔐 ПРОВЕРКА АУТЕНТИФИКАЦИИ
# ═══════════════════════════════════════════════════════════════════════════

print_header "🔐 Проверка аутентификации GCP"

if ! gcloud auth list 2>&1 | grep -q "ACTIVE"; then
    print_error "Не найдена активная учётная запись GCP"
    echo ""
    echo -e "${CYAN}Пожалуйста, выполните одно из:${NC}"
    echo -e "  ${YELLOW}1.${NC} gcloud auth login"
    echo -e "  ${YELLOW}2.${NC} gcloud auth application-default login"
    echo -e "  ${YELLOW}3.${NC} Установите GOOGLE_APPLICATION_CREDENTIALS переменную"
    exit 1
fi

print_success "Найдена активная учётная запись"

# Проверим текущий проект
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ "$CURRENT_PROJECT" != "$PROJECT_ID" ]; then
    print_step "Установка проекта: $PROJECT_ID"
    gcloud config set project "$PROJECT_ID" --quiet
fi

print_success "Проект: $PROJECT_ID"

# ═══════════════════════════════════════════════════════════════════════════
# ☁️  ВКЛЮЧЕНИЕ НЕОБХОДИМЫХ СЕРВИСОВ
# ═══════════════════════════════════════════════════════════════════════════

print_header "☁️ Включение GCP сервисов"

SERVICES=(
    "run.googleapis.com"
    "artifactregistry.googleapis.com"
    "cloudbuild.googleapis.com"
)

for service in "${SERVICES[@]}"; do
    print_step "Включение $service..."
    gcloud services enable "$service" --quiet 2>&1 | grep -i "enabled\|already" || true
done

print_success "Сервисы включены"

# ═══════════════════════════════════════════════════════════════════════════
# 📦 СОЗДАНИЕ ARTIFACT REGISTRY (если не существует)
# ═══════════════════════════════════════════════════════════════════════════

print_header "📦 Настройка Artifact Registry"

REPO_EXISTS=$(gcloud artifacts repositories list --location="$REGION" --format="value(name)" 2>/dev/null | grep -w "$REPOSITORY" || echo "")

if [ -z "$REPO_EXISTS" ]; then
    print_step "Создание репозитория: $REPOSITORY"
    gcloud artifacts repositories create "$REPOSITORY" \
        --repository-format=docker \
        --location="$REGION" \
        --quiet 2>&1 | grep -i "created\|already" || true
    print_success "Репозиторий создан"
else
    print_success "Репозиторий уже существует: $REPOSITORY"
fi

# Настройка Docker аутентификации
print_step "Настройка Docker аутентификации для Artifact Registry"
gcloud auth configure-docker "$REGISTRY" --quiet

print_success "Docker аутентификация настроена"

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 FRONTEND DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════

print_header "🎨 Развёртывание Frontend"

FRONTEND_IMAGE="$REGISTRY/$PROJECT_ID/$REPOSITORY/frontend:$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"

if [ ! -f "frontend/Dockerfile" ]; then
    print_error "frontend/Dockerfile не найден"
    exit 1
fi

print_step "Сборка Docker образа: $FRONTEND_IMAGE"
cd frontend
docker build -t "$FRONTEND_IMAGE" .
print_success "Образ собран"

print_step "Загрузка образа в Artifact Registry"
docker push "$FRONTEND_IMAGE"
print_success "Образ загружен"

print_step "Развёртывание на Cloud Run"
cd ..
gcloud run deploy codementor-frontend \
    --image="$FRONTEND_IMAGE" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --max-instances=10 \
    --quiet

FRONTEND_URL=$(gcloud run services describe codementor-frontend \
    --region="$REGION" \
    --format='value(status.url)')
print_success "Frontend развёрнут: $FRONTEND_URL"

# ═══════════════════════════════════════════════════════════════════════════
# ⚙️ BACKEND DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════

print_header "⚙️ Развёртывание Backend"

BACKEND_IMAGE="$REGISTRY/$PROJECT_ID/$REPOSITORY/backend:$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"

if [ ! -f "backend/Dockerfile" ]; then
    print_error "backend/Dockerfile не найден"
    exit 1
fi

print_step "Сборка Docker образа: $BACKEND_IMAGE"
cd backend
docker build -t "$BACKEND_IMAGE" .
print_success "Образ собран"

print_step "Загрузка образа в Artifact Registry"
docker push "$BACKEND_IMAGE"
print_success "Образ загружен"

print_step "Развёртывание на Cloud Run"
cd ..
gcloud run deploy codementor-backend \
    --image="$BACKEND_IMAGE" \
    --platform=managed \
    --region="$REGION" \
    --allow-unauthenticated \
    --set-env-vars="NODE_ENV=production,PORT=8080" \
    --max-instances=10 \
    --memory=512Mi \
    --quiet

BACKEND_URL=$(gcloud run services describe codementor-backend \
    --region="$REGION" \
    --format='value(status.url)')
print_success "Backend развёрнут: $BACKEND_URL"

# ═══════════════════════════════════════════════════════════════════════════
# 🤖 AI ENGINE DEPLOYMENT
# ═══════════════════════════════════════════════════════════════════════════

print_header "🤖 Развёртывание AI Engine"

AI_IMAGE="$REGISTRY/$PROJECT_ID/$REPOSITORY/ai-engine:$(git rev-parse --short HEAD 2>/dev/null || echo 'latest')"

if [ ! -f "ai-engine/Dockerfile" ]; then
    print_error "ai-engine/Dockerfile не найден"
    exit 1
fi

print_step "Сборка Docker образа: $AI_IMAGE"
cd ai-engine
docker build -t "$AI_IMAGE" .
print_success "Образ собран"

print_step "Загрузка образа в Artifact Registry"
docker push "$AI_IMAGE"
print_success "Образ загружен"

print_step "Развёртывание на Cloud Run"
cd ..
gcloud run deploy codementor-ai-engine \
    --image="$AI_IMAGE" \
    --platform=managed \
    --region="$REGION" \
    --no-allow-unauthenticated \
    --set-env-vars="FLASK_ENV=production,PORT=8080" \
    --max-instances=5 \
    --memory=2Gi \
    --cpu=2 \
    --quiet

AI_URL=$(gcloud run services describe codementor-ai-engine \
    --region="$REGION" \
    --format='value(status.url)')
print_success "AI Engine развёрнут: $AI_URL"

# ═══════════════════════════════════════════════════════════════════════════
# 📊 ИТОГОВАЯ ИНФОРМАЦИЯ
# ═══════════════════════════════════════════════════════════════════════════

print_header "✅ Развёртывание завершено"

echo -e "${CYAN}Доступные сервисы:${NC}"
echo -e "  🎨 Frontend:  ${GREEN}$FRONTEND_URL${NC}"
echo -e "  ⚙️  Backend:   ${GREEN}$BACKEND_URL${NC}"
echo -e "  🤖 AI Engine: ${GREEN}$AI_URL${NC}"

echo ""
echo -e "${CYAN}GCP Console:${NC}"
echo -e "  https://console.cloud.google.com/run?project=$PROJECT_ID"

echo ""
echo -e "${GREEN}✓ Все компоненты развёрнуты!${NC}"
