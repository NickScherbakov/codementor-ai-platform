# CodeMentor AI Platform

[![Демо](https://img.shields.io/badge/Демо-Live%20Server-blue?logo=github)](http://104.154.27.195/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Лицензия: MIT](https://img.shields.io/badge/Лицензия-MIT-green.svg)](LICENSE)

Полнофункциональная платформа для изучения программирования, сочетающая искусственный интеллект с проверенными образовательными методиками. Построена на современном стеке Next.js 14 с унифицированной архитектурой.

> **Примечание**: Демо-сервер показывает полный функционал UI. Для локальной разработки используйте `npm run dev` или `docker-compose up`.

---

## 🎯 Два продукта — одна платформа

CodeMentor AI Platform объединяет **два различных подхода к обучению** в едином Next.js приложении:

### 1. 📚 Обучающая платформа
Дружелюбное, геймифицированное обучение программированию с AI-адаптацией

- 🎓 Персонализированные уроки и траектории обучения
- 🏆 Достижения, XP и отслеживание прогресса
- 🌍 Поддержка языков: Python, JavaScript, TypeScript, Java, C++
- 👶 Идеально для начинающих
- **Доступ**: `/dashboard`

### 2. 🔴 Hard Code Review
Жёсткий, бескомпромиссный код-ревью уровня Senior Developer

- 💀 Интервью-стиль технической экспертизы
- 🐛 Обратная связь по багам, безопасности, производительности
- 🔐 3 бесплатных ревью, затем paywall (HTTP 402)
- ⚡ Реальный backend API с детерминированным движком анализа
- **Доступ**: `/review`

---

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- Python 3.9+ (для AI Engine)
- Docker & Docker Compose (рекомендуется)
- MongoDB (или через Docker)
- Redis (или через Docker)

### Вариант A: Docker (рекомендуется)

```bash
# Клонировать репозиторий
git clone https://github.com/NickScherbakov/codementor-ai-platform.git
cd codementor-ai-platform

# Запустить все сервисы
docker-compose up -d
```

Доступ к платформе:
| Сервис | URL | Описание |
|--------|-----|----------|
| 🏠 Главная | http://localhost:3000 | Основная страница |
| 📚 Dashboard | http://localhost:3000/dashboard | Обучающая платформа |
| 🔴 Code Review | http://localhost:3000/review | Hard Code Review |
| 🔌 Backend API | http://localhost:3001 | REST API |
| 🤖 AI Engine | http://localhost:5000 | Python AI сервис |

### Вариант B: Локальная разработка

```bash
# Установка зависимостей
npm install

# Терминал 1 — Next.js Frontend (с Turbopack)
npm run dev

# Терминал 2 — Backend API
npm run backend

# Терминал 3 — AI Engine (опционально)
npm run ai-engine

# Или запустить всё одной командой
npm run dev:all
```

---

## 🔴 Hard Code Review

### Возможности

| Функция | Описание |
|---------|----------|
| ✅ Real Backend | Подключение к `/api/backend/review` endpoint |
| ✅ Pattern Detection | Детерминированный движок обнаружения паттернов |
| ✅ Multi-language | Python, JavaScript, TypeScript |
| ✅ Brutal Feedback | Senior-level техническая экспертиза |
| ✅ Free Tier Gate | 3 бесплатных ревью (IP-based), затем HTTP 402 |

### Страницы Hard Code Review

| Маршрут | Описание |
|---------|----------|
| `/review` | Основное приложение код-ревью |
| `/review/showcase` | Демо библиотеки компонентов |
| `/review/money` | Маркетинговая landing page |
| `/review/tone` | Справка по тону и стилю |
| `/review/tokens` | Документация дизайн-системы |

### UI Компоненты (14 шт.)

```
src/app/components/hard-code-review/
├── HardCodeReviewApp.tsx    # Главный компонент приложения
├── CodeInputPage.tsx        # Страница ввода кода
├── ResultsPage.tsx          # Страница результатов
├── CodeComparison.tsx       # Сравнение кода до/после
├── FindingCard.tsx          # Карточка найденной проблемы
├── FindingsContainer.tsx    # Контейнер для findings
├── SummaryCard.tsx          # Карточка резюме
├── SeverityBadge.tsx        # Бейдж уровня серьёзности
├── NextStepsSection.tsx     # Секция следующих шагов
├── HCRButton.tsx            # Кастомная кнопка
├── LoadingStates.tsx        # Состояния загрузки
├── ComponentShowcase.tsx    # Витрина компонентов
├── api.ts                   # API клиент
└── index.ts                 # Экспорты
```

### API Endpoint

```bash
POST /api/backend/review
Content-Type: application/json

{
  "language": "javascript",
  "code": "function test() { var x = 1; console.log(x); }",
  "mode": "hard"
}
```

**Ответ**:
```json
{
  "summary": "Hard review: 2 high-signal issues found in JavaScript code.",
  "severity": "hard",
  "findings": [
    {
      "type": "style",
      "title": "Debug logging left in runtime path",
      "explain": "Console output increases noise and can leak data.",
      "fix": "Remove debug statements or use structured logging."
    }
  ],
  "next_steps": [
    "Add tests that cover edge cases and failure paths."
  ]
}
```

---

## 🛠 Технологический стек

### Frontend
| Технология | Версия | Назначение |
|------------|--------|------------|
| Next.js | 14.x | Фреймворк (App Router + Turbopack) |
| TypeScript | 5.7 | Типизация |
| Tailwind CSS | 3.x | Стилизация |
| Radix UI | Latest | Базовые UI компоненты |
| Zustand | 4.x | State Management |
| Framer Motion | 10.x | Анимации |
| Monaco Editor | 0.44 | Редактор кода |

### Backend
| Технология | Версия | Назначение |
|------------|--------|------------|
| Node.js | 18+ | Runtime |
| Express | 4.x | HTTP сервер |
| MongoDB | 8.x | База данных |
| Mongoose | 8.x | ODM |
| Socket.io | 4.x | Real-time |
| JWT | 9.x | Аутентификация |

### AI Engine
| Технология | Назначение |
|------------|------------|
| Python Flask | HTTP сервер |
| TinyLlama-1.1B | Чат-модель |
| CodeT5-Small | Анализ кода |
| PyTorch | ML Runtime |

### DevOps
| Технология | Назначение |
|------------|------------|
| Docker | Контейнеризация |
| Docker Compose | Оркестрация |
| Nginx | Reverse Proxy |
| GitHub Actions | CI/CD |

---

## 📁 Структура проекта

```
codementor-ai-platform/
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Главная страница
│   │   ├── layout.tsx              # Корневой layout
│   │   ├── review/                 # 🔴 Hard Code Review
│   │   │   ├── page.tsx            # Основное приложение
│   │   │   ├── layout.tsx          # Навигация review
│   │   │   ├── showcase/page.tsx   # Демо компонентов
│   │   │   ├── tokens/page.tsx     # Дизайн-система
│   │   │   ├── tone/page.tsx       # Справка по тону
│   │   │   └── money/page.tsx      # Маркетинговая страница
│   │   ├── components/
│   │   │   ├── hard-code-review/   # 14 UI компонентов HCR
│   │   │   └── ui/                 # Общие UI компоненты
│   │   ├── dashboard/              # 📚 Обучающая платформа
│   │   └── playground/             # Песочница кода
│   ├── styles/                     # Глобальные стили
│   └── lib/                        # Утилиты
├── backend/                        # Node.js API
│   ├── routes/
│   │   └── review.js               # Review endpoint
│   └── services/
│       └── reviewEngine.js         # Pattern detector
├── ai-engine/                      # Python AI сервис
│   ├── main.py                     # Flask приложение
│   └── requirements.txt            # Python зависимости
├── docs/                           # Документация
├── docker-compose.yml              # Оркестрация контейнеров
├── next.config.js                  # Конфигурация Next.js
├── tailwind.config.js              # Конфигурация Tailwind
└── tsconfig.json                   # Конфигурация TypeScript
```

---

## 📜 Скрипты

```bash
# Разработка
npm run dev              # Next.js с Turbopack
npm run dev:all          # Frontend + Backend + AI Engine

# Сборка и запуск
npm run build            # Production сборка
npm run start            # Production сервер

# Тестирование
npm test                 # Jest тесты
npm run lint             # ESLint проверка
npm run type-check       # TypeScript проверка

# Docker
npm run docker:build     # Сборка образов
npm run docker:up        # Запуск контейнеров
npm run docker:down      # Остановка контейнеров

# Документация
npm run docs:serve       # Локальный сервер документации
npm run docs:validate    # Валидация документации
```

---

## 🔒 Переменные окружения

```bash
# Копировать пример
cp .env.example .env
```

**Обязательные**:
```env
MONGODB_URI=mongodb://localhost:27017/codementor-ai
JWT_SECRET=your-super-secure-secret
REDIS_URL=redis://localhost:6379
```

**Опциональные**:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_API_URL=http://localhost:5000
MODEL_CACHE_DIR=/path/to/model/cache
```

---

## 📚 Документация

| Раздел | Описание |
|--------|----------|
| [📋 Индекс документации](docs/README.md) | Полный хаб документации |
| [🚀 Туториал](docs/TUTORIAL.md) | Пошаговое руководство |
| [💡 Примеры](docs/EXAMPLES.md) | Интерактивные примеры |
| [🏛️ Архитектура](docs/architecture/README.md) | Обзор системы |
| [📡 API Reference](docs/api/README.md) | Справка по API |
| [🚀 Деплой](docs/deployment/README.md) | Руководство по развёртыванию |

### Бизнес-документация
| Раздел | Описание |
|--------|----------|
| [💰 Бизнес-стратегия](docs/BUSINESS_STRATEGY.md) | План монетизации |
| [💳 Конфигурация цен](docs/PRICING_CONFIG.md) | Тарифные планы |
| [🔒 Compliance](docs/COMPLIANCE_ROADMAP.md) | SOC2, FERPA, GDPR |

---

## 🧪 Тестирование

```bash
# Frontend тесты (Jest + React Testing Library)
npm test

# Backend тесты
cd backend && npm test

# AI Engine тесты
cd ai-engine && pytest

# Запуск всех тестов в watch режиме
npm run test:watch
```

---

## 🤝 Участие в разработке

Мы приветствуем контрибьюторов! См. [Contributing Guide](CONTRIBUTING.md).

### Быстрый старт для контрибьюторов

```bash
# 1. Fork репозитория
# 2. Клонировать
git clone https://github.com/YOUR_USERNAME/codementor-ai-platform.git

# 3. Создать ветку
git checkout -b feature/amazing-feature

# 4. Внести изменения и закоммитить
git commit -m "✨ Add amazing feature"

# 5. Push и создать PR
git push origin feature/amazing-feature
```

---

## 📝 Лицензия

MIT License — см. [LICENSE](LICENSE) файл.

---

## 🆘 Поддержка

- **📖 Документация**: [docs/README.md](docs/README.md)
- **🐛 Issues**: [GitHub Issues](https://github.com/NickScherbakov/codementor-ai-platform/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/NickScherbakov/codementor-ai-platform/discussions)

---

## 🔄 Недавние обновления

### v1.0.0 (Январь 2026)
- ✅ Полная миграция на Next.js 14 (App Router)
- ✅ Интеграция Hard Code Review в единую платформу
- ✅ Удаление Vite, унификация сборки
- ✅ 14 новых UI компонентов для Code Review
- ✅ Переход на реальный API backend
- ✅ Улучшенная структура проекта

---

**Создано с ❤️ командой CodeMentor AI**

*Развиваем новое поколение разработчиков через интеллектуальное, адаптивное обучение.*

---

[🇬🇧 English Version](README.md)