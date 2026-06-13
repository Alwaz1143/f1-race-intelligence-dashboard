from fastapi import APIRouter, Response

router = APIRouter()
@router.get("/health")

def health_check():
    return {"status" : "healthy 😊"}

@router.head("/health")
async def health_check_head():
    return Response(status_code=200)