const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

class WeatherService {
    async getCurrentWeather(lat, lon) {
        try {
            const response = await axios.get(`${BASE_URL}/weather`, {
                params: {
                    lat: lat,
                    lon: lon,
                    appid: API_KEY,
                    units: 'metric'
                }
            });

            const data = response.data;

            return {
                location: {
                    name: data.name || 'Unknown Location',
                    country: data.sys?.country || '',
                    latitude: data.coord.lat,
                    longitude: data.coord.lon
                },
                weather: {
                    temperature: data.main.temp,
                    feels_like: data.main.feels_like,
                    humidity: data.main.humidity,
                    pressure: data.main.pressure,
                    wind_speed: data.wind.speed,
                    wind_direction: data.wind.deg,
                    clouds: data.clouds.all
                },
                timestamp: new Date(data.dt * 1000)
            };
        } catch (error) {
            console.error('Error fetching weather:', error.message);
            if (error.response) {
                throw new Error(`OpenWeatherMap API Error: ${error.response.data.message}`);
            }
            throw new Error('Failed to fetch weather data');
        }
    }
}

module.exports = new WeatherService();
