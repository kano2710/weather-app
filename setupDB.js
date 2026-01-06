const { pool } = require('./config/database');

const createTables = async () => {
    try {
        console.log('📋 Creating database tables...\n');

        // Create locations table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS locations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                latitude DECIMAL(10,8) NOT NULL,
                longitude DECIMAL(11,8) NOT NULL,
                country VARCHAR(50),
                active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT NOW(),
                CONSTRAINT unique_coords UNIQUE(latitude, longitude)
            );
        `);
        console.log('Table "locations" created');

        // Create weather_data table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS weather_data (
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
        `);
        console.log('Table "weather_data" created');

        // Create indexes
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_weather_timestamp ON weather_data(timestamp);
        `);
        console.log('Index "idx_weather_timestamp" created');

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_data(location_id);
        `);
        console.log('Index "idx_weather_location" created');

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_location_active ON locations(active);
        `);
        console.log('Index "idx_location_active" created');

        // Verify tables exist
        console.log('\nVerifying tables...');
        const result = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

        console.log('Tables in database:', result.rows.map(r => r.table_name).join(', '));

        console.log('\nDatabase schema setup complete!');
        process.exit(0);
    } catch (error) {
        console.error('Error creating tables:', error.message);
        process.exit(1);
    }
};

createTables();
