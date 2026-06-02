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

## Why This Architecture?

The backend is not just a proxy. It acts as a data processing layer.

This keeps business logic away from the frontend and makes the system easier to maintain, test, cache, and explain in interviews.