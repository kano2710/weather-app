import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet"
import 'leaflet/dist/leaflet.css'

interface MapClickHandlerProps {
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}

function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng)
    }
  })
  return null
}

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

interface WorldMapProps {
  locations: Location[];
  onLocationClick?: (lat: number, lng: number) => void;
  previewWeather?: any;
  previewPosition?: { lat: number; lng: number } | null;
  loadingPreview?: boolean;
  onAddLocation?: () => void;
  onCancelPreview?: () => void;
  onRemoveLocation?: (locationId: number) => void;
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}

function worldMap({
  locations,
  onLocationClick,
  previewWeather,
  previewPosition,
  loadingPreview,
  onAddLocation,
  onCancelPreview,
  onRemoveLocation
}: WorldMapProps) {
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    if (onLocationClick) {
      onLocationClick(latlng.lat, latlng.lng)
    }
  }

  return (
    <MapContainer
      center={[0, 0]}
      zoom={3}
      minZoom={2}
      maxBounds={[[-85, -Infinity], [85, Infinity]]}
      maxBoundsViscosity={1.0}
      worldCopyJump={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler onMapClick={handleMapClick} />

      {previewPosition && (
        <Marker position={[previewPosition.lat, previewPosition.lng]}>
          <Popup>
            <div style={{ minWidth: '200px' }}>
              {loadingPreview ? (
                <p>Loading weather data...</p>
              ) : previewWeather ? (
                <>
                  <h3 style={{ margin: '0 0 10px 0' }}>{previewWeather.location.name}, {previewWeather.location.country}</h3>
                  <p style={{ margin: '5px 0' }}>Temperature: {previewWeather.weather.temperature}°C (feels like {previewWeather.weather.feels_like}°C)</p>
                  <p style={{ margin: '5px 0' }}>Humidity: {previewWeather.weather.humidity}%</p>
                  <p style={{ margin: '5px 0' }}>Wind Speed: {previewWeather.weather.wind_speed} m/s</p>
                  <p style={{ margin: '5px 0' }}>Wind Direction: {getWindDirection(previewWeather.weather.wind_direction)} ({previewWeather.weather.wind_direction}°)</p>
                  <p style={{ margin: '5px 0' }}>Clouds: {previewWeather.weather.clouds}%</p>
                  <p style={{ margin: '5px 0' }}>Pressure: {previewWeather.weather.pressure} hPa</p>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '5px' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onAddLocation?.()
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Add Location
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onCancelPreview?.()
                      }}
                      style={{
                        flex: 1,
                        padding: '8px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p>Failed to load weather data</p>
              )}
            </div>
          </Popup>
        </Marker>
      )}

      {locations.map(loc => (
        <Marker
          key={loc.id}
          position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
        >
          <Popup>
            <div style={{ minWidth: '200px' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{loc.name}, {loc.country}</h3>
              {loc.temperature && (
                <>
                  <p style={{ margin: '5px 0' }}>Temperature: {loc.temperature}°C (feels like {loc.feels_like}°C)</p>
                  <p style={{ margin: '5px 0' }}>Humidity: {loc.humidity}%</p>
                  <p style={{ margin: '5px 0' }}>Wind Speed: {loc.wind_speed} m/s</p>
                  <p style={{ margin: '5px 0' }}>Wind Direction: {getWindDirection(loc.wind_direction)} ({loc.wind_direction}°)</p>
                  <p style={{ margin: '5px 0' }}>Clouds: {loc.clouds}%</p>
                  <p style={{ margin: '5px 0' }}>Pressure: {loc.pressure} hPa</p>
                </>
              )}
              {onRemoveLocation && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveLocation(loc.id)
                  }}
                  style={{
                    width: '100%',
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Remove Location
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default worldMap
