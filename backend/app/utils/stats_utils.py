from statistics import mean, median, pstdev

from app.utils.time_utils import format_lap_time


def calculate_consistency_score(std_dev: float | None):
    if std_dev is None:
        return None

    score = max(0, 100 - (std_dev * 10))
    return round(score, 2)


def calculate_driver_lap_stats(driver_laps: list[dict]):
    valid_laps = [
        lap for lap in driver_laps
        if lap.get("lap_duration") is not None
    ]

    if not valid_laps:
        return {
            "valid_lap_count": 0,
            "fastest_lap": None,
            "average_lap": None,
            "average_lap_formatted": None,
            "median_lap": None,
            "median_lap_formatted": None,
            "standard_deviation": None,
            "consistency_score": None,
        }

    lap_durations = [
        lap.get("lap_duration")
        for lap in valid_laps
    ]

    fastest_lap_data = min(
        valid_laps,
        key=lambda lap: lap.get("lap_duration")
    )

    average_lap = mean(lap_durations)
    median_lap = median(lap_durations)
    std_dev = pstdev(lap_durations) if len(lap_durations) > 1 else 0

    return {
        "valid_lap_count": len(valid_laps),
        "fastest_lap": {
            "lap_number": fastest_lap_data.get("lap_number"),
            "lap_duration": fastest_lap_data.get("lap_duration"),
            "lap_time_formatted": format_lap_time(
                fastest_lap_data.get("lap_duration")
            ),
        },
        "average_lap": round(average_lap, 3),
        "average_lap_formatted": format_lap_time(average_lap),
        "median_lap": round(median_lap, 3),
        "median_lap_formatted": format_lap_time(median_lap),
        "standard_deviation": round(std_dev, 3),
        "consistency_score": calculate_consistency_score(std_dev),
    }