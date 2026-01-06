const { pool } = require('./config/dbConnect');

async function resetDatabase() {
    try {
        console.log('Starting database reset...');

        await pool.query('DROP TABLE IF EXISTS weather_data CASCADE');
        console.log('Dropped weather_data table');

        await pool.query('DROP TABLE IF EXISTS locations CASCADE');
        console.log('Dropped locations table');

        await pool.query(`
            CREATE TABLE locations (
                id SERIAL PRIMARY KEY,
                latitude DECIMAL(10, 7) NOT NULL,
                longitude DECIMAL(10, 7) NOT NULL,
                name VARCHAR(255) NOT NULL,
                country VARCHAR(100),
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(latitude, longitude)
            )
        `);
        console.log('Created locations table');

        await pool.query(`
            CREATE TABLE weather_data (
                id SERIAL PRIMARY KEY,
                location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
                temperature DECIMAL(5, 2),
                feels_like DECIMAL(5, 2),
                humidity INTEGER,
                pressure INTEGER,
                wind_speed DECIMAL(5, 2),
                wind_direction INTEGER,
                clouds INTEGER,
                timestamp TIMESTAMP NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Created weather_data table');

        await pool.query(`
            CREATE INDEX idx_weather_data_location_timestamp 
            ON weather_data(location_id, timestamp DESC)
        `);
        console.log('Created index on weather_data');

        console.log('Database reset completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error resetting database:', error.message);
        process.exit(1);
    }
}

resetDatabase();
