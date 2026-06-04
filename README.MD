# F1 Race Intelligence Dashboard

A full-stack Formula 1 race analytics dashboard built with FastAPI, React, OpenF1 API, Redis caching, TanStack Query, and Recharts.

## Project Goal

The goal of this project is to build a resume-worthy data intelligence dashboard for Formula 1 race sessions.

The app will allow users to select a season, Grand Prix, and session, then view driver data, lap-time analysis, fastest lap leaderboards, race control messages, driver comparisons, and AI-assisted session summaries.

## Tech Stack

### Backend
- Python
- FastAPI
- Uvicorn
- HTTPX
- python-dotenv

### Environment Variables

Create a `.env` file inside the `backend` folder:

```env
- OPENF1_BASE_URL=https://api.openf1.org/v1
- FRONTEND_URL=http://localhost:5173
```

### Run the backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

From the repo root:

```bash
uvicorn app.main:app --reload --app-dir backend
```

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- TanStack Query
- Recharts

### External API
- OpenF1 API

### Planned
- Redis caching
- AI-generated session summaries
- Deployment

## Current Progress

### Completed
- FastAPI backend setup
- Health check endpoint
- OpenF1 API client
- Race meetings endpoint
- Sessions endpoint
- Drivers endpoint
- Laps endpoint
- Race control messages endpoint
- Session overview analytics endpoint
- Fastest laps leaderboard endpoint
- Driver comparison analytics endpoint
- Refactored reusable time and statistics utilities
- Added in-memory caching for OpenF1 API responses
- Added cache stats and cache clear development endpoints
- Improved backend validation and error handling
- Refactored lap processing into a dedicated service layer
- Refactored driver and race control processing into service layer
- Refactored analytics logic into dedicated service layer
- Added CORS support for React frontend integration
- Improved API metadata and Swagger route grouping
- Added root API information endpoint
- Initialized React frontend with Vite
- Added Tailwind CSS setup
- Added React Router
- Added TanStack Query provider
- Added Axios API client
- Created Home and Dashboard starter pages

## Current Backend Endpoints

- GET /api/health
- GET /api/races?year=2024
- GET /api/sessions?meeting_key=1234
- GET /api/drivers?session_key=1234
- GET /api/laps?session_key=1234&driver_number=1
- GET /api/race-control?session_key=1234
- GET /api/analytics/session-overview?session_key=1234
- GET /api/analytics/fastest-laps?session_key=1234
- GET /api/analytics/compare-drivers?session_key=1234&driver1=1&driver2=4
- GET /api/cache/stats
- DELETE /api/cache/clear

## Error Handling

The backend returns clear HTTP errors for invalid inputs, missing sessions, missing drivers, and invalid driver comparison requests.

## Project Status
>[!Note]
>This project is under active development.
