# FinSight FastAPI Backend

A production-grade Python FastAPI backend powering the FinSight Trading & AI Financial Copilot platform.

## 🚀 Features

- **FastAPI Framework**: High performance async REST API with auto-generated OpenAPI (`/docs`) docs.
- **PostgreSQL Database**: Async ORM via SQLAlchemy 2.0 (`asyncpg`). Auto fallback to SQLite for zero-config local development.
- **Real-Time WebSockets + Redis**: Pushes live stock price ticks (`/ws/prices`) to clients using Redis Pub/Sub.
- **Stock Market Data**: Free real-time quotes, OHLC historical candles, and ticker lookup via `yfinance`.
- **Claude AI Copilot**: Financial AI assistant powered by Anthropic's Claude API with context-aware portfolio auditing.
- **Deploy Ready**: Pre-configured Docker, Docker Compose, Railway, and Render setup.

---

## 🛠 Local Setup & Running

### 1. Requirements
- Python 3.10+
- (Optional) PostgreSQL & Redis (if using full stack locally, or use Docker)

### 2. Install Dependencies
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Run FastAPI App
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser to inspect interactive Swagger documentation.

---

## 🐳 Docker & Local Multi-Container Stack

Run FastAPI + PostgreSQL + Redis with Docker Compose:
```bash
docker-compose up --build
```

---

## 🌐 Deploy to Railway or Render

### Railway Deployment (1-Click)
1. Push repository to GitHub.
2. Go to [Railway.app](https://railway.app) and select **New Project** -> **Deploy from GitHub repo**.
3. Add **PostgreSQL** and **Redis** database plugins from Railway.
4. Set `DATABASE_URL` (uses Railway Postgres string) and `ANTHROPIC_API_KEY` in Railway Environment Variables.

### Render Deployment (Render Blueprint)
1. Go to [Render.com](https://render.com) Dashboard.
2. Select **New** -> **Blueprint**.
3. Point to repository URL (uses `render.yaml`).
4. Enter `ANTHROPIC_API_KEY` when prompted.
