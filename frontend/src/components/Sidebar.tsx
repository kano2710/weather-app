import { useState, useEffect } from 'react'
import WeatherChart from './WeatherChart'
import api from '../services/api'

interface Location {
    id: number;
    name: string;
    latitude: string;
    longitude: string;
    country: string;
    temperature?: number;
    feels_like?: number;
    humidity?: number;
    wind_speed?: number;
    wind_direction: number;
    clouds?: number;
    pressure?: number;
}

interface SidebarProps {
    isOpen: boolean;
    selectedLocation: Location | null;
    previewWeather?: any;
    previewPosition?: { lat: number; lng: number } | null;
    loadingPreview?: boolean;
    onClose: () => void;
    onAddLocation: () => void;
    onRemoveLocation: (locationId: number) => void;
}

function Sidebar({
    isOpen,
    selectedLocation,
    previewWeather,
    previewPosition,
    loadingPreview,
    onClose,
    onAddLocation,
    onRemoveLocation
}: SidebarProps) {
    const [historicalData, setHistoricalData] = useState<any[]>([])
    const [loadingHistory, setLoadingHistory] = useState(false)

    useEffect(() => {
        if (selectedLocation && isOpen) {
            fetchHistoricalData(selectedLocation.id)
        }
    }, [selectedLocation, isOpen])

    const fetchHistoricalData = async (locationId: number) => {
        setLoadingHistory(true)
        try {
            const response = await api.getLocationHistory(locationId, 7)
            setHistoricalData(response.data || [])
        } catch (error) {
            console.error('Failed to fetch historical data:', error)
            setHistoricalData([])
        } finally {
            setLoadingHistory(false)
        }
    }

    return (
        <div
            style={{
                position: 'absolute',
                top: 0,
                left: isOpen ? 0 : '-400px',
                width: '400px',
                height: '100%',
                backgroundColor: 'white',
                boxShadow: '2px 0 10px rgba(0,0,0,0.3)',
                zIndex: 1000,
                transition: 'left 0.3s ease-in-out',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '80px' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '5px 10px',
                        zIndex: 10
                    }}
                >
                    ×
                </button>

                {!selectedLocation && previewPosition && (
                    <>
                        {loadingPreview ? (
                            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                                <p style={{ fontSize: '18px', color: '#666' }}>Loading weather data...</p>
                            </div>
                        ) : previewWeather ? (
                            <>
                                <h2 style={{ margin: '0 0 30px 0', fontSize: '24px', color: '#333' }}>
                                    {previewWeather.location.name}, <span style={{ color: '#666', fontSize: '18px' }}>{previewWeather.location.country}</span>
                                </h2>

                                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img src="/temp.svg" alt="temperature" style={{ width: '100px', height: '100px' }} />
                                    <div>
                                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', lineHeight: '1' }}>
                                            {previewWeather.weather.temperature}°C
                                        </div>
                                        <p style={{ color: '#666', fontSize: '16px', margin: '10px 0 0 0' }}>
                                            Feels like {previewWeather.weather.feels_like}°C
                                        </p>
                                    </div>
                                </div>

                                <WeatherChart 
                                    data={[{
                                        timestamp: new Date().toISOString(),
                                        temperature: previewWeather.weather.temperature,
                                        humidity: previewWeather.weather.humidity,
                                        wind_speed: previewWeather.weather.wind_speed,
                                        wind_direction: previewWeather.weather.wind_direction,
                                        pressure: previewWeather.weather.pressure,
                                        clouds: previewWeather.weather.clouds
                                    }]} 
                                    locationName={previewWeather.location.name} 
                                />
                            </>
                        ) : (
                            <p style={{ color: '#f44336', textAlign: 'center', padding: '40px 0' }}>Failed to load weather data</p>
                        )}
                    </>
                )}

                {selectedLocation && (
                    <>
                        <h2 style={{ margin: '0 0 30px 0', fontSize: '24px', color: '#333' }}>
                            {selectedLocation.name}, <span style={{ color: '#666', fontSize: '18px' }}>{selectedLocation.country}</span>
                        </h2>

                        {selectedLocation.temperature && (
                            <>
                                <div style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <img src="/temp.svg" alt="temperature" style={{ width: '100px', height: '100px' }} />
                                    <div>
                                        <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333', lineHeight: '1' }}>
                                            {selectedLocation.temperature}°C
                                        </div>
                                        <p style={{ color: '#666', fontSize: '16px', margin: '10px 0 0 0' }}>
                                            Feels like {selectedLocation.feels_like}°C
                                        </p>
                                    </div>
                                </div>

                                {/* Weather Charts */}
                                {loadingHistory ? (
                                    <div style={{ textAlign: 'center', padding: '40px 0', marginTop: '30px', borderTop: '2px solid #eee' }}>
                                        <p style={{ fontSize: '16px', color: '#666' }}>Loading historical data...</p>
                                    </div>
                                ) : (
                                    <WeatherChart data={historicalData} locationName={selectedLocation.name} />
                                )}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Fixed bottom buttons */}
            {!selectedLocation && previewPosition && previewWeather && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '15px 20px',
                    backgroundColor: 'white',
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    gap: '10px',
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
                }}>
                    <button
                        onClick={onAddLocation}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Add Location
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                </div>
            )}

            {selectedLocation && (
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '15px 20px',
                    backgroundColor: 'white',
                    borderTop: '1px solid #eee',
                    display: 'flex',
                    gap: '10px',
                    boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
                }}>
                    <button
                        onClick={() => onRemoveLocation(selectedLocation.id)}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Delete Location
                    </button>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '12px',
                            backgroundColor: '#757575',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: '500'
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    )
}

export default Sidebar
