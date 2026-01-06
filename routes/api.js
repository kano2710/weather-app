const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');
const dbService = require('../services/dbService');

// Add new location
router.post('/locations', async (req, res) => {
    try {
        const { lat, lon } = req.body;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        const weatherData = await weatherService.getCurrentWeather(latitude, longitude);
        const location = await dbService.addLocation(
            latitude,
            longitude,
            weatherData.location.name,
            weatherData.location.country
        );

        await dbService.saveWeatherData(location.id, weatherData);

        res.json({
            success: true,
            message: 'Location added successfully',
            data: {
                location,
                currentWeather: weatherData
            }
        });
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ error: error.message });
    }
});

// Remove a location
router.delete('/locations/:id', async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);

        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Invalid location ID' });
        }

        const success = await dbService.removeLocation(locationId);

        if (success) {
            res.json({
                success: true,
                message: 'Location removed successfully'
            });
        } else {
            res.status(404).json({ error: 'Location not found' });
        }
    } catch (error) {
        console.error('Error removing location:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all active locations
router.get('/locations', async (req, res) => {
    try {
        const locations = await dbService.getLatestWeatherForAllLocations();

        res.json({
            success: true,
            count: locations.length,
            data: locations
        });
    } catch (error) {
        console.error('Error getting locations:', error);
        res.status(500).json({ error: error.message });
    }
});

// Preview weather at clicked coordinates (without saving)
router.get('/weather/preview', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({ error: 'Latitude and longitude are required' });
        }

        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        if (isNaN(latitude) || isNaN(longitude)) {
            return res.status(400).json({ error: 'Invalid coordinates' });
        }

        const weatherData = await weatherService.getCurrentWeather(latitude, longitude);

        res.json({
            success: true,
            data: weatherData
        });
    } catch (error) {
        console.error('Error in weather preview:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get historical data for a specific location
router.get('/locations/:id/history', async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);
        const days = parseInt(req.query.days) || 7;

        if (isNaN(locationId)) {
            return res.status(400).json({ error: 'Invalid location ID' });
        }

        const location = await dbService.getLocationById(locationId);
        if (!location) {
            return res.status(404).json({ error: 'Location not found' });
        }

        const history = await dbService.getLocationHistory(locationId, days);

        res.json({
            success: true,
            location,
            data: history
        });
    } catch (error) {
        console.error('Error getting location history:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
