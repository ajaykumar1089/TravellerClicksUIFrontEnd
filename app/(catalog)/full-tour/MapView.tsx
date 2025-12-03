"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default Leaflet icon paths
const DefaultIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView({ destinations }: any) {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <MapContainer
        center={[20.5937, 78.9629]} // Center on India
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {destinations.map((dest: any) => (
          <Marker key={dest.id} position={[dest.lat, dest.lng]}>
            <Popup>
              <strong>{dest.city}</strong> <br />
              {dest.state}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
