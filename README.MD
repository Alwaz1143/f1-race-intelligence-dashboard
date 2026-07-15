# F1 Race Intelligence Dashboard

![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-green)
![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-black)
![Status](https://img.shields.io/badge/Status-Production-success)
![CI](https://github.com/Alwaz1143/f1-race-intelligence-dashboard/actions/workflows/ci.yml/badge.svg)

A full-stack Formula 1 race analytics dashboard with AI-powered session summaries. Built with FastAPI, React, OpenF1 API, Jolpica API, TanStack Query, Recharts, and multi-layer caching.

## Live Demo

- **Frontend:** https://f1live.alwaz.tech
- **Backend API:** https://f1-race-intelligence-api.onrender.com
- **API Docs:** https://f1-race-intelligence-api.onrender.com/docs

## Feature Highlights

### Core Analytics
- Season / Grand Prix / Session selection with URL-driven state
- Session overview cards (drivers, laps, race control events)
- Fastest lap leaderboard with sector times and speeds
- Driver comparison with lap-time charts and statistics
- Race control messages with category/flag breakdown charts
- Race classification results

### AI-Powered Session Summary
- Generates a natural-language F1 race report (session brief, key metrics, pace highlights, race control notes, key takeaway)
- **Primary:** Groq LPU (`llama-3.3-70b-versatile`) — sub-second inference, free tier
- **Fallback:** Google Gemini 3.5 Flash → Gemini 3.1 Flash Lite
- Stale-while-revalidate: cached summaries served instantly, refreshed in background
- Compact prompt payload (short keys, stripped nulls) to minimize tokens

### Performance Optimizations
- **3-layer cache:** Disk (persistent JSON, 30-day TTL) → Redis → InMemory — survives restarts
- **Request coalescing:** concurrent identical OpenF1 requests share a single HTTP call
- **Shared httpx client:** single connection pool reused across all calls (no SSL overhead)
- **Async I/O:** all file cache reads/writes via `asyncio.to_thread`, Gemini via `aio` SDK
- **Bulk analytics endpoint:** one API call replaces 4 separate frontend queries
- **Parallel data fetching:** `asyncio.gather` across all service calls
- **Optimized lap cleaning:** only essential fields kept, reducing serialization overhead

### Frontend
- TanStack Query for server-state caching and stale management
- Recharts visualizations (line charts, bar charts, donut charts)
- Loading skeletons, empty states, error boundaries with retry
- SPA routing with shareable URL state

## Tech Stack

### Frontend
- React + Vite
- Tailwind CSS
- Axios
- TanStack Query
- React Router
- Recharts

### Backend
- Python + FastAPI
- Uvicorn
- HTTPX (shared async client)
- openai (Groq API via OpenAI-compatible SDK)
- google-genai (Gemini fallback)
- python-dotenv

### Caching
- **DiskCache:** persistent JSON files with `asyncio.to_thread` (async I/O)
- **Redis:** optional cloud cache layer
- **InMemory:** local dictionary with TTL

### Data Sources
- **OpenF1 API** — live session data (laps, drivers, race control, etc.)
- **Jolpica API** — race classification results
- **Groq LPU** — primary AI summary generation (free tier, 30 RPM / 1K RPD)
- **Google Gemini** — fallback AI summary generation

## Backend API Endpoints

### Basic
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/races?year=2024` | Season calendar |
| GET | `/api/sessions?meeting_key=1234` | Session list for a GP |
| GET | `/api/drivers?session_key=1234` | Driver list |
| GET | `/api/laps?session_key=1234&driver_number=1` | Lap data |
| GET | `/api/race-control?session_key=1234` | Race control messages |
| GET | `/api/classification?session_key=1234` | Race classification |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/bulk?session_key=1234` | All session data in one call |
| GET | `/api/analytics/session-overview?session_key=1234` | Overview metrics |
| GET | `/api/analytics/fastest-laps?session_key=1234` | Fastest lap leaderboard |
| GET | `/api/analytics/compare-drivers?session_key=1234&driver1=1&driver2=4` | Driver comparison |
| GET | `/api/analytics/ai-summary?session_key=1234` | AI-generated session summary |

### Cache Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cache/stats` | Cache hit/miss stats |
| DELETE | `/api/cache/clear` | Clear all caches |

## Architecture

```
React Frontend (Vercel)
    ↓  single /api/analytics/bulk call
FastAPI Backend (Render)
    ↓  asyncio.gather + request coalescing
Service Layer
    ↓  DiskCache → RedisCache → InMemoryCache
OpenF1 API / Jolpica API
```

The backend handles:
- Fetching and cleaning OpenF1 / Jolpica data
- Request coalescing (duplicate calls share one HTTP request)
- Multi-layer caching (Disk → Redis → InMemory)
- Analytics computation and data normalization
- AI summary generation (Groq → Gemini fallback chain)
- Stale-while-revalidate cache strategy

The frontend handles:
- User interaction and URL-driven state
- Single bulk query for dashboard data
- Skeleton loading, empty states, error boundaries
- Chart rendering (Recharts) and responsive layout

## Local Setup

### Prerequisites
- Python 3.12+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv

# Windows PowerShell
.\venv\Scripts\Activate.ps1

pip install -r requirements.txt
```

Create `backend/.env`:

```env
OPENF1_BASE_URL=https://api.openf1.org/v1
FRONTEND_URL=http://localhost:5173

# Optional — AI summaries
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile

GEMINI_API_KEY=your_gemini_key
GEMINI_MODEL=gemini-3.5-flash
GEMINI_FALLBACK_MODEL=gemini-3.1-flash-lite

# Optional — Redis caching
REDIS_URL=
```

Run:

```bash
uvicorn app.main:app --reload
```

Backend: http://127.0.0.1:8000
API docs: http://127.0.0.1:8000/docs

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Run:

```bash
npm run dev
```

Frontend: http://localhost:5173

## Deployment

### Backend (Render)
1. Connect GitHub repo to Render
2. **Root Directory:** `backend`
3. **Build Command:** `pip install -r requirements.txt`
4. **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add env vars: `GROQ_API_KEY`, `GEMINI_API_KEY`, `FRONTEND_URLS`, `REDIS_URL` (optional)
6. Use **UptimeRobot** to ping `/api/health` every 5 min to prevent cold starts

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. **Root Directory:** `frontend`
3. **Build Command:** `npm run build`
4. **Output Directory:** `dist`
5. Add env var: `VITE_API_BASE_URL=https://your-render-app.onrender.com/api`

## Project Structure

```
f1-race-intelligence-dashboard/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # FastAPI route handlers
│   │   ├── core/             # Config, cache layer
│   │   ├── services/         # Business logic, API clients
│   │   ├── utils/            # Helpers (time formatting, etc.)
│   │   └── main.py           # App entry point
│   ├── cache_data/           # Disk cache (gitignored)
│   ├── .env.example
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client + API functions
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # TanStack Query hooks
│   │   ├── pages/            # Route page components
│   │   ├── routes/           # React Router config
│   │   ├── utils/            # Frontend helpers
│   │   └── main.jsx          # Entry point
│   ├── .env.example
│   └── package.json
├── docs/
│   ├── architecture.md
│   ├── deployment-notes.md
│   └── screenshots/
├── .github/
│   └── workflows/ci.yml      # Automated tests
├── .gitignore
└── README.md
```

## Current Status

### Completed
- FastAPI backend deployed on Render
- React frontend deployed on Vercel
- Production CORS configured
- OpenF1 + Jolpica API integration
- Session overview, fastest laps, driver comparison, race control
- Race classification results
- AI session summaries (Groq primary + Gemini fallback)
- 3-layer cache: Disk → Redis → InMemory
- Request coalescing (duplicate call deduplication)
- Shared httpx connection pool
- Async I/O throughout (Gemini, file cache, etc.)
- Bulk analytics endpoint (single API call for all dashboard data)
- Stale-while-revalidate for AI summaries
- URL-driven dashboard state and tab navigation
- Loading skeletons, empty states, error boundaries
- Recharts visualizations (line, bar, donut charts)
- GitHub Actions CI (pytest + frontend build)
- UptimeRobot keep-alive for Render backend

### Planned
- Add more advanced race analytics (tyre strategy, gap charts)
- Improve accessibility
- Screenshots and demo GIF in README

## Disclaimer

This project uses OpenF1 API and Jolpica API data for educational and portfolio purposes. All F1 data belongs to Formula 1.
