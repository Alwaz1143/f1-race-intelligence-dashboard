from fastapi import HTTPException


def raise_not_found_if_empty(data, message: str):
    if not data:
        raise HTTPException(
            status_code=404,
            detail=message
        )


def raise_bad_request(message: str):
    raise HTTPException(
        status_code=400,
        detail=message
    )


def validate_different_drivers(driver1: int, driver2: int):
    if driver1 == driver2:
        raise HTTPException(
            status_code=400,
            detail="driver1 and driver2 must be different drivers."
        )