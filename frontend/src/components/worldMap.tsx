import { MapContainer, Marker, TileLayer, useMapEvents, ZoomControl, useMap } from "react-leaflet"
import 'leaflet/dist/leaflet.css'
import { useState, useEffect, useRef } from "react"
import Sidebar from "./Sidebar"

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

interface MapControllerProps {
    sidebarOpen: boolean;
    targetPosition?: { lat: number; lng: number } | null;
}

function MapController({ sidebarOpen, targetPosition }: MapControllerProps) {
    const map = useMap()
    const hasAdjusted = useRef(false)

    useEffect(() => {
        if (sidebarOpen && targetPosition && !hasAdjusted.current) {
            setTimeout(() => {
                const sidebarWidth = 400
                const point = map.latLngToContainerPoint([targetPosition.lat, targetPosition.lng])

                if (point.x < sidebarWidth) {
                    const shiftAmount = sidebarWidth + 200 - point.x

                    map.panBy([-shiftAmount, 0], { animate: true, duration: 0.3 })
                    hasAdjusted.current = true
                }
            }, 100)
        } else if (!sidebarOpen && hasAdjusted.current) {
            hasAdjusted.current = false
        }
    }, [sidebarOpen, targetPosition, map])

    return null
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
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const handleMapClick = (latlng: { lat: number; lng: number }) => {
        setSelectedLocation(null)
        setSidebarOpen(true)
        if (onLocationClick) {
            onLocationClick(latlng.lat, latlng.lng)
        }
    }

    const handleMarkerClick = (location: Location) => {
        setSelectedLocation(location)
        setSidebarOpen(true)
    }

    const handleCloseSidebar = () => {
        setSidebarOpen(false)
        setSelectedLocation(null)
        if (onCancelPreview) {
            onCancelPreview()
        }
    }

    const handleAddAndClose = () => {
        if (onAddLocation) {
            onAddLocation()
        }
        setSidebarOpen(false)
    }

    const handleRemoveAndClose = (locationId: number) => {
        if (onRemoveLocation) {
            onRemoveLocation(locationId)
        }
        setSidebarOpen(false)
        setSelectedLocation(null)
    }

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Sidebar
                isOpen={sidebarOpen}
                selectedLocation={selectedLocation}
                previewWeather={previewWeather}
                previewPosition={previewPosition}
                loadingPreview={loadingPreview}
                onClose={handleCloseSidebar}
                onAddLocation={handleAddAndClose}
                onRemoveLocation={handleRemoveAndClose}
            />

            <MapContainer
                center={[0, 0]}
                zoom={3}
                minZoom={2}
                maxBounds={[[-85, -Infinity], [85, Infinity]]}
                maxBoundsViscosity={1.0}
                worldCopyJump={false}
                zoomControl={false}
                style={{ width: '100%', height: '100%' }}
            >
                <ZoomControl position="bottomright" />
                <MapController
                    sidebarOpen={sidebarOpen}
                    targetPosition={selectedLocation ? { lat: parseFloat(selectedLocation.latitude), lng: parseFloat(selectedLocation.longitude) } : previewPosition}
                />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapClickHandler onMapClick={handleMapClick} />

                {previewPosition && (
                    <Marker position={[previewPosition.lat, previewPosition.lng]} />
                )}

                {locations.map(loc => (
                    <Marker
                        key={loc.id}
                        position={[parseFloat(loc.latitude), parseFloat(loc.longitude)]}
                        eventHandlers={{
                            click: () => handleMarkerClick(loc)
                        }}
                    />
                ))}
            </MapContainer>
        </div>
    )
}

export default worldMap
