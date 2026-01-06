const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

class WeatherAPI {
    async previewWeather(lat: number, lon: number) {
        const response = await fetch(`${API_BASE_URL}/weather/preview?lat=${lat}&lon=${lon}`);
        if (!response.ok) throw new Error('Failed to fetch weather preview');
        return response.json();
    }

    async getActiveLocations() {
        const response = await fetch(`${API_BASE_URL}/locations`);
        if (!response.ok) throw new Error('Failed to fetch locations');
        return response.json();
    }

    async addLocation(lat: number, lon: number) {
        const response = await fetch(`${API_BASE_URL}/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lat, lon })
        });
        if (!response.ok) throw new Error('Failed to add location');
        return response.json();
    }

    async removeLocation(locationId: number) {
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to remove location');
        return response.json();
    }

    async getLocationHistory(locationId: number, days: number = 7) {
        const response = await fetch(`${API_BASE_URL}/locations/${locationId}/history?days=${days}`);
        if (!response.ok) throw new Error('Failed to fetch history');
        return response.json();
    }
}

export default new WeatherAPI();
