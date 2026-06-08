# API Reference

## Health

```http
GET /api/health
```
Returns backend health status.

## Races

```http
GET /api/races?year=2024
```

Returns all race meetings for a selected year.

## Sessions

```http
GET /api/sessions?meeting_key=1234
```

Returns sessions for a selected Grand Prix weekend.

## Drivers

```http
GET /api/drivers?session_key=1234
```

Returns drivers for a selected session.

## Laps

```http
GET /api/laps?session_key=1234
GET /api/laps?session_key=1234&driver_number=1
```

Returns lap data for all drivers or a selected driver.

## Race Control

```http
GET /api/race-control?session_key=1234
```

Returns race control messages and event counts.

## Session Overview

```http
GET /api/analytics/session-overview?session_key=1234
```

Returns dashboard overview metrics.

## Fastest Laps

```http
GET /api/analytics/fastest-laps?session_key=1234
```

Returns fastest lap leaderboard.

## Compare Drivers

```http
GET /api/analytics/compare-drivers?session_key=1234&driver1=1&driver2=4
```

Returns comparison analytics for two drivers.

## Cache Stats

```http
GET /api/cache/stats
```

Returns cache statistics.

## Clear Cache

```http
DELETE /api/cache/clear
```

Clears in-memory cache.