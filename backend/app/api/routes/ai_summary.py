from fastapi import APIRouter, Query

from app.services.ai_summary_service import generate_ai_session_summary

router = APIRouter()


@router.get("/analytics/ai-summary")
async def get_ai_summary(
    session_key: int = Query(..., description="OpenF1 session key"),
):
    return await generate_ai_session_summary(session_key)