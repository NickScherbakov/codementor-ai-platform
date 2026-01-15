#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🔐 CodeMentor AI Platform - GCP Authentication Setup                     ║
# ║  Настройка аутентификации Google Cloud Platform                           ║
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

# Проверка наличия gcloud
if ! command -v gcloud &> /dev/null; then
    print_error "Google Cloud SDK не установлен!"
    echo "Запустите: bash .devcontainer/setup.sh"
    exit 1
fi

print_header "🔐 Настройка GCP аутентификации"

echo -e "${CYAN}Выберите метод аутентификации:${NC}"
echo -e "  ${GREEN}1${NC}) Интерактивный вход (gcloud auth login)"
echo -e "  ${GREEN}2${NC}) Service Account (JSON ключ)"
echo -e "  ${GREEN}3${NC}) Application Default Credentials"
echo ""
read -p "Ваш выбор [1-3]: " choice

case $choice in
    1)
        print_header "🌐 Интерактивный вход"
        print_step "Открытие браузера для аутентификации..."
        gcloud auth login --no-launch-browser
        
        print_step "Настройка Application Default Credentials..."
        gcloud auth application-default login --no-launch-browser
        ;;
    2)
        print_header "🔑 Service Account"
        echo -e "${CYAN}Укажите путь к JSON файлу ключа:${NC}"
        read -p "Путь: " key_path
        
        if [ ! -f "$key_path" ]; then
            print_error "Файл не найден: $key_path"
            exit 1
        fi
        
        print_step "Активация Service Account..."
        gcloud auth activate-service-account --key-file="$key_path"
        
        # Копируем ключ для использования в приложении
        cp "$key_path" /workspaces/codementor-ai-platform/.gcloud/service-account.json
        export GOOGLE_APPLICATION_CREDENTIALS="/workspaces/codementor-ai-platform/.gcloud/service-account.json"
        echo "export GOOGLE_APPLICATION_CREDENTIALS=\"/workspaces/codementor-ai-platform/.gcloud/service-account.json\"" >> ~/.bashrc
        
        print_success "Service Account активирован"
        ;;
    3)
        print_header "📋 Application Default Credentials"
        print_step "Настройка ADC..."
        gcloud auth application-default login --no-launch-browser
        ;;
    *)
        print_error "Неверный выбор"
        exit 1
        ;;
esac

# ═══════════════════════════════════════════════════════════════════════════
# 🏗️ НАСТРОЙКА ПРОЕКТА
# ═══════════════════════════════════════════════════════════════════════════
print_header "🏗️ Настройка GCP проекта"

# Получаем список проектов
print_step "Получение списка проектов..."
PROJECTS=$(gcloud projects list --format="value(projectId)" 2>/dev/null | head -10)

if [ -z "$PROJECTS" ]; then
    print_warning "Проекты не найдены. Создайте проект в Google Cloud Console."
    read -p "Введите ID проекта вручную: " PROJECT_ID
else
    echo -e "${CYAN}Доступные проекты:${NC}"
    echo "$PROJECTS" | nl -w2 -s') '
    echo ""
    read -p "Введите номер проекта или ID: " project_input
    
    if [[ "$project_input" =~ ^[0-9]+$ ]]; then
        PROJECT_ID=$(echo "$PROJECTS" | sed -n "${project_input}p")
    else
        PROJECT_ID="$project_input"
    fi
fi

if [ -z "$PROJECT_ID" ]; then
    print_error "ID проекта не указан"
    exit 1
fi

print_step "Установка проекта: $PROJECT_ID"
gcloud config set project "$PROJECT_ID"

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 ВКЛЮЧЕНИЕ НЕОБХОДИМЫХ API
# ═══════════════════════════════════════════════════════════════════════════
print_header "🔧 Включение GCP API"

APIS=(
    "cloudbuild.googleapis.com"
    "run.googleapis.com"
    "artifactregistry.googleapis.com"
    "aiplatform.googleapis.com"
    "containerregistry.googleapis.com"
)

for api in "${APIS[@]}"; do
    print_step "Включение $api..."
    gcloud services enable "$api" --quiet 2>/dev/null || print_warning "Не удалось включить $api"
done

print_success "API включены"

# ═══════════════════════════════════════════════════════════════════════════
# 📦 СОЗДАНИЕ ARTIFACT REGISTRY
# ═══════════════════════════════════════════════════════════════════════════
print_header "📦 Настройка Artifact Registry"

REGION="us-central1"
REPO_NAME="app"

print_step "Создание репозитория Docker образов..."
gcloud artifacts repositories create "$REPO_NAME" \
    --repository-format=docker \
    --location="$REGION" \
    --description="CodeMentor AI Platform Docker images" \
    2>/dev/null || print_warning "Репозиторий уже существует"

print_step "Настройка Docker аутентификации..."
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

print_success "Artifact Registry настроен"

# ═══════════════════════════════════════════════════════════════════════════
# 📝 ОБНОВЛЕНИЕ .env
# ═══════════════════════════════════════════════════════════════════════════
print_header "📝 Обновление конфигурации"

ENV_FILE="/workspaces/codementor-ai-platform/.env"

if [ -f "$ENV_FILE" ]; then
    sed -i "s/GCP_PROJECT_ID=.*/GCP_PROJECT_ID=$PROJECT_ID/" "$ENV_FILE"
    sed -i "s/GOOGLE_CLOUD_PROJECT=.*/GOOGLE_CLOUD_PROJECT=$PROJECT_ID/" "$ENV_FILE"
    print_success "Файл .env обновлён"
fi

# ═══════════════════════════════════════════════════════════════════════════
# 🎉 ЗАВЕРШЕНИЕ
# ═══════════════════════════════════════════════════════════════════════════
print_header "🎉 GCP настройка завершена!"

echo -e "${CYAN}Конфигурация:${NC}"
echo -e "  ${GREEN}Проект:${NC}  $PROJECT_ID"
echo -e "  ${GREEN}Регион:${NC}  $REGION"
echo -e "  ${GREEN}Registry:${NC} $REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME"
echo ""
echo -e "${CYAN}Следующие шаги:${NC}"
echo -e "  ${GREEN}1.${NC} Деплой через Cloud Build: ${YELLOW}gcloud builds submit --config cloudbuild.yaml .${NC}"
echo -e "  ${GREEN}2.${NC} Или через GitHub Actions: push в main ветку"
echo ""
echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
