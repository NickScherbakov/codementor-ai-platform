# ⚡ Quick Start - Быстрый старт деплоя

> 5 минут до запуска на GCP!

---

## 🎯 TL;DR

```bash
# 1. Настройка GCP (один раз)
bash .devcontainer/gcp-auth.sh

# 2. Деплой
git push origin main  # Автоматический деплой через GitHub Actions
# или
gcloud builds submit --config cloudbuild.yaml .
```

---

## 📋 Чеклист перед деплоем

- [ ] GCP проект создан и биллинг подключён
- [ ] GitHub Secrets настроены:
  - [ ] `GCP_CREDENTIALS` - JSON ключ сервисного аккаунта
  - [ ] `GCP_PROJECT_ID` - ID проекта
- [ ] API включены (Cloud Run, Cloud Build, Artifact Registry)

---

## 🚀 Варианты запуска

### Локально (разработка)

```bash
# Все сервисы одной командой
bash scripts/dev.sh

# Или через Docker
docker compose up -d
```

### GitHub Actions (продакшн)

Push в `main` → автоматический деплой

### Cloud Build (ручной)

```bash
gcloud builds submit --config cloudbuild.yaml .
```

---

## 🔗 URLs после деплоя

| Сервис | URL |
|--------|-----|
| 🎨 Frontend | `https://codementor-frontend-HASH.run.app` |
| ⚙️ Backend | `https://codementor-backend-HASH.run.app` |
| 🤖 AI Engine | `https://codementor-ai-engine-HASH.run.app` |

---

## 📚 Подробная документация

- [Полное руководство по деплою](./DEPLOYMENT_GUIDE.md)
- [Исходный промпт](./deploing_prompt.md)

---

<div align="center">

**🎉 Удачного деплоя!**

</div>
