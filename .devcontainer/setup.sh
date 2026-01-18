#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Development Environment Setup                ║
# ║  Автоматическая настройка окружения для GCP и локальной разработки        ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# Цвета для красивого вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} ${CYAN}$1${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 УСТАНОВКА GOOGLE CLOUD SDK
# ═══════════════════════════════════════════════════════════════════════════
print_header "🔧 Установка Google Cloud SDK"

if ! command -v gcloud &> /dev/null; then
    print_step "Загрузка Google Cloud SDK..."
    curl -fsSL https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-linux-x86_64.tar.gz -o /tmp/gcloud.tar.gz
    
    print_step "Распаковка..."
    tar -xf /tmp/gcloud.tar.gz -C /home/vscode/
    
    print_step "Установка..."
    /home/vscode/google-cloud-sdk/install.sh --quiet --path-update=true
    
    # Добавляем в PATH
    echo 'export PATH="/home/vscode/google-cloud-sdk/bin:$PATH"' >> ~/.bashrc
    export PATH="/home/vscode/google-cloud-sdk/bin:$PATH"
    
    print_step "Установка дополнительных компонентов..."
    /home/vscode/google-cloud-sdk/bin/gcloud components install beta cloud-run-proxy docker-credential-gcr --quiet
    
    rm /tmp/gcloud.tar.gz
    print_success "Google Cloud SDK установлен"
else
    print_success "Google Cloud SDK уже установлен"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 📦 УСТАНОВКА ЗАВИСИМОСТЕЙ ПРОЕКТА
# ═══════════════════════════════════════════════════════════════════════════
print_header "📦 Установка зависимостей проекта"

# Frontend
print_step "Установка зависимостей Frontend..."
cd /workspaces/codementor-ai-platform/frontend
if [ -f "pnpm-lock.yaml" ]; then
    npm install -g pnpm
    pnpm install --frozen-lockfile 2>/dev/null || pnpm install
else
    npm ci --legacy-peer-deps 2>/dev/null || npm install --legacy-peer-deps
fi
print_success "Frontend зависимости установлены"

# Backend
print_step "Установка зависимостей Backend..."
cd /workspaces/codementor-ai-platform/backend
npm ci 2>/dev/null || npm install
print_success "Backend зависимости установлены"

# AI Engine
print_step "Установка зависимостей AI Engine..."
cd /workspaces/codementor-ai-platform/ai-engine
pip install --upgrade pip
pip install -r requirements.txt
print_success "AI Engine зависимости установлены"

# ═══════════════════════════════════════════════════════════════════════════
# 🛠️ УСТАНОВКА ДОПОЛНИТЕЛЬНЫХ ИНСТРУМЕНТОВ
# ═══════════════════════════════════════════════════════════════════════════
print_header "🛠️ Установка дополнительных инструментов"

# Python инструменты для разработки
print_step "Установка Python dev tools..."
pip install black flake8 pytest pytest-cov debugpy

# Node.js глобальные инструменты
print_step "Установка Node.js dev tools..."
npm install -g typescript ts-node nodemon concurrently

print_success "Дополнительные инструменты установлены"

# ═══════════════════════════════════════════════════════════════════════════
# 📁 СОЗДАНИЕ НЕОБХОДИМЫХ ДИРЕКТОРИЙ
# ═══════════════════════════════════════════════════════════════════════════
print_header "📁 Создание директорий"

mkdir -p /workspaces/codementor-ai-platform/.gcloud
mkdir -p /workspaces/codementor-ai-platform/logs
mkdir -p /workspaces/codementor-ai-platform/.vscode

print_success "Директории созданы"

# ═══════════════════════════════════════════════════════════════════════════
# 📝 СОЗДАНИЕ ФАЙЛА ОКРУЖЕНИЯ
# ═══════════════════════════════════════════════════════════════════════════
print_header "📝 Настройка переменных окружения"

cd /workspaces/codementor-ai-platform

if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# ═══════════════════════════════════════════════════════════════════════════
# 🚀 CodeMentor AI Platform - Environment Configuration
# ═══════════════════════════════════════════════════════════════════════════

# GCP Configuration
GCP_PROJECT_ID=your-project-id
GCP_REGION=us-central1
GOOGLE_CLOUD_PROJECT=${GCP_PROJECT_ID}

# Service Ports
FRONTEND_PORT=3000
BACKEND_PORT=3001
AI_ENGINE_PORT=5000

# AI Configuration
USE_VERTEX_AI=true
VERTEX_MODEL=gemini-pro
VERTEX_AI_LOCATION=us-central1

# Local Development (Ollama)
OLLAMA_BASE_URL=http://localhost:11434
CHROMA_DB_PATH=./chroma_db

# Debug
NODE_ENV=development
DEBUG=true
EOF
    print_success "Файл .env создан (не забудьте настроить GCP_PROJECT_ID)"
else
    print_warning "Файл .env уже существует"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 🎉 ЗАВЕРШЕНИЕ
# ═══════════════════════════════════════════════════════════════════════════
print_header "🎉 Настройка завершена!"

echo -e "${CYAN}Следующие шаги:${NC}"
echo -e "  ${GREEN}1.${NC} Настройте GCP: ${YELLOW}bash .devcontainer/gcp-auth.sh${NC}"
echo -e "  ${GREEN}2.${NC} Запустите сервисы: ${YELLOW}bash .devcontainer/start.sh${NC}"
echo -e "  ${GREEN}3.${NC} Или используйте VS Code Tasks (Ctrl+Shift+P → Tasks: Run Task)"
echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Happy Coding! 🚀${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
