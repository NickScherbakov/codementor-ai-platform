#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - Development Server                           ║
# ║  Запуск всех сервисов для локальной разработки                            ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

print_banner() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════════════════════════════════════════╗"
    echo "║                                                                           ║"
    echo "║   ██████╗ ██████╗ ██████╗ ███████╗███╗   ███╗███████╗███╗   ██╗████████╗  ║"
    echo "║  ██╔════╝██╔═══██╗██╔══██╗██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝  ║"
    echo "║  ██║     ██║   ██║██║  ██║█████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║     ║"
    echo "║  ██║     ██║   ██║██║  ██║██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║     ║"
    echo "║  ╚██████╗╚██████╔╝██████╔╝███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║     ║"
    echo "║   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝     ║"
    echo "║                                                                           ║"
    echo "║                    🤖 AI Platform - Development Mode                      ║"
    echo "║                                                                           ║"
    echo "╚═══════════════════════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

cleanup() {
    echo -e "\n${YELLOW}⚠ Остановка сервисов...${NC}"
    kill $(jobs -p) 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

print_banner

echo -e "${CYAN}📍 Директория проекта: ${NC}$PROJECT_ROOT"
echo ""

# Проверка зависимостей
echo -e "${GREEN}▶${NC} Проверка зависимостей..."

if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ]; then
    echo -e "${YELLOW}  📦 Установка Frontend зависимостей...${NC}"
    cd "$PROJECT_ROOT/frontend" && npm ci --legacy-peer-deps
fi

if [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
    echo -e "${YELLOW}  📦 Установка Backend зависимостей...${NC}"
    cd "$PROJECT_ROOT/backend" && npm ci
fi

echo -e "${GREEN}✓${NC} Зависимости готовы"
echo ""

# Запуск сервисов
echo -e "${CYAN}🚀 Запуск сервисов...${NC}"
echo ""

# AI Engine (Python)
echo -e "${GREEN}▶${NC} Запуск AI Engine (порт 5000)..."
cd "$PROJECT_ROOT/ai-engine"
PORT=5000 python main.py &
AI_PID=$!

sleep 2

# Backend (Node.js)
echo -e "${GREEN}▶${NC} Запуск Backend (порт 3001)..."
cd "$PROJECT_ROOT/backend"
PORT=3001 node server.js &
BACKEND_PID=$!

sleep 2

# Frontend (Next.js)
echo -e "${GREEN}▶${NC} Запуск Frontend (порт 3000)..."
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!

sleep 3

echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Все сервисы запущены!${NC}"
echo ""
echo -e "${CYAN}📍 URLs:${NC}"
echo -e "   🎨 Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "   ⚙️  Backend:   ${GREEN}http://localhost:3001${NC}"
echo -e "   🤖 AI Engine: ${GREEN}http://localhost:5000${NC}"
echo ""
echo -e "${CYAN}📋 PIDs:${NC}"
echo -e "   Frontend:  $FRONTEND_PID"
echo -e "   Backend:   $BACKEND_PID"
echo -e "   AI Engine: $AI_PID"
echo ""
echo -e "${YELLOW}Нажмите Ctrl+C для остановки всех сервисов${NC}"
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════════════════${NC}"

# Ожидание
wait
