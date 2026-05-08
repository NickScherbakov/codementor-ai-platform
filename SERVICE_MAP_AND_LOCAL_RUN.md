# Service Map and Local Run Checklist

## Service-by-service map

### 1) Frontend — `codementor-frontend`

| Attribute | Value |
|---|---|
| Language / framework | TypeScript, Next.js 16, React 19, Tailwind, Framer Motion |
| Root directory | `/frontend` |
| Dev entrypoint | `npm run dev` (port 3000) |
| Prod entrypoint | `node .next/standalone/server.js` (port 3000) |
| Cloud Run service | `codementor-frontend` |
| Key env vars | `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_API_URL`, `BACKEND_API_URL` |
| Talks to | Backend via rewrites and route handlers |

### 2) Backend API — `codementor-backend`

| Attribute | Value |
|---|---|
| Language / framework | JavaScript, Node.js 20, Express 4, Socket.IO, Mongoose |
| Root directory | `/backend` |
| Dev entrypoint | `npm run dev` (port 3001) |
| Prod entrypoint | `node server.js` (Cloud Run port 8080) |
| Cloud Run service | `codementor-backend` |
| Key env vars | `JWT_SECRET`, `MONGODB_URI`, `AI_ENGINE_URL` / `PYTHON_AI_ENGINE_URL`, `ALLOWED_ORIGINS` / `FRONTEND_URL` |
| Talks to | MongoDB and AI engine over HTTP |

### 3) AI Engine — `codementor-ai-engine`

| Attribute | Value |
|---|---|
| Language / framework | Python 3.11, Flask, Gunicorn |
| Root directory | `/ai-engine` |
| Dev entrypoint | `python main.py` (port 5000) |
| Prod entrypoint | `gunicorn main:app -b 0.0.0.0:8080` |
| Cloud Run service | `codementor-ai-engine` |
| Key env vars | `USE_VERTEX_AI`, `GCP_PROJECT_ID`, `GCP_LOCATION`, `VERTEX_MODEL`, `REDIS_URL`, `OLLAMA_BASE_URL` |
| Talks to | Redis + optional Vertex AI / Ollama / local models |

---

## Local run checklist

### Prerequisites

- [ ] Node.js 20 installed
- [ ] Python 3.9+ installed
- [ ] Docker + Docker Compose installed (if using compose)
- [ ] MongoDB running
- [ ] Redis running (optional but recommended for AI engine)

### Option A: Docker Compose

```bash
cp ai-engine/.env.example ai-engine/.env
docker compose up --build
```

Access:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- AI engine: `http://localhost:5000`

### Option B: Manual (three terminals)

#### Terminal 1: AI engine

```bash
cd ai-engine
pip install -r requirements.txt
python init_models.py
python main.py
```

Health check:

```bash
curl http://localhost:5000/health
```

#### Terminal 2: Backend

```bash
cd backend
npm install
cp .env.example .env
node server.js
```

Health check:

```bash
curl http://localhost:3001/api/health
```

#### Terminal 3: Frontend

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.local.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Option C: Helper script

```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

