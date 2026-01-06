import { useState, useEffect } from 'react'
import './App.css'
import WorldMap from './components/worldMap'
import api from './services/api'

function App() {
  const [locations, setLocations] = useState([])
  const [previewWeather, setPreviewWeather] = useState<any>(null)
  const [previewPosition, setPreviewPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      const response = await api.getActiveLocations()
      setLocations(response.data)
    } catch (err) {
      console.error('Error fetching locations:', err)
    }
  }

  const handleLocationClick = async (lat: number, lng: number) => {
    try {
      setLoadingPreview(true)
      setPreviewPosition({ lat, lng })
      
      const response = await api.previewWeather(lat, lng)
      setPreviewWeather(response.data)
    } catch (err) {
      console.error('Error fetching weather preview:', err)
      setPreviewWeather(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleAddLocation = async () => {
    if (!previewPosition) return
    
    try {
      await api.addLocation(previewPosition.lat, previewPosition.lng)
      await fetchLocations()
      setPreviewWeather(null)
      setPreviewPosition(null)
    } catch (err) {
      console.error('Error adding location:', err)
      alert('Failed to add location')
    }
  }

  const handleCancelPreview = () => {
    setPreviewWeather(null)
    setPreviewPosition(null)
  }

  const handleRemoveLocation = async (locationId: number) => {
    if (!confirm('Are you sure you want to remove this location?')) return
    
    try {
      await api.removeLocation(locationId)
      await fetchLocations()
    } catch (err) {
      console.error('Error removing location:', err)
      alert('Failed to remove location')
    }
  }

  return (
    <WorldMap 
      locations={locations}
      onLocationClick={handleLocationClick}
      previewWeather={previewWeather}
      previewPosition={previewPosition}
      loadingPreview={loadingPreview}
      onAddLocation={handleAddLocation}
      onCancelPreview={handleCancelPreview}
      onRemoveLocation={handleRemoveLocation}
    />
  )
}

export default App
