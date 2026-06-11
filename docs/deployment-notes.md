# for backend deployment:
uvicorn app.main:app --host 0.0.0.0 --port $PORT
## .env:
OPENF1_BASE_URL=https://api.openf1.org/v1
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app

# frontend

## .env
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api


# Deployment Notes

## Deployment Plan

The project will be deployed as two separate services:

- Frontend: Vercel
- Backend: Render

## Backend Deployment

Platform: Render

Root directory:

```text
backend
```


Build command:

pip install -r requirements.txt

Start command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT

Environment variables:

OPENF1_BASE_URL=https://api.openf1.org/v1
FRONTEND_URL=https://your-vercel-frontend-url.vercel.app
Frontend Deployment

Platform: Vercel

Root directory:

frontend

Build command:

npm run build

Output directory:

dist

Environment variables:

VITE_API_BASE_URL=https://your-render-backend-url.onrender.com/api
Deployment Order
Deploy backend first.
Copy backend production URL.
Add backend URL to Vercel as VITE_API_BASE_URL.
Deploy frontend.
Copy frontend production URL.
Add frontend URL to Render as FRONTEND_URL.
Redeploy backend.
Test frontend and backend together.
Important Notes
Do not commit .env files.
Do not commit frontend/dist.
Backend CORS must allow the deployed frontend URL.
Frontend API base URL must point to deployed backend /api.



# Production URLs:

## Backend: 
```text
https://f1-race-intelligence-api.onrender.com
```

## Frontend:
Pending