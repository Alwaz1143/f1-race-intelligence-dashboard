from fastapi import APIRouter, Query

from app.services.race_result_service import get_race_classification

router = APIRouter(prefix="/results", tags=["Race Results"])


@router.get("/race-classification")
async def race_classification(
    year: int = Query(..., ge=1950),
    round_number: int = Query(..., alias="round", ge=1),
):
    return await get_race_classification(year, round_number)