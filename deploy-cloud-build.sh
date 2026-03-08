#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - GCP Cloud Build Deploy                      ║
# ║  Развёртывание через Cloud Build (без локальной аутентификации)           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

PROJECT_ID="codementor-ai-platform"
REGION="us-central1"

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}🚀 GCP Cloud Build & Cloud Run Deploy${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}\n"

# ═══════════════════════════════════════════════════════════════════════════
# АЛЬТЕРНАТИВНЫЙ СПОСОБ: Использование Cloud Build
# ═══════════════════════════════════════════════════════════════════════════

echo -e "${CYAN}📝 ВАЖНО: Для облачной сборки используйте один из способов:${NC}\n"

echo -e "${YELLOW}Способ 1: Через Google Cloud Console (веб)${NC}"
echo -e "${CYAN}1. Откройте${NC} https://console.cloud.google.com/run?project=$PROJECT_ID"
echo -e "${CYAN}2. Нажмите ${YELLOW}'Create Service'${NC}"
echo -e "${CYAN}3. Выберите ${YELLOW}'Deploy from source code'${NC}"
echo -e "${CYAN}4. Выберите репозиторий (GitHub: NickScherbakov/codementor-ai-platform)${NC}"
echo -e "${CYAN}5. Branch: ${YELLOW}main${NC}"
echo -e "${CYAN}6. Build type: ${YELLOW}Cloud Build${NC}"

echo -e "\n${YELLOW}Способ 2: Через gcloud (требует аутентификации)${NC}"
echo -e "${CYAN}1. Сначала аутентифицируйтесь:${NC}"
echo -e "   ${YELLOW}gcloud auth login${NC}"
echo -e "   ${YELLOW}gcloud config set project $PROJECT_ID${NC}"

echo -e "${CYAN}2. Затем запустите Cloud Build:${NC}"
echo -e "   ${YELLOW}gcloud builds submit --region=$REGION --config=cloudbuild.yaml${NC}"

echo -e "\n${YELLOW}Способ 3: Использование Service Account JSON${NC}"
echo -e "${CYAN}1. Скачайте Service Account ключ из Google Cloud Console${NC}"
echo -e "${CYAN}2. Установите переменную окружения:${NC}"
echo -e "   ${YELLOW}export GOOGLE_APPLICATION_CREDENTIALS=/path/to/key.json${NC}"
echo -e "${CYAN}3. Запустите deployment скрипт:${NC}"
echo -e "   ${YELLOW}bash /workspaces/codementor-ai-platform/deploy-manual.sh${NC}"

echo -e "\n${GREEN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📚 Рекомендуемый вариант: Способ 1 (через Cloud Console веб)${NC}"
echo -e "${CYAN}   - Самый надежный${NC}"
echo -e "${CYAN}   - Не требует локальной аутентификации${NC}"
echo -e "${CYAN}   - Можно выбрать конфигурацию в UI${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════════${NC}\n"

# Проверяем наличие cloudbuild.yaml
if [ -f "/workspaces/codementor-ai-platform/cloudbuild.yaml" ]; then
    echo -e "${GREEN}✓${NC} Найден ${YELLOW}cloudbuild.yaml${NC} - файл конфигурации Cloud Build"
    echo ""
    echo -e "${CYAN}Содержимое cloudbuild.yaml:${NC}"
    head -40 "/workspaces/codementor-ai-platform/cloudbuild.yaml"
else
    echo -e "${RED}✗${NC} ${YELLOW}cloudbuild.yaml${NC} не найден"
fi

echo -e "\n${CYAN}🔗 Полезные ссылки:${NC}"
echo -e "   • GCP Console:        https://console.cloud.google.com/?project=$PROJECT_ID"
echo -e "   • Cloud Build:        https://console.cloud.google.com/cloud-build/builds?project=$PROJECT_ID"
echo -e "   • Cloud Run:          https://console.cloud.google.com/run?project=$PROJECT_ID"
echo -e "   • Artifact Registry:  https://console.cloud.google.com/artifacts?project=$PROJECT_ID"
