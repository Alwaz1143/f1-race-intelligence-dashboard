# Architecture

## Overview

The F1 Race Intelligence Dashboard follows a full-stack architecture.

The React frontend communicates only with the FastAPI backend. The backend is responsible for calling the OpenF1 API, cleaning responses, calculating analytics, caching repeated data, and returning frontend-ready JSON.

## Data Flow

User selects filters in React.

React calls FastAPI.

FastAPI checks cache.

If data is not cached, FastAPI calls OpenF1.

FastAPI normalizes and processes the data.

React displays the data using tables and charts.

```text
User
↓
React Frontend
↓
FastAPI Backend
↓
Cache Layer
↓
OpenF1 API
```

## Why This Architecture?

The backend is not just a proxy. It acts as a data processing layer.

This keeps business logic away from the frontend and makes the system easier to maintain, test, cache, and explain in interviews.


## Backend Responsibilities

The backend handles:

- API routes
    
- OpenF1 API integration
    
- Response cleaning
    
- Data normalization
    
- Analytics calculations
    
- Error handling
    
- Validation
    
- Caching
    

## Frontend Responsibilities

The frontend handles:

- User selections
    
- Dashboard layout
    
- API state using TanStack Query
    
- Loading states
    
- Error states
    
- Empty states
    
- Tables
    
- Cards
    
- Charts
    

## Service Layer

The backend uses a service-layer structure.

Route files handle request and response logic.

Service files handle business logic and external data processing.

Example:

```text
api/routes/laps.py
↓
services/lap_service.py
↓
services/openf1_client.py
```

This keeps route files thin and maintainable.

## Caching

The backend currently uses an in-memory cache with TTL.

This reduces repeated OpenF1 API calls during development.

Future improvement:

```text
Replace or extend in-memory cache with Redis.
```

## Analytics

The backend calculates:

- Session overview
    
- Fastest lap leaderboard
    
- Driver comparison
    
- Average lap time
    
- Median lap time
    
- Standard deviation
    
- Consistency score
    
- Race control event counts
    

Keeping analytics in the backend makes the frontend simpler and keeps business logic centralized.
