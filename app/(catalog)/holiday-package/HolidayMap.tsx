"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useRouter } from "next/navigation";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const icon =
  typeof window !== "undefined"
    ? new L.Icon({
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    : undefined;

export default function HolidayMap({
  destinations,
}: {
  destinations: any[];
}) {
  const router = useRouter();

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {destinations.map((d) => (
        <Marker key={d.id} position={[d.lat, d.lng]} icon={icon}>
          <Popup>
            <div
              style={{ cursor: "pointer", textAlign: "center" }}
              onClick={() =>
                router.push(`/holidaydestinationdetails/?${d.id}`)
              }
            >
              <img
                src={d.image}
                style={{
                  width: 150,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 8,
                }}
              />
              <p style={{ fontWeight: "bold", marginTop: 6 }}>
                {d.city}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
