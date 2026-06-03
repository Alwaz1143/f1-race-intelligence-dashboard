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

### Current Backend Endpoints

```http
GET /api/health
GET /api/races?year=2024

## Project Status

==This project is under active development.==
