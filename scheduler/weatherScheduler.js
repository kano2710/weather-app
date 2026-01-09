const cron = require('node-cron');
const weatherService = require('../services/weatherService');
const dbService = require('../services/dbService');

class WeatherScheduler {
    constructor() {
        this.job = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            console.log('Scheduler already running');
            return;
        }

        this.job = cron.schedule('0 * * * *', async () => {
            await this.collectWeatherData();
        });

        this.isRunning = true;

        this.collectWeatherData();
    }

    async collectWeatherData() {
        try {
            const locations = await dbService.getActiveLocations();

            if (locations.length === 0) {
                console.log('No active locations to fetch weather for');
                return;
            }

            console.log(`Fetching weather for ${locations.length} location(s)...`);

            for (const location of locations) {
                try {
                    const weatherData = await weatherService.getCurrentWeather(
                        parseFloat(location.latitude),
                        parseFloat(location.longitude)
                    );

                    await dbService.saveWeatherData(location.id, weatherData);

                    console.log(`${location.name}: ${weatherData.weather.temperature}°C`);
                } catch (error) {
                    console.error(`Failed for ${location.name}:`, error.message);
                }
            }

            console.log('Weather collection completed');
        } catch (error) {
            console.error('Error in weather collection:', error.message);
        }
    }

    stop() {
        if (this.job) {
            this.job.stop();
            this.isRunning = false;
            console.log('Weather scheduler stopped');
        }
    }
}

module.exports = new WeatherScheduler();
