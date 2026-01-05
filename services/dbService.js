const { pool } = require('../config/dbConnect');

class DatabaseService {
    // add new location
    async addLocation(lat, lon, name, country) {
        try {
            const result = await pool.query(
                `
                INSERT INTO locations (latitude, longitude, name, country, active)
                VALUES ($1, $2, $3, $4, true)
                ON CONFLICT (latitude, longitude) 
                DO UPDATE SET active = true, name = EXCLUDED.name
                RETURNING *
                `,
                [lat, lon, name, country]
            );

            console.log(`Location added: ${name} (${lat}, ${lon})`);
            return result.rows[0];
        } catch (error) {
            console.error('Error adding location:', error.message);
            throw error;
        }
    }

    // Remove a location (set inactive)
    async removeLocation(locationId) {
        try {
            const result = await pool.query(
                `
                UPDATE locations 
                SET active = false WHERE id = $1 
                RETURNING *
                `,
                [locationId]
            );

            if (result.rows.length > 0) {
                console.log(`Location removed: ${result.rows[0].name}`);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error removing location:', error.message);
            throw error;
        }
    }

    // Get all active locations
    async getActiveLocations() {
        try {
            const result = await pool.query(
                `
                SELECT * 
                FROM locations 
                WHERE active = true 
                ORDER BY created_at DESC
                `
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting active locations:', error.message);
            throw error;
        }
    }

    // Get location by ID
    async getLocationById(locationId) {
        try {
            const result = await pool.query(
                `
                SELECT * 
                FROM locations 
                WHERE id = $1
                `,
                [locationId]
            );
            return result.rows[0];
        } catch (error) {
            console.error('Error getting location:', error.message);
            throw error;
        }
    }

    // Save weather data for a location
    async saveWeatherData(locationId, weatherData) {
        try {
            const result = await pool.query(
                `INSERT INTO weather_data (
                location_id, temperature, feels_like, humidity, 
                pressure, wind_speed, wind_direction, clouds, timestamp
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING *
                `,
                [
                    locationId,
                    weatherData.weather.temperature,
                    weatherData.weather.feels_like,
                    weatherData.weather.humidity,
                    weatherData.weather.pressure,
                    weatherData.weather.wind_speed,
                    weatherData.weather.wind_direction,
                    weatherData.weather.clouds,
                    weatherData.timestamp
                ]
            );

            return result.rows[0];
        } catch (error) {
            console.error('Error saving weather data:', error.message);
            throw error;
        }
    }

    // Get historical weather data for a location
    async getLocationHistory(locationId, days = 7) {
        try {
            const result = await pool.query(
                `
                SELECT * 
                FROM weather_data 
                WHERE location_id = $1 
                AND timestamp >= NOW() - INTERVAL '${days} days'
                ORDER BY timestamp DESC
                `,
                [locationId]
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting location history:', error.message);
            throw error;
        }
    }

    // Get latest weather data for all active locations
    async getLatestWeatherForAllLocations() {
        try {
            const result = await pool.query(
                `
                SELECT DISTINCT ON (l.id) 
                l.id, l.name, l.latitude, l.longitude, l.country,
                w.temperature, w.feels_like, w.humidity, w.pressure,
                w.wind_speed, w.wind_direction, w.clouds, w.timestamp
                FROM locations l
                LEFT JOIN weather_data w ON l.id = w.location_id
                WHERE l.active = true
                ORDER BY l.id, w.timestamp DESC
                `
            );
            return result.rows;
        } catch (error) {
            console.error('Error getting latest weather:', error.message);
            throw error;
        }
    }
}

module.exports = new DatabaseService();
