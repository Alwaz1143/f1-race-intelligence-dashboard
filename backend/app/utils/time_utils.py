def format_lap_time(seconds: float | None):
    if seconds is None:
        return None

    minutes = int(seconds // 60)
    remaining_seconds = seconds - (minutes * 60)

    return f"{minutes}:{remaining_seconds:06.3f}"