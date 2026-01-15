#!/bin/bash
# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║  🚀 CodeMentor AI Platform - GCP Bootstrap Script                         ║
# ║  Полная автоматизация создания инфраструктуры                             ║
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
TERRAFORM_DIR="$(dirname "$SCRIPT_DIR")/terraform"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# ═══════════════════════════════════════════════════════════════════════════
# 🎨 FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

print_banner() {
    echo -e "${PURPLE}"
    cat << 'EOF'
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ██████╗ ██████╗ ██████╗ ███████╗███╗   ███╗███████╗███╗   ██╗████████╗  ║
║  ██╔════╝██╔═══██╗██╔══██╗██╔════╝████╗ ████║██╔════╝████╗  ██║╚══██╔══╝  ║
║  ██║     ██║   ██║██║  ██║█████╗  ██╔████╔██║█████╗  ██╔██╗ ██║   ██║     ║
║  ██║     ██║   ██║██║  ██║██╔══╝  ██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║     ║
║  ╚██████╗╚██████╔╝██████╔╝███████╗██║ ╚═╝ ██║███████╗██║ ╚████║   ██║     ║
║   ╚═════╝ ╚═════╝ ╚═════╝ ╚══════╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝     ║
║                                                                           ║
║                    🏗️  GCP Infrastructure Bootstrap                       ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
}

print_header() {
    echo -e "\n${PURPLE}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}║${NC} ${CYAN}$1${NC}"
    echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${GREEN}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        print_error "$1 не установлен"
        return 1
    fi
    print_success "$1 найден"
    return 0
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔍 PREREQUISITES CHECK
# ═══════════════════════════════════════════════════════════════════════════

check_prerequisites() {
    print_header "🔍 Проверка зависимостей"

    local missing=0

    check_command "gcloud" || missing=1
    check_command "terraform" || {
        print_warning "Terraform не найден, устанавливаю..."
        install_terraform
    }
    check_command "jq" || {
        print_warning "jq не найден, устанавливаю..."
        sudo apt-get update && sudo apt-get install -y jq
    }

    if [ $missing -eq 1 ]; then
        print_error "Установите недостающие зависимости и повторите"
        exit 1
    fi

    print_success "Все зависимости установлены"
}

install_terraform() {
    print_step "Установка Terraform..."

    # HashiCorp GPG key
    wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

    # Repository
    echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

    # Install
    sudo apt-get update && sudo apt-get install -y terraform

    print_success "Terraform установлен: $(terraform version -json | jq -r '.terraform_version')"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔐 GCP AUTHENTICATION
# ═══════════════════════════════════════════════════════════════════════════

authenticate_gcp() {
    print_header "🔐 Аутентификация в GCP"

    # Проверяем текущую аутентификацию
    CURRENT_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>/dev/null || echo "")

    if [ -n "$CURRENT_ACCOUNT" ]; then
        print_success "Уже аутентифицирован как: $CURRENT_ACCOUNT"
        read -p "Использовать этот аккаунт? [Y/n]: " use_current
        if [[ "$use_current" =~ ^[Nn] ]]; then
            gcloud auth login --no-launch-browser
            gcloud auth application-default login --no-launch-browser
        fi
    else
        print_step "Требуется аутентификация..."
        gcloud auth login --no-launch-browser
        gcloud auth application-default login --no-launch-browser
    fi

    print_success "Аутентификация завершена"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🏗️ PROJECT SETUP
# ═══════════════════════════════════════════════════════════════════════════

setup_project() {
    print_header "🏗️ Настройка GCP проекта"

    # Получаем список проектов
    print_step "Получение списка проектов..."
    PROJECTS=$(gcloud projects list --format="value(projectId)" 2>/dev/null | head -20)

    echo -e "${CYAN}Выберите действие:${NC}"
    echo -e "  ${GREEN}1${NC}) Использовать существующий проект"
    echo -e "  ${GREEN}2${NC}) Создать новый проект"
    echo ""
    read -p "Ваш выбор [1-2]: " choice

    case $choice in
        1)
            if [ -z "$PROJECTS" ]; then
                print_error "Проекты не найдены"
                exit 1
            fi

            echo -e "\n${CYAN}Доступные проекты:${NC}"
            echo "$PROJECTS" | nl -w2 -s') '
            echo ""
            read -p "Введите номер проекта: " project_num
            PROJECT_ID=$(echo "$PROJECTS" | sed -n "${project_num}p")
            ;;
        2)
            read -p "Введите ID нового проекта: " PROJECT_ID
            read -p "Введите название проекта: " PROJECT_NAME

            print_step "Создание проекта $PROJECT_ID..."
            gcloud projects create "$PROJECT_ID" --name="$PROJECT_NAME" || {
                print_error "Не удалось создать проект"
                exit 1
            }

            # Привязка биллинга
            print_step "Получение биллинг аккаунтов..."
            BILLING_ACCOUNTS=$(gcloud billing accounts list --format="value(name)" 2>/dev/null)

            if [ -n "$BILLING_ACCOUNTS" ]; then
                echo -e "\n${CYAN}Доступные биллинг аккаунты:${NC}"
                echo "$BILLING_ACCOUNTS" | nl -w2 -s') '
                echo ""
                read -p "Введите номер биллинг аккаунта: " billing_num
                BILLING_ACCOUNT=$(echo "$BILLING_ACCOUNTS" | sed -n "${billing_num}p")

                print_step "Привязка биллинга..."
                gcloud billing projects link "$PROJECT_ID" --billing-account="$BILLING_ACCOUNT"
            else
                print_warning "Биллинг аккаунты не найдены. Привяжите вручную в Console."
            fi
            ;;
        *)
            print_error "Неверный выбор"
            exit 1
            ;;
    esac

    if [ -z "$PROJECT_ID" ]; then
        print_error "ID проекта не указан"
        exit 1
    fi

    print_step "Установка проекта по умолчанию: $PROJECT_ID"
    gcloud config set project "$PROJECT_ID"

    export PROJECT_ID
    print_success "Проект настроен: $PROJECT_ID"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🔧 TERRAFORM SETUP
