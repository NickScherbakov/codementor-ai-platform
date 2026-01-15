#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Service Startup Script                       ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║${NC}  🚀 ${GREEN}CodeMentor AI Platform${NC} - Проверка окружения"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════════╝${NC}"

# Проверка GCP аутентификации
if command -v gcloud &> /dev/null; then
    ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null || echo "")
    if [ -n "$ACCOUNT" ]; then
        echo -e "${GREEN}✓${NC} GCP аутентификация: ${CYAN}$ACCOUNT${NC}"
    else
        echo -e "${YELLOW}⚠${NC} GCP не аутентифицирован. Запустите: ${CYAN}bash .devcontainer/gcp-auth.sh${NC}"
    fi
else
    echo -e "${YELLOW}⚠${NC} Google Cloud SDK не найден"
fi

# Проверка Docker
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓${NC} Docker доступен"
else
    echo -e "${YELLOW}⚠${NC} Docker не найден"
fi

# Проверка Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js: ${CYAN}$NODE_VERSION${NC}"
fi

# Проверка Python
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version)
    echo -e "${GREEN}✓${NC} Python: ${CYAN}$PYTHON_VERSION${NC}"
fi

echo ""
echo -e "${CYAN}Доступные команды:${NC}"
echo -e "  ${GREEN}npm run dev${NC}        - Запуск Frontend (в папке frontend/)"
echo -e "  ${GREEN}npm start${NC}          - Запуск Backend (в папке backend/)"
echo -e "  ${GREEN}python main.py${NC}     - Запуск AI Engine (в папке ai-engine/)"
echo -e "  ${GREEN}bash scripts/dev.sh${NC} - Запуск всех сервисов"
echo ""
echo -e "${CYAN}GCP команды:${NC}"
echo -e "  ${GREEN}gcloud run deploy${NC}  - Деплой на Cloud Run"
echo -e "  ${GREEN}gcloud builds submit${NC} - Запуск Cloud Build"
echo ""
