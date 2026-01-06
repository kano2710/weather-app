# Database Schema Documentation

## Overview
PostgreSQL database for storing weather data and user-selected locations.

## Tables

### 1. locations
Stores user-added locations for weather tracking.

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    country VARCHAR(50),
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_coords UNIQUE(latitude, longitude)
);
```

**Columns:**
- `id` - Auto-incrementing primary key
- `name` - City/location name (from OpenWeatherMap API)
- `latitude` - Location latitude (-90 to 90)
- `longitude` - Location longitude (-180 to 180)
- `country` - ISO country code (e.g., 'US', 'GB')
- `active` - Boolean flag (true = tracking, false = removed)
- `created_at` - Timestamp when location was added

**Constraints:**
- `unique_coords` - Prevents duplicate locations (same lat/lng)

---

### 2. weather_data
Stores hourly weather records for tracked locations.

```sql
CREATE TABLE weather_data (
    id SERIAL PRIMARY KEY,
    location_id INTEGER REFERENCES locations(id) ON DELETE CASCADE,
    temperature DECIMAL(5,2),
    feels_like DECIMAL(5,2),
    humidity INTEGER,
    pressure INTEGER,
    wind_speed DECIMAL(5,2),
    wind_direction INTEGER,
    clouds INTEGER,
    timestamp TIMESTAMP DEFAULT NOW()
);
```

**Columns:**
- `id` - Auto-incrementing primary key
- `location_id` - Foreign key to locations table
- `temperature` - Temperature in Celsius
- `feels_like` - "Feels like" temperature in Celsius
- `humidity` - Humidity percentage (0-100)
- `pressure` - Atmospheric pressure in hPa
- `wind_speed` - Wind speed in m/s
- `wind_direction` - Wind direction in degrees (0-360)
- `clouds` - Cloud coverage percentage (0-100)
- `timestamp` - When weather data was recorded

**Relationships:**
- `location_id` references `locations(id)` with CASCADE delete
  - When a location is deleted, all its weather data is automatically removed

---

## Indexes

```sql
CREATE INDEX idx_weather_timestamp ON weather_data(timestamp);
CREATE INDEX idx_weather_location ON weather_data(location_id);
CREATE INDEX idx_location_active ON locations(active);
```

**Purpose:**
- `idx_weather_timestamp` - Fast queries by date/time range
- `idx_weather_location` - Fast lookups of weather data for specific location
- `idx_location_active` - Quick filtering of active locations

---

## Sample Queries

### Add a new location
```sql
INSERT INTO locations (latitude, longitude, name, country, active)
VALUES ($1, $2, $3, $4, true)
ON CONFLICT (latitude, longitude) 
DO UPDATE SET active = true, name = EXCLUDED.name
RETURNING *;
```

### Get all active locations with latest weather
```sql
SELECT DISTINCT ON (l.id) 
    l.id, l.name, l.latitude, l.longitude, l.country,
    w.temperature, w.feels_like, w.humidity, w.pressure,
    w.wind_speed, w.wind_direction, w.clouds, w.timestamp
FROM locations l
LEFT JOIN weather_data w ON l.id = w.location_id
WHERE l.active = true
ORDER BY l.id, w.timestamp DESC;
```

### Get weather history for a location (last 7 days)
```sql
SELECT * FROM weather_data 
WHERE location_id = $1 
AND timestamp >= NOW() - INTERVAL '7 days'
ORDER BY timestamp DESC;
```

### Save weather data
```sql
INSERT INTO weather_data (
    location_id, temperature, feels_like, humidity, 
    pressure, wind_speed, wind_direction, clouds, timestamp
) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING *;
```

### Remove a location (soft delete)
```sql
UPDATE locations 
SET active = false 
WHERE id = $1 
RETURNING *;
```

---
## Database Setup

### Environment Variables Required

```env
DB_USER=your_db_username
DB_HOST=your_db_hostname
DB_DATABASE=your_db_name
DB_PASSWORD=your_db_password
DB_PORT=your_db_port
```

---

### Setup Database Script

Run this to initialize the database:

```bash
node setupDB.js
```

This will:
- Create the `locations` table
- Create the `weather_data` table
- Create all necessary indexes
- Verify the setup

----

### Reset Database Script

Run this to reinitialize the database:

```bash
node resetDB.js
```