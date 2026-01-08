# ⚙️ Figma Integration Checklist & Quick Start

## Фаза 1️⃣: Подготовка (1-2 дня)

### Шаг 1: Получить Figma токены
- [ ] Перейти в https://www.figma.com/settings/tokens
- [ ] Создать Personal Access Token с доступами:
  - `file_content:read`
  - `webhooks:write`
  - `file_key:read`
- [ ] Сохранить токен в 1Password/KeePass (СЕКРЕТНО!)
- [ ] Получить File Key из URL проекта: `qqeukvj1InYIsaVBsMGCB6`
- [ ] Получить Team ID из Figma settings

### Шаг 2: Подготовить GitHub
- [ ] Создать GitHub Personal Access Token (repo, workflow доступы)
- [ ] Сохранить в GitHub Secrets (Settings → Secrets → Actions)
- [ ] Разрешить GitHub Actions в репозитории

### Шаг 3: Настроить окружение
```bash
# В корне проекта создать .env.figma
cat > .env.figma << EOF
FIGMA_TOKEN=figd_your_token_here
FIGMA_TEAM_ID=your_team_id
FIGMA_FILE_KEY=qqeukvj1InYIsaVBsMGCB6

GITHUB_TOKEN=ghp_your_token_here
GITHUB_REPO_OWNER=NickScherbakov
GITHUB_REPO_NAME=codementor-ai-platform

WEBHOOK_SECRET=your_random_secret_here
WEBHOOK_URL=https://your-domain.com/api/webhooks/figma

NODE_ENV=development
PORT=3333
EOF

# Добавить в .gitignore
echo ".env.figma" >> .gitignore
```

---

## Фаза 2️⃣: Создать MCP Server (2-3 дня)

### Шаг 1: Инициализировать проект
```bash
# Создать MCP Server структуру
mkdir -p mcp-servers/figma-codegen/src/{tools,utils,types}
cd mcp-servers/figma-codegen

# Инициализировать package.json
npm init -y

# Установить зависимости
npm install --save-dev \
  typescript \
  @types/node \
  ts-node \
  nodemon

npm install \
  @modelcontextprotocol/sdk \
  axios \
  dotenv \
  zod \
  prettier \
  express \
  cors
```

### Шаг 2: Создать основные файлы

**package.json скрипты:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest"
  }
}
```

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  }
}
```

---

## Фаза 3️⃣: Реализовать основные компоненты (3-5 дней)

### Приоритет 1: Core Clients
- [ ] `FigmaClient` - подключение к Figma API
- [ ] `GitHubClient` - интеграция с GitHub
- [ ] `WebHookServer` - слушание событий от Figma

### Приоритет 2: Code Generation
- [ ] `CodeGenerator.generateReactComponent()`
- [ ] `CodeGenerator.generateTypeScript()`
- [ ] `CodeGenerator.generateTests()`

### Приоритет 3: MCP Tools
- [ ] `generate_react_component` tool
- [ ] `parse_figma_components` tool
- [ ] `create_github_pr` tool

### Приоритет 4: Automation
- [ ] GitHub Actions workflow
- [ ] Webhook validation
- [ ] Error handling & logging

---

## Фаза 4️⃣: Интеграция и развертывание (2-3 дня)

### Docker & Docker Compose
```bash
# Добавить в docker-compose.yml
# (см. FIGMA_INTEGRATION_PLAN.md)

# Собрать контейнер
docker-compose build figma-codegen-mcp

# Запустить локально
docker-compose up figma-codegen-mcp
```

### Nginx WebHook endpoint
```bash
# Обновить nginx.conf
# (см. FIGMA_INTEGRATION_PLAN.md)

# Проверить синтаксис
nginx -t

# Перезагрузить
sudo systemctl reload nginx
```

### GitHub Actions
```bash
# Создать workflow
mkdir -p .github/workflows
touch .github/workflows/figma-codegen.yml

# (см. FIGMA_INTEGRATION_PLAN.md)
```

---

## Фаза 5️⃣: Тестирование (1-2 дня)

### Unit Tests
```bash
# Тестировать FigmaClient
npm run test -- figma-client.test.ts

# Тестировать CodeGenerator
npm run test -- code-generator.test.ts

# Тестировать GitHubClient
npm run test -- github-client.test.ts
```

### Integration Tests
```bash
# Тестировать полный workflow:
# 1. Figma → MCP Server
# 2. MCP Server → GitHub PR
```

### Manual Testing
```bash
# 1. Создать тестовый компонент в Figma
# 2. Отправить webhook вручную:
curl -X POST http://localhost:3333/webhooks/figma \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Secret: $WEBHOOK_SECRET" \
  -d '{
    "event_type": "FILE_UPDATE",
    "file_key": "qqeukvj1InYIsaVBsMGCB6",
    "file_name": "AI-Platform-Integration"
  }'

# 3. Проверить, что PR создан в GitHub
# 4. Проверить, что код сгенерирован правильно
```

---

## Фаза 6️⃣: Оптимизация & Мониторинг (1-2 недели)

### Performance
- [ ] Кэширование Figma API ответов (Redis)
- [ ] Batch webhook processing
- [ ] Оптимизация parsing логики

### Monitoring
- [ ] Логирование всех операций
- [ ] Prometheus metrics
- [ ] Grafana dashboard

### Error Handling
- [ ] Retry logic для API calls
- [ ] Fallback strategies
- [ ] Alert notifications

---

## 📊 Метрики успеха

| Метрика | Цель | Способ измерения |
|---------|------|-----------------|
| Время генерации компонента | < 5 мин | Логи MCP Server |
| PR accuracy | > 95% | Manual code review |
| Test coverage | > 80% | Jest coverage report |
| WebHook delivery success | > 99% | Figma webhook logs |
| GitHub API rate limits | < 60% used | GitHub API monitoring |

---

## 🚨 Потенциальные проблемы & Решения

### Проблема 1: WebHook не доставляется
**Решение:**
```bash
# 1. Проверить Figma webhook logs
# 2. Убедиться, что WEBHOOK_URL доступен из интернета
# 3. Проверить firewall правила
# 4. Добавить retry mechanism в MCP Server
```

### Проблема 2: GitHub API rate limit
**Решение:**
```bash
# Использовать GitHub Apps вместо Personal Access Token
# App rate limit: 15000 requests/hour (vs 60 для token)
```

### Проблема 3: Figma API возвращает старые данные
**Решение:**
```typescript
// Добавить cache invalidation logic
// Или использовать file version from webhook
await figmaClient.getComponents(fileKey, { forceRefresh: true });
```

### Проблема 4: Генерированный код не компилируется
**Решение:**
```bash
# 1. Запустить TypeScript compiler проверку в MCP Server
# 2. Добавить code linting (ESLint)
# 3. Добавить code formatting (Prettier)
# 4. Не создавать PR если compilation fails
```

---

## 🔗 Полезные ссылки

- [Figma API Documentation](https://www.figma.com/developers/api)
- [Figma Webhooks](https://www.figma.com/developers/api#webhooks)
- [MCP Specification](https://modelcontextprotocol.io)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## 📝 Следующие шаги

1. ✅ Прочитать FIGMA_INTEGRATION_PLAN.md (полный план)
2. ⏭️ Завершить Фазу 1 (подготовка) — **сегодня**
3. ⏭️ Начать Фазу 2 (создать MCP Server) — **завтра**
4. ⏭️ Тестировать на одном компоненте (Button/Primary)
5. ⏭️ Масштабировать на все компоненты

---

**Последнее обновление:** Январь 8, 2026  
**Статус:** Готово к имплементации ✅

