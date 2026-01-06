import { MapContainer, TileLayer } from "react-leaflet"

function worldMap() {
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
    </MapContainer>
  )
}

export default worldMap
