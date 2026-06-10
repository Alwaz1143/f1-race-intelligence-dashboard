def format_lap_time(seconds: float | int | None) -> str:
    """
    Convert seconds into MM:SS:CC format.

    Example:
    83.456 -> 01:23:46
    """

    if seconds is None:
        return "N/A"

    try:
        total_seconds_float = float(seconds)
    except (TypeError, ValueError):
        return "N/A"

    if total_seconds_float < 0:
        return "N/A"

    minutes = int(total_seconds_float // 60)
    remaining_seconds = int(total_seconds_float % 60)

    centiseconds = int(round((total_seconds_float - int(total_seconds_float)) * 100))

    if centiseconds == 100:
        centiseconds = 0
        remaining_seconds += 1

    if remaining_seconds == 60:
        remaining_seconds = 0
        minutes += 1

    return f"{minutes:02d}:{remaining_seconds:02d}:{centiseconds:02d}"