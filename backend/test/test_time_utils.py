from app.utils.time_utils import format_lap_time


def test_format_lap_time_valid_seconds():
    assert format_lap_time(83.456) == "01:23:46"


def test_format_lap_time_none():
    assert format_lap_time(None) == "N/A"


def test_format_lap_time_negative():
    assert format_lap_time(-10) == "N/A"


def test_format_lap_time_rounding_overflow():
    assert format_lap_time(59.999) == "01:00:00"