# ═══════════════════════════════════════════════════════════════════════════

setup_terraform() {
    print_header "🔧 Настройка Terraform"

    cd "$TERRAFORM_DIR"

    # Создаём terraform.tfvars
    print_step "Создание terraform.tfvars..."

    read -p "Регион [us-central1]: " REGION
    REGION=${REGION:-us-central1}

    read -p "Окружение (dev/staging/prod) [dev]: " ENVIRONMENT
    ENVIRONMENT=${ENVIRONMENT:-dev}

    read -p "Включить Vertex AI? [Y/n]: " enable_vertex
    ENABLE_VERTEX_AI="true"
    [[ "$enable_vertex" =~ ^[Nn] ]] && ENABLE_VERTEX_AI="false"

    cat > terraform.tfvars << EOF
# Auto-generated by bootstrap.sh
project_id       = "$PROJECT_ID"
region           = "$REGION"
environment      = "$ENVIRONMENT"
enable_vertex_ai = $ENABLE_VERTEX_AI
EOF

    print_success "terraform.tfvars создан"

    # Инициализация Terraform
    print_step "Инициализация Terraform..."
    terraform init

    print_success "Terraform инициализирован"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 APPLY INFRASTRUCTURE
# ═══════════════════════════════════════════════════════════════════════════

apply_infrastructure() {
    print_header "🚀 Применение инфраструктуры"

    cd "$TERRAFORM_DIR"

    # Plan
    print_step "Создание плана..."
    terraform plan -out=tfplan

    echo ""
    read -p "Применить изменения? [y/N]: " apply_confirm

    if [[ "$apply_confirm" =~ ^[Yy] ]]; then
        print_step "Применение инфраструктуры..."
        terraform apply tfplan

        rm -f tfplan

        print_success "Инфраструктура создана!"
    else
        print_warning "Отменено пользователем"
        rm -f tfplan
        exit 0
    fi
}

# ═══════════════════════════════════════════════════════════════════════════
# 📋 SHOW RESULTS
# ═══════════════════════════════════════════════════════════════════════════

show_results() {
    print_header "📋 Результаты"

    cd "$TERRAFORM_DIR"

    echo -e "${CYAN}Service URLs:${NC}"
    echo -e "  🎨 Frontend:  ${GREEN}$(terraform output -raw frontend_url 2>/dev/null || echo 'pending')${NC}"
    echo -e "  ⚙️  Backend:   ${GREEN}$(terraform output -raw backend_url 2>/dev/null || echo 'pending')${NC}"
    echo -e "  🤖 AI Engine: ${GREEN}$(terraform output -raw ai_engine_url 2>/dev/null || echo 'pending')${NC}"
    echo ""

    echo -e "${CYAN}Artifact Registry:${NC}"
    echo -e "  📦 ${GREEN}$(terraform output -raw artifact_registry_url 2>/dev/null || echo 'pending')${NC}"
    echo ""

    # Сохраняем ключ для GitHub
    print_step "Сохранение ключа для GitHub Actions..."
    terraform output -raw deployer_key_json 2>/dev/null | base64 -d > "$PROJECT_ROOT/.gcloud/github-actions-key.json" 2>/dev/null || true

    if [ -f "$PROJECT_ROOT/.gcloud/github-actions-key.json" ]; then
        print_success "Ключ сохранён в .gcloud/github-actions-key.json"
        echo ""
        echo -e "${YELLOW}⚠ ВАЖНО: Добавьте этот ключ в GitHub Secrets:${NC}"
        echo -e "  1. Откройте: ${CYAN}https://github.com/YOUR_REPO/settings/secrets/actions${NC}"
        echo -e "  2. Создайте секрет ${GREEN}GCP_CREDENTIALS${NC}"
        echo -e "  3. Вставьте содержимое файла .gcloud/github-actions-key.json"
        echo -e "  4. Создайте секрет ${GREEN}GCP_PROJECT_ID${NC} = ${GREEN}$PROJECT_ID${NC}"
    fi

    echo ""
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}  🎉 Инфраструктура готова!${NC}"
    echo -e "${PURPLE}═══════════════════════════════════════════════════════════════${NC}"
}

# ═══════════════════════════════════════════════════════════════════════════
# 🎬 MAIN
# ═══════════════════════════════════════════════════════════════════════════

main() {
    print_banner

    check_prerequisites
    authenticate_gcp
    setup_project
    setup_terraform
    apply_infrastructure
    show_results
}

# Запуск
main "$@"
