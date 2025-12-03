"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamically load Leaflet Map (SSR OFF)
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
});

// Example destination list — replace with your API
const destinationList = [
  { id: 1, city: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777 },
  { id: 2, city: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  { id: 3, city: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { id: 4, city: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
];

export default function FullTourPage() {
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  return (
    <div className="p-6">
      {/* View Toggle Buttons */}
      <div className="flex gap-4 mb-5">
        <button
          className={`px-4 py-2 rounded ${
            viewMode === "list" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewMode("list")}
        >
          List View
        </button>

        <button
          className={`px-4 py-2 rounded ${
            viewMode === "map" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setViewMode("map")}
        >
          Map View
        </button>
      </div>

      {/* LIST VIEW */}
      {viewMode === "list" && (
        <div className="grid grid-cols-1 gap-4">
          {destinationList.map((dest) => (
            <div
              key={dest.id}
              className="p-4 bg-white shadow rounded border border-gray-200"
            >
              <h2 className="text-lg font-semibold">{dest.city}</h2>
              <p className="text-gray-600">{dest.state}</p>
            </div>
          ))}
        </div>
      )}

      {/* MAP VIEW */}
      {viewMode === "map" && <MapView destinations={destinationList} />}
    </div>
  );
}
