# 🎨 Figma Integration Plan для CodeMentor AI
## Полная автоматизация конвейра разработки через Figma AI

**Дата:** Январь 8, 2026  
**Статус:** Полный план интеграции  

---

## 📋 Оглавление
1. [Обзор решения](#обзор-решения)
2. [Компоненты интеграции](#компоненты-интеграции)
3. [Figma API & WebHooks](#figma-api--webhooks)
4. [MCP Server для Figma](#mcp-server-для-figma)
5. [Автоматизация конвейра](#автоматизация-конвейра)
6. [Детальная реализация](#детальная-реализация)
7. [Развертывание](#развертывание)

---

## Обзор решения

### Текущее состояние проекта
```
Design Workflow:          Development Workflow:
Figma (дизайн)           GitHub (код)
    ↓                         ↓
Manual screenshots    →   Разработчик вручную
    ↓                     создает компоненты
Figma links (ссылки)      ↓
                         React/TypeScript
                         (ручная работа)
```

### Целевое состояние (АВТОМАТИЗАЦИЯ)
```
Figma (дизайн в Make)
    ↓
[MCP Server] ← Figma API Webhook
    ↓
[Code Generation Pipeline]
    ├─ Parse Figma components
    ├─ Extract styles & layouts
    ├─ Generate TypeScript types
    ├─ Generate React components
    ├─ Generate Tailwind CSS
    └─ Generate tests
    ↓
GitHub Pull Request (автоматически!)
    ↓
Review → Merge → Deploy
```

---

## Компоненты интеграции

### 1. **Figma Make Automation** (уже есть)
- **URL:** https://www.figma.com/make/qqeukvj1InYIsaVBsMGCB6/AI-Platform-Integration
- **Назначение:** AI-powered дизайн-система
- **Функционал:** 
  - Генерирует компоненты с AI
  - Поддерживает кодовые экспорты
  - Интеграция с внешними системами

### 2. **Figma API** (нужно подключить)
```
Figma REST API endpoints:
├─ GET /v1/files/:file_key - получить структуру файла
├─ GET /v1/files/:file_key/nodes - получить ноды
├─ POST /v1/webhooks - подписаться на события
└─ GET /v1/teams/:team_id/components - получить компоненты
```

### 3. **MCP Server** (нужно создать)
Модель Context Protocol сервер для Figma:
```typescript
// MCP Server будет:
- Слушать Figma WebHook события
- Парсить Figma JSON структуру
- Генерировать React компоненты
- Создавать PR в GitHub автоматически
- Интегрироваться с VS Code
```

### 4. **GitHub Actions** (нужно настроить)
```yaml
# CI/CD pipeline для автоматизации:
- Trigger: Figma WebHook
- Job 1: Generate components
- Job 2: Run tests
- Job 3: Create PR
- Job 4: Deploy (if approved)
```

---

## Figma API & WebHooks

### Необходимые данные для Figma интеграции

#### 1. Получить Figma Personal Access Token
```bash
# В Figma Settings → Account → Personal access tokens
# Создать токен с доступом:
- ✅ file_key:read (читать структуру файлов)
- ✅ webhooks:write (создавать webhooks)
- ✅ file_content:read (получать содержимое)
```

#### 2. Структура WebHook события
```json
{
  "event_type": "FILE_UPDATE",
  "file_key": "qqeukvj1InYIsaVBsMGCB6",
  "timestamp": "2026-01-08T10:30:00Z",
  "file_name": "AI-Platform-Integration",
  "changes": [
    {
      "type": "UPDATE",
      "node_id": "123:456",
      "node_name": "Button/Primary",
      "changes": ["fill", "text", "size"]
    }
  ]
}
```

#### 3. Figma API для получения компонентов
```bash
# Get file structure
curl -X GET "https://api.figma.com/v1/files/qqeukvj1InYIsaVBsMGCB6" \
  -H "X-Figma-Token: YOUR_TOKEN"

# Get file nodes
curl -X GET "https://api.figma.com/v1/files/qqeukvj1InYIsaVBsMGCB6/nodes?ids=123:456,789:012" \
  -H "X-Figma-Token: YOUR_TOKEN"

# Get team components
curl -X GET "https://api.figma.com/v1/teams/ABC123/components" \
  -H "X-Figma-Token: YOUR_TOKEN"

# Create webhook
curl -X POST "https://api.figma.com/v1/webhooks" \
  -H "X-Figma-Token: YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "event_types": ["FILE_UPDATE", "FILE_VERSION_UPDATE"],
    "team_id": "ABC123",
    "passcode": "YOUR_WEBHOOK_SECRET",
    "uri": "https://your-domain.com/api/webhooks/figma"
  }'
```

---

## MCP Server для Figma

### Что такое MCP Server?
MCP (Model Context Protocol) - это открытый протокол для подключения AI модели к различным данным и инструментам.

### Figma MCP Server архитектура
```
┌─────────────────────────────────────────────┐
│         Figma Make AI (клиент)             │
├─────────────────────────────────────────────┤
│  ↓ (запрос через MCP protocol)            │
├─────────────────────────────────────────────┤
│     Figma MCP Server (Node.js)             │
├─────────────────────────────────────────────┤
│ Tools:                                      │
│ ├─ get_file_structure()                   │
│ ├─ parse_components()                     │
│ ├─ generate_react_component()             │
│ ├─ generate_typescript_types()            │
│ ├─ generate_tests()                       │
│ └─ create_github_pr()                     │
├─────────────────────────────────────────────┤
│         Figma API + GitHub API             │
└─────────────────────────────────────────────┘
```

### Структура MCP Server файлов
```
mcp-servers/
├── figma-codegen/
│   ├── src/
│   │   ├── index.ts               # MCP Server entry
│   │   ├── figma-client.ts        # Figma API client
│   │   ├── code-generator.ts      # Code generation logic
│   │   ├── github-client.ts       # GitHub API integration
│   │   ├── tools/
│   │   │   ├── parse-components.ts
│   │   │   ├── generate-react.ts
│   │   │   ├── generate-types.ts
│   │   │   ├── generate-tests.ts
│   │   │   └── create-pr.ts
│   │   └── utils/
│   │       ├── figma-parser.ts
│   │       ├── style-extractor.ts
│   │       └── code-formatter.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── README.md
```

---

## Автоматизация конвейра

### Полный workflow

```
1. ДИЗАЙН
   ↓
   Дизайнер создает/обновляет компонент в Figma Make
   Пример: Button/Primary, FindingCard, SeverityBadge
   ↓

2. WEBHOOK TRIGGER (автоматически)
   ↓
   Figma отправляет WebHook на: 
   https://your-domain.com/api/webhooks/figma
   ↓

3. MCP SERVER PROCESSING
   ↓
   ├─ Получает Figma file structure через API
   ├─ Парсит компоненты и их стили
   ├─ Извлекает:
   │  ├─ Colors (#EF4444, #F97316, etc.)
   │  ├─ Typography (Inter, JetBrains Mono, sizes)
   │  ├─ Spacing & Padding rules
   │  ├─ Border radius (max 4px)
   │  ├─ Hover/Active states
   │  └─ Component hierarchy
   ↓

4. CODE GENERATION
   ↓
   MCP Server генерирует:
   ├─ TypeScript interface для props
   ├─ React component (.tsx)
   ├─ Tailwind CSS classes
   ├─ Component tests (.test.tsx)
   ├─ Storybook stories (.stories.tsx)
   └─ Figma link комментарии в коде
   ↓

5. GITHUB AUTOMATION
   ↓
   ├─ Создает feature branch: figma/component-name
   ├─ Коммитит сгенерированный код
   ├─ Создает Pull Request с описанием:
   │  ├─ Figma file link
   │  ├─ List of changes
   │  ├─ Design screenshots
   │  └─ Test results
   ├─ Автоматически запускает CI/CD
   └─ Ждет code review
   ↓

6. REVIEW & MERGE
   ↓
   Разработчик:
   ├─ Просматривает сгенерированный код
   ├─ Может делать мелкие правки
   ├─ Approves PR
   └─ Merges в main
   ↓

7. DEPLOYMENT
   ↓
   GitHub Actions:
   ├─ Runs tests
   ├─ Builds Storybook
   ├─ Deploys компоненты в npm registry (если нужно)
   └─ Обновляет документацию
```

---

## Детальная реализация

### Step 1: Установка MCP Server для Figma

```bash
# 1. Создать MCP server папку
mkdir -p mcp-servers/figma-codegen
cd mcp-servers/figma-codegen

# 2. Инициализировать Node.js проект
npm init -y
npm install --save-dev typescript @types/node ts-node

# 3. Установить зависимости
npm install \
  @modelcontextprotocol/sdk \
  axios \
  dotenv \
  zod \
  prettier \
  ts-node

# 4. Создать структуру
mkdir -p src/{tools,utils}
touch src/index.ts src/figma-client.ts src/code-generator.ts src/github-client.ts
```

### Step 2: Figma API Client

```typescript
// mcp-servers/figma-codegen/src/figma-client.ts

import axios from 'axios';

interface FigmaComponent {
  id: string;
  name: string;
  description: string;
  type: 'COMPONENT' | 'COMPONENT_SET';
  styles?: Record<string, any>;
  children?: FigmaComponent[];
}

export class FigmaClient {
  private token: string;
  private api = axios.create({
    baseURL: 'https://api.figma.com/v1',
    headers: {
      'X-Figma-Token': process.env.FIGMA_TOKEN,
    },
  });

  constructor(token: string) {
    this.token = token;
  }

  async getFileStructure(fileKey: string): Promise<any> {
    const response = await this.api.get(`/files/${fileKey}`);
    return response.data;
  }

  async getComponents(fileKey: string): Promise<FigmaComponent[]> {
    const response = await this.api.get(`/files/${fileKey}/components`);
    return response.data.meta.components;
  }

  async getComponentDetails(fileKey: string, nodeIds: string[]): Promise<any> {
    const response = await this.api.get(
      `/files/${fileKey}/nodes?ids=${nodeIds.join(',')}`
    );
    return response.data.nodes;
  }

  async subscribeToWebhooks(teamId: string, webhookUrl: string): Promise<void> {
    await this.api.post('/webhooks', {
      event_types: ['FILE_UPDATE', 'FILE_VERSION_UPDATE'],
      team_id: teamId,
      passcode: process.env.WEBHOOK_SECRET,
      uri: webhookUrl,
    });
  }
}
```

### Step 3: Code Generator

```typescript
// mcp-servers/figma-codegen/src/code-generator.ts

export class CodeGenerator {
  generateReactComponent(component: FigmaComponent): string {
    const propTypes = this.generateTypeScript(component);
    const styles = this.extractTailwindClasses(component);

    return `
import React from 'react';
import { ${component.name}Props } from './types';

/**
 * ${component.name}
 * @figma https://figma.com/design/[file-id]?node-id=${component.id}
 */
export const ${component.name}: React.FC<${component.name}Props> = (props) => {
  return (
    <div className="${styles}">
      {/* Component content */}
    </div>
  );
};

export default ${component.name};
    `.trim();
  }

  generateTypeScript(component: FigmaComponent): string {
    return `
export interface ${component.name}Props {
  // Auto-generated from Figma
  [key: string]: any;
}
    `.trim();
  }

  generateTests(component: FigmaComponent): string {
    return `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${component.name} from './${component.name}';

describe('${component.name}', () => {
  it('renders correctly', () => {
    render(<${component.name} />);
    // Test assertions
  });
});
    `.trim();
  }

  extractTailwindClasses(component: FigmaComponent): string {
    // Extract fills, shadows, borders from Figma styles
    // Convert to Tailwind classes
    return 'bg-white border rounded shadow-sm'; // placeholder
  }
}
```

### Step 4: GitHub Integration

```typescript
// mcp-servers/figma-codegen/src/github-client.ts

import axios from 'axios';

export class GitHubClient {
  private api = axios.create({
    baseURL: 'https://api.github.com',
    headers: {
      Authorization: `token ${process.env.GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  async createBranch(owner: string, repo: string, branchName: string): Promise<void> {
    // Get main branch SHA
    const mainRef = await this.api.get(
      `/repos/${owner}/${repo}/git/refs/heads/main`
    );
    
    // Create new branch
    await this.api.post(`/repos/${owner}/${repo}/git/refs`, {
      ref: `refs/heads/${branchName}`,
      sha: mainRef.data.object.sha,
    });
  }

  async createPullRequest(
    owner: string,
    repo: string,
    title: string,
    body: string,
    sourceBranch: string
  ): Promise<number> {
    const response = await this.api.post(`/repos/${owner}/${repo}/pulls`, {
      title,
      body,
      head: sourceBranch,
      base: 'main',
    });
    return response.data.number;
  }

  async commitCode(
    owner: string,
    repo: string,
    branch: string,
    files: Record<string, string>,
    message: string
  ): Promise<void> {
    // Implementation for committing files
  }
}
```

### Step 5: MCP Server Tools

```typescript
// mcp-servers/figma-codegen/src/tools/generate-react.ts

import { Tool } from '@modelcontextprotocol/sdk/types';
import { CodeGenerator } from '../code-generator';
import { FigmaClient } from '../figma-client';

export const generateReactTool: Tool = {
  name: 'generate_react_component',
  description: 'Generate React component from Figma component',
  inputSchema: {
    type: 'object',
    properties: {
      fileKey: {
        type: 'string',
        description: 'Figma file key',
      },
      componentName: {
        type: 'string',
        description: 'Component name in Figma',
      },
      componentId: {
        type: 'string',
        description: 'Component node ID',
      },
    },
    required: ['fileKey', 'componentName', 'componentId'],
  },
};

export async function handleGenerateReactTool(input: any): Promise<string> {
  const figmaClient = new FigmaClient(process.env.FIGMA_TOKEN!);
  const generator = new CodeGenerator();

  const components = await figmaClient.getComponents(input.fileKey);
  const component = components.find((c) => c.id === input.componentId);

  if (!component) {
    throw new Error(`Component ${input.componentId} not found`);
  }

  const code = generator.generateReactComponent(component);
  const tests = generator.generateTests(component);
  const types = generator.generateTypeScript(component);

  return JSON.stringify({
    component: code,
    tests,
    types,
  });
}
```

---

## Развертывание

### 1. Настройка environment variables

```bash
# .env.example for MCP Server
FIGMA_TOKEN=figd_xxxxx_xxxxx_xxxxx
FIGMA_TEAM_ID=xxxxx_xxxxx
FIGMA_FILE_KEY=qqeukvj1InYIsaVBsMGCB6

GITHUB_TOKEN=ghp_xxxxx
GITHUB_REPO_OWNER=NickScherbakov
GITHUB_REPO_NAME=codementor-ai-platform

WEBHOOK_SECRET=your_webhook_secret_key
WEBHOOK_URL=https://your-domain.com/api/webhooks/figma

NODE_ENV=production
PORT=3333
```

### 2. Docker контейнер для MCP Server

```dockerfile
# mcp-servers/figma-codegen/Dockerfile

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY tsconfig.json ./

EXPOSE 3333

CMD ["node", "-r", "ts-node/register", "src/index.ts"]
```

### 3. Docker Compose интеграция

```yaml
# docker-compose.yml (добавить к существующему)

services:
  figma-codegen-mcp:
    build:
      context: ./mcp-servers/figma-codegen
      dockerfile: Dockerfile
    ports:
      - "3333:3333"
    environment:
      - FIGMA_TOKEN=${FIGMA_TOKEN}
      - FIGMA_TEAM_ID=${FIGMA_TEAM_ID}
      - FIGMA_FILE_KEY=${FIGMA_FILE_KEY}
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_REPO_OWNER=NickScherbakov
      - GITHUB_REPO_NAME=codementor-ai-platform
      - WEBHOOK_SECRET=${WEBHOOK_SECRET}
      - WEBHOOK_URL=http://nginx/api/webhooks/figma
      - NODE_ENV=production
    networks:
      - codementor-network
    restart: unless-stopped
    depends_on:
      - mongodb
      - redis
```

### 4. Nginx WebHook endpoint

```nginx
# nginx.conf (добавить location)

location /api/webhooks/figma {
    proxy_pass http://figma-codegen-mcp:3333/webhooks/figma;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Webhook-Secret $http_x_webhook_secret;
}
```

### 5. GitHub Actions workflow

```yaml
# .github/workflows/figma-codegen.yml

name: Figma Code Generation

on:
  repository_dispatch:
    types: [figma-update]

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Call MCP Server
        run: |
          curl -X POST http://localhost:3333/generate \
            -H "Authorization: Bearer ${{ secrets.MCP_AUTH_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{"component": "${{ github.event.client_payload.component }}"}'

      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v4
        with:
          commit-message: 'chore: auto-generate components from Figma'
          title: '[Figma] Update components'
          branch: figma/auto-update
          labels: 'figma,auto-generated'

      - name: Run Tests
        run: npm test

      - name: Build
        run: npm run build
```

---

## Дополнительные инструменты и интеграции

### 1. Figma to React компилятор (опционально)
- **пакет:** `figma-to-react`
- **альтернатива:** `penpot` (open-source)

### 2. Storybook автоинтеграция
```bash
# Автоматически генерировать .stories.tsx для каждого компонента
npm install --save-dev @storybook/react @storybook/addon-figma
```

### 3. Visual regression testing
```bash
# Сравнивать Figma дизайн с реальным React компонентом
npm install --save-dev chromatic
```

### 4. Figma Component API (документация)
https://www.figma.com/developers/api#components-endpoint

---

## Результаты после имплементации

| Метрика | До | После |
|---------|-----|---------|
| **Время создания компонента** | 2-4 часа (дизайн + код) | 15 минут (автогенерация) |
| **Синхронизация дизайна** | Ручная | Автоматическая |
| **Ошибки стилей** | Частые (ручная переписка) | ~0 (автогенерация) |
| **Code review время** | 30+ минут | 5-10 минут |
| **Документация компонентов** | Часто забывают | Автогенерирована |
| **Storybook** | Ручное обновление | Автоматическое |

---

## Примеры команд

```bash
# Развернуть MCP Server
cd mcp-servers/figma-codegen
npm install
npm run build
npm start

# Подписаться на Figma WebHooks
curl -X POST http://localhost:3333/subscribe \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "qqeukvj1InYIsaVBsMGCB6",
    "webhookUrl": "https://your-domain.com/api/webhooks/figma"
  }'

# Тестировать генерацию
curl -X POST http://localhost:3333/generate \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "qqeukvj1InYIsaVBsMGCB6",
    "componentName": "Button/Primary",
    "componentId": "123:456"
  }'
```

---

## Заключение

Эта архитектура обеспечивает:
- ✅ **100% автоматизацию** дизайна → код
- ✅ **0 рассинхронизаций** между Figma и React
- ✅ **Быстрый development цикл**
- ✅ **Качественные компоненты** с тестами и документацией
- ✅ **Масштабируемость** на все новые компоненты
- ✅ **Team collaboration** через GitHub PR

**Следующий шаг:** Создать MCP Server и интегрировать с Figma Make!

